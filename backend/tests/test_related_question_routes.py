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

    related_module = importlib.import_module("backend.app.api.related_questions")
    importlib.reload(related_module)

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


def test_related_requires_auth() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        q1 = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Question one title",
            body="Question one body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )
        q2 = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Question two title",
            body="Question two body is long enough for validation.",
            category="React",
            stage="Intermediate",
        )

    response = client.post(
        f"/questions/{q1.id}/related",
        json={"related_question_ids": [str(q2.id)]},
    )
    assert response.status_code == 401


def test_related_owner_only_and_list() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    other_token = _register_and_get_token(client, "other@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        q1 = create_question(
            session,
            author_id=owner_id,
            title="Question one title",
            body="Question one body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )
        q2 = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Question two title",
            body="Question two body is long enough for validation.",
            category="React",
            stage="Intermediate",
        )

    forbidden = client.post(
        f"/questions/{q1.id}/related",
        headers={"Authorization": f"Bearer {other_token}"},
        json={"related_question_ids": [str(q2.id)]},
    )
    assert forbidden.status_code == 403

    ok = client.post(
        f"/questions/{q1.id}/related",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={"related_question_ids": [str(q2.id)]},
    )
    assert ok.status_code == 200
    assert len(ok.json()) == 1

    listed = client.get(f"/questions/{q1.id}/related")
    assert listed.status_code == 200
    assert len(listed.json()) == 1


def test_related_missing_question_returns_404() -> None:
    client, _ = setup_app_with_sqlite()

    token = _register_and_get_token(client, "owner@example.com")

    response = client.post(
        "/questions/00000000-0000-0000-0000-000000000000/related",
        headers={"Authorization": f"Bearer {token}"},
        json={"related_question_ids": [str(uuid.uuid4())]},
    )
    assert response.status_code == 404

    response_get = client.get("/questions/00000000-0000-0000-0000-000000000000/related")
    assert response_get.status_code == 404
