from fastapi import HTTPException
from app.cache import r 

def rate_limit(key: str, limit: int, window:int = 60):
    count = r.incr(key)

    if count == 1:
        r.expire(key, window)

    if count > limit:
        raise HTTPException(status_code=429, detail="Too many requests. Try again later.")