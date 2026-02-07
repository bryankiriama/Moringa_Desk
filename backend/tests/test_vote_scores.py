import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.answer_repo import create_answer
from backend.app.repositories.question_repo import create_question
from backend.app.repositories.vote_repo import upsert_vote


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


def test_question_vote_score_in_list_and_detail() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        q = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Question title",
            body="Question body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )
        upsert_vote(
            session,
            user_id=uuid.uuid4(),
            target_type="question",
            target_id=q.id,
            value=1,
        )
        upsert_vote(
            session,
            user_id=uuid.uuid4(),
            target_type="question",
            target_id=q.id,
            value=-1,
        )
        upsert_vote(
            session,
            user_id=uuid.uuid4(),
            target_type="question",
            target_id=q.id,
            value=1,
        )

    list_resp = client.get("/questions")
    assert list_resp.status_code == 200
    assert list_resp.json()[0]["vote_score"] == 1

    detail_resp = client.get(f"/questions/{q.id}")
    assert detail_resp.status_code == 200
    assert detail_resp.json()["vote_score"] == 1


def test_answer_vote_score_in_detail_and_list() -> None:
    client, session_module = setup_app_with_sqlite()

    with session_module.SessionLocal() as session:
        q = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Question title",
            body="Question body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )
        a = create_answer(
            session,
            question_id=q.id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )
        upsert_vote(
            session,
            user_id=uuid.uuid4(),
            target_type="answer",
            target_id=a.id,
            value=1,
        )

    detail_resp = client.get(f"/questions/{q.id}")
    assert detail_resp.status_code == 200
    assert detail_resp.json()["answers"][0]["vote_score"] == 1

    list_resp = client.get(f"/questions/{q.id}/answers")
    assert list_resp.status_code == 200
    assert list_resp.json()[0]["vote_score"] == 1
