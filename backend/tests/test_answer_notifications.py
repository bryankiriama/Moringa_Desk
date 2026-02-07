import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.notification_repo import list_notifications
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

    answers_module = importlib.import_module("backend.app.api.answers")
    importlib.reload(answers_module)

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


def test_notification_created_for_question_owner_on_answer() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    answerer_token = _register_and_get_token(client, "answerer@example.com")

    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )

    response = client.post(
        f"/questions/{question.id}/answers",
        headers={"Authorization": f"Bearer {answerer_token}"},
        json={"body": "This is a helpful answer that explains the solution clearly."},
    )
    assert response.status_code == 200

    with session_module.SessionLocal() as session:
        items = list_notifications(session, user_id=owner_id)
        assert len(items) == 1
        assert items[0].type == "answer_posted"


def test_no_notification_for_self_answer() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )

    response = client.post(
        f"/questions/{question.id}/answers",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={"body": "This is a helpful answer that explains the solution clearly."},
    )
    assert response.status_code == 200

    with session_module.SessionLocal() as session:
        items = list_notifications(session, user_id=owner_id)
        assert len(items) == 0
