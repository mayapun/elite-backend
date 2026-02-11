from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(password:str, hashed:str):
    return pwd_context.verify(password, hashed)

def create_user(db:Session, email:str,password:str):
    hashed_pw = hash_password(password)
    user = User(email=email, password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email:str, password:str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user
