from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

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
        