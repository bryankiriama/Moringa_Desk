import importlib
import os

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.faq_repo import create_faq
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

    faqs_module = importlib.import_module("backend.app.api.faqs")
    importlib.reload(faqs_module)

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


def test_list_faqs_returns_created() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        create_faq(
            session,
            question="How do I reset my password?",
            answer="Use the forgot password link to request a reset email.",
            created_by=None,
        )

    response = client.get("/faqs")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_faq_admin_only() -> None:
    client, session_module = setup_app_with_sqlite()

    admin_token = _register_and_get_token(client, "admin@example.com")
    user_token = _register_and_get_token(client, "user@example.com")

    with session_module.SessionLocal() as session:
        admin_user = get_user_by_email(session, "admin@example.com")
        admin_user.role = "admin"
        session.commit()

    response_forbidden = client.post(
        "/faqs",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "question": "How do I reset my password?",
            "answer": "Use the forgot password link to request a reset email.",
        },
    )
    assert response_forbidden.status_code == 403

    response_admin = client.post(
        "/faqs",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "question": "How do I reset my password?",
            "answer": "Use the forgot password link to request a reset email.",
        },
    )
    assert response_admin.status_code == 200


def test_create_faq_unauthenticated() -> None:
    client, _ = setup_app_with_sqlite()

    response = client.post(
        "/faqs",
        json={
            "question": "How do I reset my password?",
            "answer": "Use the forgot password link to request a reset email.",
        },
    )
    assert response.status_code == 401
