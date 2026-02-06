import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.question_repo import create_question


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

    follows_module = importlib.import_module("backend.app.api.follows")
    importlib.reload(follows_module)

    questions_module = importlib.import_module("backend.app.api.questions")
    importlib.reload(questions_module)

    Base.metadata.create_all(bind=session_module.engine)

    main_module = importlib.import_module("backend.app.main")
    importlib.reload(main_module)

    return TestClient(main_module.app), session_module


def _register_and_get_token(client: TestClient, email: str) -> str:
    response = client.post(
        "/auth/register",
        json={
            "email": email,
            "password": "password123",
            "full_name": "Test User",
        },
    )
    return response.json()["access_token"]


def _decode_sub(token: str) -> uuid.UUID:
    from backend.app.core.jwt import decode_token

    payload = decode_token(token)
    return uuid.UUID(payload["sub"])


def test_follow_requires_auth() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=uuid.uuid4(),
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )

    response = client.post(f"/questions/{question.id}/follow")
    assert response.status_code == 401


def test_follow_unfollow_idempotent_and_list() -> None:
    client, session_module = setup_app_with_sqlite()

    token = _register_and_get_token(client, "user@example.com")
    user_id = _decode_sub(token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=user_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )

    first = client.post(
        f"/questions/{question.id}/follow",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert first.status_code == 200

    second = client.post(
        f"/questions/{question.id}/follow",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert second.status_code == 200

    listed = client.get(
        "/me/follows", headers={"Authorization": f"Bearer {token}"}
    )
    assert listed.status_code == 200
    data = listed.json()
    assert len(data) == 1
    assert data[0]["id"] == str(question.id)

    first_del = client.delete(
        f"/questions/{question.id}/follow",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert first_del.status_code == 200

    second_del = client.delete(
        f"/questions/{question.id}/follow",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert second_del.status_code == 200


def test_follow_missing_question_returns_404() -> None:
    client, _ = setup_app_with_sqlite()

    token = _register_and_get_token(client, "user@example.com")

    response = client.post(
        "/questions/00000000-0000-0000-0000-000000000000/follow",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404
