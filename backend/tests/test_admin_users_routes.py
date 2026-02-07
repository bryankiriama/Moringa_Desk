import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
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

    admin_module = importlib.import_module("backend.app.api.admin_users")
    importlib.reload(admin_module)

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


def test_admin_users_access_control() -> None:
    client, session_module = setup_app_with_sqlite()

    admin_token = _register_and_get_token(client, "admin@example.com")
    user_token = _register_and_get_token(client, "user@example.com")

    with session_module.SessionLocal() as session:
        admin_user = get_user_by_email(session, "admin@example.com")
        admin_user.role = "admin"
        session.commit()

    unauth = client.get("/admin/users")
    assert unauth.status_code == 401

    forbidden = client.get(
        "/admin/users", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert forbidden.status_code == 403

    ok = client.get(
        "/admin/users", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert ok.status_code == 200
    assert len(ok.json()) == 2


def test_admin_can_update_role_and_prevent_self_demote() -> None:
    client, session_module = setup_app_with_sqlite()

    admin_token = _register_and_get_token(client, "admin@example.com")
    user_token = _register_and_get_token(client, "user@example.com")
    admin_id = _decode_sub(admin_token)
    user_id = _decode_sub(user_token)

    with session_module.SessionLocal() as session:
        admin_user = get_user_by_email(session, "admin@example.com")
        admin_user.role = "admin"
        session.commit()

    self_demote = client.patch(
        f"/admin/users/{admin_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"role": "student"},
    )
    assert self_demote.status_code == 400

    promote = client.patch(
        f"/admin/users/{user_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"role": "admin"},
    )
    assert promote.status_code == 200
    assert promote.json()["role"] == "admin"
