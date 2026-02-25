import json
import redis
from app.core.config import settings


# Single Redis client configured via env (defaults to localhost)
if settings.REDIS_URL:
    r = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
else:
    r = None

def get_cache(key:str):
    data = r.get(key)
    return json.loads(data) if data else None

def set_cache(key:str, value, ttl=60):
    r.set(key, json.dumps(value), ex=ttl)

def delete_cache(prefix:str):
    for key in r.keys(f"{prefix}*"):
        r.delete(key)
