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

    questions_module = importlib.import_module("backend.app.api.questions")
    importlib.reload(questions_module)

    votes_module = importlib.import_module("backend.app.api.votes")
    importlib.reload(votes_module)

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


def test_vote_requires_auth() -> None:
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

    response = client.post(
        "/votes",
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "value": 1,
        },
    )

    assert response.status_code == 401


def test_vote_on_others_question_succeeds() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    voter_token = _register_and_get_token(client, "voter@example.com")
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
        "/votes",
        headers={"Authorization": f"Bearer {voter_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "value": 1,
        },
    )

    assert response.status_code == 200
    assert response.json()["value"] == 1


def test_self_vote_forbidden() -> None:
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
        "/votes",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "value": 1,
        },
    )

    assert response.status_code == 403


def test_switching_vote_updates_value() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    voter_token = _register_and_get_token(client, "voter@example.com")
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

    first = client.post(
        "/votes",
        headers={"Authorization": f"Bearer {voter_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "value": 1,
        },
    )
    assert first.status_code == 200
    assert first.json()["value"] == 1

    second = client.post(
        "/votes",
        headers={"Authorization": f"Bearer {voter_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "value": -1,
        },
    )
    assert second.status_code == 200
    assert second.json()["value"] == -1
