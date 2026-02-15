from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def test_singup_and_login():
    res = client.post("/users/signup", json={
        "email": f"test_{uuid.uuid4().hex[:8]}@test.com",
        "password": "123456"
    })

    assert res.status_code == 200

    res = client.post("/users/login", json={
        "email": "test@test.com",
        "password": "123456"
    })

    assert res.status_code == 200
    assert "access_token" in res.json()