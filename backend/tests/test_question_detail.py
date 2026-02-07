import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.answer_repo import create_answer
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

    answers_module = importlib.import_module("backend.app.api.answers")
    importlib.reload(answers_module)

    Base.metadata.create_all(bind=session_module.engine)

    main_module = importlib.import_module("backend.app.main")
    importlib.reload(main_module)

    return TestClient(main_module.app), session_module


def test_get_question_not_found() -> None:
    client, _ = setup_app_with_sqlite()

    response = client.get("/questions/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_get_question_found_with_answers_and_tags_ordered() -> None:
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
        a1 = create_answer(
            session,
            question_id=question.id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )
        a2 = create_answer(
            session,
            question_id=question.id,
            author_id=uuid.uuid4(),
            body="Another helpful answer with more details for clarity.",
        )
        a2.is_accepted = True
        question.accepted_answer_id = a2.id

        t1 = create_tag(session, name="Python")
        t2 = create_tag(session, name="DevOps")
        attach_tags(session, question_id=question.id, tag_ids=[t1.id, t2.id])
        session.commit()

    response = client.get(f"/questions/{question.id}")
    assert response.status_code == 200
    data = response.json()

    assert "answers" in data
    assert len(data["answers"]) == 2
    assert data["answers"][0]["id"] == str(a2.id)
    assert data["answers"][1]["id"] == str(a1.id)

    assert "tags" in data
    names = [t["name"] for t in data["tags"]]
    assert names == ["devops", "python"]
