import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.notification_repo import create_notification


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

    notifications_module = importlib.import_module("backend.app.api.notifications")
    importlib.reload(notifications_module)

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


def test_notifications_requires_auth() -> None:
    client, _ = setup_app_with_sqlite()

    response = client.get("/notifications")
    assert response.status_code == 401


def test_list_notifications_and_unread_filter() -> None:
    client, session_module = setup_app_with_sqlite()

    token = _register_and_get_token(client, "user@example.com")
    user_id = _decode_sub(token)

    with session_module.SessionLocal() as session:
        create_notification(
            session,
            user_id=user_id,
            type="answer_posted",
            payload={"question_id": str(uuid.uuid4())},
        )
        n2 = create_notification(
            session,
            user_id=user_id,
            type="vote_received",
            payload={"question_id": str(uuid.uuid4())},
        )
        n2.is_read = True
        session.commit()

    response = client.get(
        "/notifications", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) == 2

    unread = client.get(
        "/notifications",
        params={"unread_only": "true"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert unread.status_code == 200
    assert len(unread.json()) == 1


def test_mark_all_read_updates_count() -> None:
    client, session_module = setup_app_with_sqlite()

    token = _register_and_get_token(client, "user@example.com")
    user_id = _decode_sub(token)

    with session_module.SessionLocal() as session:
        create_notification(
            session,
            user_id=user_id,
            type="answer_posted",
            payload={"question_id": str(uuid.uuid4())},
        )
        create_notification(
            session,
            user_id=user_id,
            type="vote_received",
            payload={"question_id": str(uuid.uuid4())},
        )

    response = client.post(
        "/notifications/mark-all-read",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["updated"] == 2
