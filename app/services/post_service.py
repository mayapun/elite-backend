from sqlalchemy.orm import Session
from app.models import Post


def create_post(db: Session, content:str, user_id: int):
    post = Post(content=content, user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_posts(db:Session):
    return db.query(Post).all()

def get_posts_by_user(db:Session, user_id:int):
    return db.query(Post).filter(Post.user_id == user_id).all()

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