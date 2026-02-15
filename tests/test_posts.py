from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_token():
    client.post("/users/signup", json={
        "email": "post@test.com",
        "password": "123456"
    })
    res = client.post("/users/login", json={
        "email": "post@test.com",
        "password": "123456"
    })

    return res.json()["access_token"]

def test_create_post():
    token = get_token()

    res = client.post(
        "/posts",
        json={
            "content" : "hello"
            },
        headers= {"Authorization": f"Bearer {token}"}
    )

    assert res.status_code == 200
    assert res.json()["content"] == "hello"