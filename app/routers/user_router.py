from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import UserCreate, UserResponse,Token
from app.services.user_service import create_user, authenticate_user
from app.services.auth_service import create_access_token
from app.models import User
from app.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/signup", response_model= UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user.email, user.password)

@router.post("/login", response_model=Token)
def login(user:UserCreate, db:Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"user_id":db_user.id})
    return {"access_token":token, "token_type":"bearer"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}