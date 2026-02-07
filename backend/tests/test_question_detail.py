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

    questions_module = importlib.import_module("backend.app.api.questions")
    importlib.reload(questions_module)

    Base.metadata.create_all(bind=session_module.engine)

    main_module = importlib.import_module("backend.app.main")
    importlib.reload(main_module)

    return TestClient(main_module.app), session_module


def test_get_question_not_found() -> None:
    client, _ = setup_app_with_sqlite()

    response = client.get("/questions/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_get_question_found() -> None:
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

    response = client.get(f"/questions/{question.id}")
    assert response.status_code == 200
    assert response.json()["id"] == str(question.id)
