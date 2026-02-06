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

    answers_module = importlib.import_module("backend.app.api.answers")
    importlib.reload(answers_module)

    Base.metadata.create_all(bind=session_module.engine)

    main_module = importlib.import_module("backend.app.main")
    importlib.reload(main_module)

    return TestClient(main_module.app), session_module


def _register_and_get_token(client: TestClient) -> str:
    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Test User",
        },
    )
    return response.json()["access_token"]


def test_create_answer_requires_auth() -> None:
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
        f"/questions/{question.id}/answers",
        json={"body": "This is a helpful answer that explains the solution clearly."},
    )

    assert response.status_code == 401


def test_create_answer_authenticated() -> None:
    client, session_module = setup_app_with_sqlite()
    token = _register_and_get_token(client)

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
        f"/questions/{question.id}/answers",
        headers={"Authorization": f"Bearer {token}"},
        json={"body": "This is a helpful answer that explains the solution clearly."},
    )

    assert response.status_code == 200


def test_list_answers_returns_created() -> None:
    client, session_module = setup_app_with_sqlite()
    token = _register_and_get_token(client)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=uuid.uuid4(),
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )

    client.post(
        f"/questions/{question.id}/answers",
        headers={"Authorization": f"Bearer {token}"},
        json={"body": "This is a helpful answer that explains the solution clearly."},
    )

    response = client.get(f"/questions/{question.id}/answers")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1


def test_create_answer_missing_question_returns_404() -> None:
    client, _ = setup_app_with_sqlite()
    token = _register_and_get_token(client)

    response = client.post(
        "/questions/00000000-0000-0000-0000-000000000000/answers",
        headers={"Authorization": f"Bearer {token}"},
        json={"body": "This is a helpful answer that explains the solution clearly."},
    )

    assert response.status_code == 404
