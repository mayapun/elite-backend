from sqlalchemy.orm import Session, joinedload
from app.models import Post, AuditLog
from app.exceptions import NotFoundException, ForbiddenException
from typing import Optional
from sqlalchemy import desc
from sqlalchemy.exc import SQLAlchemyError
from app.logger import logger
from app.cache import delete_cache

def create_post(db: Session, content:str, user_id: int):
    post = Post(content=content, user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_posts(db:Session, limit:int, offset:int):
    return (
        db.query(Post)
        .filter(Post.is_deleted == False)
        .order_by(Post.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

def get_posts_by_user(db:Session, user_id:int, limit:int, offset:int):
    return db.query(Post).filter(Post.user_id == user_id, Post.is_deleted == False).order_by(Post.id.desc()).offset(offset).limit(limit).all()

def delete_post(db: Session, post_id:int, user_id:int):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise NotFoundException("Post not found")
    
    if post.user_id != user_id:
        raise ForbiddenException("You can't delete this post")

    post.is_deleted = True
    db.commit()
    delete_cache("posts")
    return post

def update_post(db:Session, post_id:int, user_id:int, content:str):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise NotFoundException("Post not found")
    
    if post.user_id != user_id:
        raise ForbiddenException("You can't update this post")
    
    post.content  = content
    db.commit()
    db.refresh(post)
    return post

def get_posts_cursor(db: Session, limit:int, cursor:Optional[int]):
    q = db.query(Post).filter(Post.is_deleted == False).order_by(desc(Post.id))

    if cursor is not None:
        q = q.filter(Post.id < cursor)

    items = q.limit(limit).all()
    next_cursor = items[-1].id if len(items) == limit else None
    return items, next_cursor

def get_my_posts_cursor(db: Session, user_id:int, limit:int, cursor: Optional[int]):
    q = (
        db.query(Post)
        .filter(Post.is_deleted == False)
        .filter(Post.user_id == user_id)
        .order_by(desc(Post.id))
    )

    if cursor is not None:
        q = q.filter(Post.id < cursor)

    items = q.limit(limit).all()
    next_cursor = items[-1].id if len(items) == limit else None
    return items, next_cursor

def get_posts_with_users(db: Session, limit: int = 20):
    return(
        db.query(Post)
        .filter(Post.is_deleted == False)
        .options(joinedload(Post.user))
        .order_by(Post.id.desc())
        .limit(limit)
        .all()
    )

def create_post_with_audit(db: Session, content: str, user_id:int):
    logger.info(f"Creating post for user {user_id}")
    try:
        post = Post(content=content, user_id=user_id)
        db.add(post)
        db.flush()

        log = AuditLog(action="CREATE_POST", user_id=user_id, post_id=post.id)
        db.add(log)

        db.commit()
        db.refresh(post)
        delete_cache("posts")
        logger.info(f"Post {post.id} created")
        return post
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Failed creating post")
        raise