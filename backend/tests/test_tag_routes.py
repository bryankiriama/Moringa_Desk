import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.question_repo import create_question
from backend.app.repositories.tag_repo import create_tag
from backend.app.repositories.user_repo import get_user_by_email


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

    tags_module = importlib.import_module("backend.app.api.tags")
    importlib.reload(tags_module)

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


def test_list_tags_returns_created() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        create_tag(session, name="Python")
        create_tag(session, name="React")

    response = client.get("/tags")
    assert response.status_code == 200
    names = [t["name"] for t in response.json()]
    assert names == ["python", "react"]


def test_admin_can_create_tag_non_admin_forbidden() -> None:
    client, session_module = setup_app_with_sqlite()

    admin_token = _register_and_get_token(client, "admin@example.com")
    user_token = _register_and_get_token(client, "user@example.com")

    with session_module.SessionLocal() as session:
        admin_user = get_user_by_email(session, "admin@example.com")
        admin_user.role = "admin"
        session.commit()

    response_forbidden = client.post(
        "/tags",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"name": "Python"},
    )
    assert response_forbidden.status_code == 403

    response_admin = client.post(
        "/tags",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Python"},
    )
    assert response_admin.status_code == 200
    assert response_admin.json()["name"] == "python"


def test_attach_tags_requires_auth_and_owner() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    other_token = _register_and_get_token(client, "other@example.com")
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
        tag1 = create_tag(session, name="Python")
        tag2 = create_tag(session, name="DevOps")

    unauth = client.post(
        f"/questions/{question.id}/tags",
        json={"tag_ids": [str(tag1.id), str(tag2.id)]},
    )
    assert unauth.status_code == 401

    forbidden = client.post(
        f"/questions/{question.id}/tags",
        headers={"Authorization": f"Bearer {other_token}"},
        json={"tag_ids": [str(tag1.id), str(tag2.id)]},
    )
    assert forbidden.status_code == 403

    ok = client.post(
        f"/questions/{question.id}/tags",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={"tag_ids": [str(tag1.id), str(tag2.id)]},
    )
    assert ok.status_code == 200
    names = [t["name"] for t in ok.json()]
    assert names == ["devops", "python"]


def test_attach_tags_missing_question_returns_404() -> None:
    client, _ = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")

    response = client.post(
        "/questions/00000000-0000-0000-0000-000000000000/tags",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={"tag_ids": [str(uuid.uuid4())]},
    )
    assert response.status_code == 404
