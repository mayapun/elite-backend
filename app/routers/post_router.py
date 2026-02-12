from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from app.db import get_db
from app.schemas import PostCreate, PostResponse, PostUpdate
from app.services.post_service import create_post, get_posts, get_posts_by_user, delete_post, update_post
from app.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostResponse)
def create_new_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_post(db, post.content, current_user.id)

@router.get("/", response_model=list[PostResponse])
def list_posts(db: Session = Depends(get_db)):
    return get_posts(db)

@router.get("/me", response_model=list[PostResponse])
def get_my_posts(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_posts_by_user(db, current_user.id)

@router.delete("/{post_id}")
def delete_my_post(
    post_id:int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = delete_post(db, post_id, current_user.id)
    if result is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if result == "FORBIDDEN":
        raise HTTPException(status_code=403, detail="Not allowed")
    
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