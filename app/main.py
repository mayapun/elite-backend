from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.db import Base, engine, get_db
from app.routers import user_router, post_router
from app.models import User

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router.router)
app.include_router(post_router.router)
@app.get('/')
def root():
    return {'status': 'running'}

@app.post('/users/')
def create_user(
    email:str,
    password:str,
    db: Session = Depends(get_db)
):
    user = User(email=email, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user