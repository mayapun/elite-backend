from sqlalchemy.orm import Session, joinedload
from app.models import Post
from typing import Optional
from sqlalchemy import desc

def create_post(db: Session, content:str, user_id: int):
    post = Post(content=content, user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_posts(db:Session, limit:int, offset:int):
    return (
        db.query(Post)
        .order_by(Post.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

def get_posts_by_user(db:Session, user_id:int, limit:int, offset:int):
    return db.query(Post).filter(Post.user_id == user_id).order_by(Post.id.desc()).offset(offset).limit(limit).all()

def delete_post(db: Session, post_id:int, user_id:int):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return None
    
    if post.user_id != user_id:
        return "FORBIDDEN"

    db.delete(post)
    db.commit()
    return post

def update_post(db:Session, post_id:int, user_id:int, content:str):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        return None
    
    if post.user_id != user_id:
        return "FORBIDDEN"
    
    post.content  = content
    db.commit()
    db.refresh(post)
    return post

def get_posts_cursor(db: Session, limit:int, cursor:Optional[int]):
    q = db.query(Post).order_by(desc(Post.id))

    if cursor is not None:
        q = q.filter(Post.id < cursor)

    items = q.limit(limit).all()
    next_cursor = items[-1].id if len(items) == limit else None
    return items, next_cursor

def get_my_posts_cursor(db: Session, user_id:int, limit:int, cursor: Optional[int]):
    q = (
        db.query(Post)
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
        .options(joinedload(Post.user))
        .order_by(Post.id.desc())
        .limit(limit)
        .all()
    )