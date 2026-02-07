import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.question_repo import create_question
from backend.app.repositories.question_tag_repo import attach_tags
from backend.app.repositories.tag_repo import create_tag


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


def test_filter_by_category_stage_q_tag_and_combined() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        q1 = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Python virtual env help",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )
        q2 = create_question(
            session,
            author_id=uuid.uuid4(),
            title="React state update",
            body="Why does useState not update immediately after API call?",
            category="React",
            stage="Intermediate",
        )
        t_python = create_tag(session, name="Python")
        t_devops = create_tag(session, name="DevOps")
        attach_tags(session, question_id=q1.id, tag_ids=[t_python.id])
        attach_tags(session, question_id=q2.id, tag_ids=[t_devops.id])

    by_category = client.get("/questions", params={"category": "Python"})
    assert by_category.status_code == 200
    assert len(by_category.json()) == 1

    by_stage = client.get("/questions", params={"stage": "Intermediate"})
    assert by_stage.status_code == 200
    assert len(by_stage.json()) == 1

    by_q = client.get("/questions", params={"q": "useState"})
    assert by_q.status_code == 200
    assert len(by_q.json()) == 1

    by_tag = client.get("/questions", params={"tag": "python"})
    assert by_tag.status_code == 200
    assert len(by_tag.json()) == 1

    combined = client.get(
        "/questions",
        params={"category": "Python", "stage": "Foundation", "tag": "python"},
    )
    assert combined.status_code == 200
    assert len(combined.json()) == 1
