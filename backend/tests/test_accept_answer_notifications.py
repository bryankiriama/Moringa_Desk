import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.answer_repo import create_answer
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


def test_accept_other_users_answer_creates_notification() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    answerer_token = _register_and_get_token(client, "answerer@example.com")
    owner_id = _decode_sub(owner_token)
    answerer_id = _decode_sub(answerer_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="Question title",
            body="Question body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )
        answer = create_answer(
            session,
            question_id=question.id,
            author_id=answerer_id,
            body="This is a helpful answer that explains the solution clearly.",
        )

    response = client.post(
        f"/questions/{question.id}/answers/{answer.id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert response.status_code == 200

    with session_module.SessionLocal() as session:
        items = list_notifications(session, user_id=answerer_id)
        assert len(items) == 1
        payload = items[0].payload
        assert items[0].type == "accepted_answer"
        assert payload.get("question_id") == str(question.id)
        assert payload.get("answer_id") == str(answer.id)
        assert payload.get("actor_id") == str(owner_id)


def test_accept_own_answer_no_notification() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="Question title",
            body="Question body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )
        answer = create_answer(
            session,
            question_id=question.id,
            author_id=owner_id,
            body="This is a helpful answer that explains the solution clearly.",
        )

    response = client.post(
        f"/questions/{question.id}/answers/{answer.id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert response.status_code == 200

    with session_module.SessionLocal() as session:
        items = list_notifications(session, user_id=owner_id)
        assert len(items) == 0
