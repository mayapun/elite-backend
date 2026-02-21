import json
import redis
from app.config import REDIS_URL

# Single Redis client configured via env (defaults to localhost)
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_cache(key:str):
    data = r.get(key)
    return json.loads(data) if data else None

def set_cache(key:str, value, ttl=60):
    r.set(key, json.dumps(value), ex=ttl)

def delete_cache(prefix:str):
    for key in r.keys(f"{prefix}*"):
        r.delete(key)
