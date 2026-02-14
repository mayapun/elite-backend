from fastapi import Query, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from fastapi.encoders import jsonable_encoder

from app.db import get_db
from app.schemas import PostCreate, PostResponse, PostUpdate, PaginatedPosts, PostWithuserResponse
from app.services.post_service import create_post, get_posts, get_posts_by_user, delete_post, update_post, get_posts_cursor, get_my_posts_cursor, get_posts_with_users, create_post_with_audit
from app.dependencies import get_current_user
from app.models import User, Post
from app.cache import get_cache, set_cache

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostResponse)
def create_new_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_post_with_audit(db, post.content, current_user.id)

@router.get("/", response_model=PaginatedPosts)
def list_posts(db: Session = Depends(get_db), limit:int = Query(10, le=50), cursor: Optional[int] = None):
    cache_key = f"posts:{limit}:{cursor}"
    cached = get_cache(cache_key)
    if cached:
        return cached
    
    items, next_cursor = get_posts_cursor(db, limit, cursor)
    result = {"items": items, "next_cursor": next_cursor}

    encoded = jsonable_encoder(result)
    set_cache(cache_key, encoded)
    return result

@router.get("/me", response_model=PaginatedPosts)
def get_my_posts(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit:int = Query(10, le=50),
    cursor: Optional[int] = None
):
    items, next_cursor = get_my_posts_cursor(db, current_user.id, limit, cursor)
    return { "items": items, "next_cursor": next_cursor}

@router.delete("/{post_id}")
def delete_my_post(
    post_id:int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    delete_post(db, post_id, current_user.id)
    return {"status": "deleted"}

@router.put("/{post_id}", response_model=PostResponse)
def update_my_post(
    post_id:int,
    post:PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = update_post(db, post_id, current_user.id, post.content)

    if result is None:
        raise HTTPException(status_code=404)

    if result == "FORBIDDEN":
        raise HTTPException(status_code=403)
    
    return result

@router.get("/with-users", response_model=list[PostWithuserResponse])
def posts_with_users(db: Session = Depends(get_db)):
    return get_posts_with_users(db, limit=20)
