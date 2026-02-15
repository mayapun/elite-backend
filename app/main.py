import time
import uuid
from fastapi import FastAPI, Depends, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.exceptions import AppException
from fastapi.staticfiles import StaticFiles

from app.db import Base, engine, get_db
from app.routers import user_router, post_router
from app.models import User
from app.logger import logger

app = FastAPI()

app.include_router(user_router.router)
app.include_router(post_router.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.middleware("http")
async def log_requests(request:Request, call_next):
    request_id = str(uuid.uuid4())[:6]
    start_time = time.time()

    logger.info(f"[REQ {request_id}] START {request.method} {request.url.path}")

    try:
        response = await call_next(request)
    except Exception:
        logger.exception(f"[REQ {request_id}] ERROR")
        raise

    duration = (time.time() - start_time) * 1000
    logger.info(
        f"[REQ {request_id}] END {request.method} {request.url.path}"
        f" status={response.status_code} duration={duration:.2f}ms"
    )
    return response

@app.exception_handler(AppException)
async def app_exception_handler(request, exc:AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.code,
            "message": exc.message
        },
    )

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