import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.answer_repo import create_answer
from backend.app.repositories.question_repo import create_question
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

    flags_module = importlib.import_module("backend.app.api.flags")
    importlib.reload(flags_module)

    questions_module = importlib.import_module("backend.app.api.questions")
    importlib.reload(questions_module)

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


def test_flag_requires_auth() -> None:
    client, _ = setup_app_with_sqlite()

    response = client.post(
        "/flags",
        json={
            "target_type": "question",
            "target_id": str(uuid.uuid4()),
            "reason": "Spam content",
        },
    )
    assert response.status_code == 401


def test_flag_missing_target_returns_404() -> None:
    client, _ = setup_app_with_sqlite()

    token = _register_and_get_token(client, "user@example.com")

    response = client.post(
        "/flags",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "target_type": "question",
            "target_id": str(uuid.uuid4()),
            "reason": "Spam content",
        },
    )
    assert response.status_code == 404


def test_flag_self_forbidden() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="Question one title",
            body="Question one body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )

    response = client.post(
        "/flags",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "reason": "Spam content",
        },
    )
    assert response.status_code == 403


def test_duplicate_flag_returns_409() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    other_token = _register_and_get_token(client, "other@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="Question one title",
            body="Question one body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )

    first = client.post(
        "/flags",
        headers={"Authorization": f"Bearer {other_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "reason": "Spam content",
        },
    )
    assert first.status_code == 200

    second = client.post(
        "/flags",
        headers={"Authorization": f"Bearer {other_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "reason": "Spam content",
        },
    )
    assert second.status_code == 409


def test_admin_list_flags() -> None:
    client, session_module = setup_app_with_sqlite()

    admin_token = _register_and_get_token(client, "admin@example.com")
    user_token = _register_and_get_token(client, "user@example.com")

    with session_module.SessionLocal() as session:
        admin_user = get_user_by_email(session, "admin@example.com")
        admin_user.role = "admin"
        session.commit()

        question = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Question one title",
            body="Question one body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )

        create_answer(
            session,
            question_id=question.id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )

    create_flag_response = client.post(
        "/flags",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "target_type": "question",
            "target_id": str(question.id),
            "reason": "Spam content",
        },
    )
    assert create_flag_response.status_code == 200

    non_admin_list = client.get(
        "/flags", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert non_admin_list.status_code == 403

    admin_list = client.get(
        "/flags", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert admin_list.status_code == 200
    assert len(admin_list.json()) == 1
