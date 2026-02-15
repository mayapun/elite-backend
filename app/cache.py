import redis
import json

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def get_cache(key:str):
    data = r.get(key)
    return json.loads(data) if data else None

def set_cache(key:str, value, ttl=60):
    r.set(key, json.dumps(value), ex=ttl)

def delete_cache(prefix:str):
    for key in r.keys(f"{prefix}*"):
        r.delete(key)