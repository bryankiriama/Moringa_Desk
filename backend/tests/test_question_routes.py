import importlib
import os

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.models.user import User


def setup_app_with_sqlite():
    os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
    os.environ["JWT_SECRET"] = "test-secret"
    os.environ["JWT_ALGORITHM"] = "HS256"
    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

    session_module = importlib.import_module("backend.app.db.session")
    importlib.reload(session_module)

    jwt_module = importlib.import_module("backend.app.core.jwt")
    importlib.reload(jwt_module)

    auth_module = importlib.import_module("backend.app.api.auth")
    importlib.reload(auth_module)

    questions_module = importlib.import_module("backend.app.api.questions")
    importlib.reload(questions_module)

    Base.metadata.create_all(bind=session_module.engine)

    main_module = importlib.import_module("backend.app.main")
    importlib.reload(main_module)

    return TestClient(main_module.app), session_module


def _register_and_get_token(client: TestClient) -> str:
    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Test User",
        },
    )
    return response.json()["access_token"]


def test_create_question_requires_auth() -> None:
    client, _ = setup_app_with_sqlite()

    response = client.post(
        "/questions",
        json={
            "title": "How do I set up a virtual environment?",
            "body": "I need help setting up a virtual environment in Python.",
            "category": "Python",
            "stage": "Foundation",
        },
    )

    assert response.status_code == 401


def test_create_question_authenticated() -> None:
    client, _ = setup_app_with_sqlite()
    token = _register_and_get_token(client)

    response = client.post(
        "/questions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "How do I set up a virtual environment?",
            "body": "I need help setting up a virtual environment in Python.",
            "category": "Python",
            "stage": "Foundation",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "How do I set up a virtual environment?"
    assert data["author_id"] is not None


def test_list_questions_returns_created() -> None:
    client, _ = setup_app_with_sqlite()
    token = _register_and_get_token(client)

    client.post(
        "/questions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "How do I set up a virtual environment?",
            "body": "I need help setting up a virtual environment in Python.",
            "category": "Python",
            "stage": "Foundation",
        },
    )

    response = client.get("/questions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "How do I set up a virtual environment?"
