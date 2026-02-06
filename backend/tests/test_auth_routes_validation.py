from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_register_missing_email() -> None:
    response = client.post("/auth/register", json={"password": "password123", "full_name": "Test"})
    assert response.status_code == 422


def test_register_missing_password() -> None:
    response = client.post("/auth/register", json={"email": "test@example.com", "full_name": "Test"})
    assert response.status_code == 422


def test_register_invalid_email() -> None:
    response = client.post(
        "/auth/register",
        json={"email": "not-an-email", "password": "password123", "full_name": "Test"},
    )
    assert response.status_code == 422


def test_register_short_password() -> None:
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "short", "full_name": "Test"},
    )
    assert response.status_code == 422


def test_login_missing_email() -> None:
    response = client.post("/auth/login", json={"password": "password123"})
    assert response.status_code == 422


def test_login_missing_password() -> None:
    response = client.post("/auth/login", json={"email": "test@example.com"})
    assert response.status_code == 422


def test_login_invalid_email() -> None:
    response = client.post("/auth/login", json={"email": "not-an-email", "password": "password123"})
    assert response.status_code == 422


def test_login_short_password() -> None:
    response = client.post("/auth/login", json={"email": "test@example.com", "password": "short"})
    assert response.status_code == 422
