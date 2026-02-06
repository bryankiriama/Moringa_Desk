import importlib
import os

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.models.password_reset import PasswordResetToken
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

    Base.metadata.create_all(bind=session_module.engine)

    main_module = importlib.import_module("backend.app.main")
    importlib.reload(main_module)

    return TestClient(main_module.app), session_module


def test_forgot_password_returns_200_for_existing_and_unknown_email() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        user = User(email="test@example.com", full_name="Test", password_hash="x")
        session.add(user)
        session.commit()

    response_existing = client.post(
        "/auth/forgot-password", json={"email": "test@example.com"}
    )
    response_unknown = client.post(
        "/auth/forgot-password", json={"email": "unknown@example.com"}
    )

    assert response_existing.status_code == 200
    assert response_unknown.status_code == 200


def test_reset_password_valid_token_updates_password() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        user = User(email="test@example.com", full_name="Test", password_hash="x")
        session.add(user)
        session.commit()

    client.post("/auth/forgot-password", json={"email": "test@example.com"})

    # request a new token and capture it by calling service directly
    with session_module.SessionLocal() as session:
        user = session.query(User).filter_by(email="test@example.com").first()
        from backend.app.services.password_reset_service import create_reset_token

        raw = create_reset_token(session, user=user, expires_in_minutes=30)

    response = client.post(
        "/auth/reset-password",
        json={"token": raw, "new_password": "newpassword123"},
    )
    assert response.status_code == 200

    login_response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "newpassword123"},
    )
    assert login_response.status_code == 200


def test_reset_password_invalid_token_returns_400() -> None:
    client, _ = setup_app_with_sqlite()

    response = client.post(
        "/auth/reset-password",
        json={"token": "invalid", "new_password": "newpassword123"},
    )
    assert response.status_code == 400


def test_reset_password_reused_token_returns_400() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        user = User(email="test@example.com", full_name="Test", password_hash="x")
        session.add(user)
        session.commit()

        from backend.app.services.password_reset_service import create_reset_token

        raw = create_reset_token(session, user=user, expires_in_minutes=30)

    first = client.post(
        "/auth/reset-password",
        json={"token": raw, "new_password": "newpassword123"},
    )
    assert first.status_code == 200

    second = client.post(
        "/auth/reset-password",
        json={"token": raw, "new_password": "newpassword123"},
    )
    assert second.status_code == 400


def test_reset_password_expired_token_returns_400() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        user = User(email="test@example.com", full_name="Test", password_hash="x")
        session.add(user)
        session.commit()

        from backend.app.services.password_reset_service import create_reset_token

        raw = create_reset_token(session, user=user, expires_in_minutes=30)

        record = session.query(PasswordResetToken).first()
        record.expires_at = record.expires_at.replace(year=2000)
        session.commit()

    response = client.post(
        "/auth/reset-password",
        json={"token": raw, "new_password": "newpassword123"},
    )
    assert response.status_code == 400
