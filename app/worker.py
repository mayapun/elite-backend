import json
import time
from app.cache import r

QUEUE_NAME = "job_queue"

print("Worker startd...")

while True:
    job_data = r.brpop(QUEUE_NAME, timeout=5)

    if job_data:
        _, job_json = job_data
        job = json.loads(job_json)

        print("Processing job:", job)

        time.sleep(2)