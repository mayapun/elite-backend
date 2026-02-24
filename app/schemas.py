from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    # bcrypt only considers the first 72 bytes of a password; reject longer input up front.
    password: constr(min_length=1, max_length=72)

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PostCreate(BaseModel):
    content: str

class PostResponse(BaseModel):
    id: int
    content: str
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class PostUpdate(BaseModel):
    content: str
    
class PaginatedPosts(BaseModel):
    items: List[PostResponse]
    next_cursor: Optional[int] = None

class UserPublic(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True
    
class PostWithuserResponse(BaseModel):
    id:int
    content: str
    user_id: int
    user: UserPublic

    class Config:
        orm_mode = True
        
