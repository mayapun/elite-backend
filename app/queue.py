import json
from app.cache import r 

QUEUE_NAME = "job_queue"

def enqueue(job_type: str, payload: dict):
    if r is None:
        return
    job = { "type": job_type, "payload": payload}
    r.lpush(QUEUE_NAME, json.dumps(job))
