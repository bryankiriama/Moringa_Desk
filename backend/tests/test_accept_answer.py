import importlib
import os
import uuid

from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.repositories.answer_repo import create_answer
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

    answers_module = importlib.import_module("backend.app.api.answers")
    importlib.reload(answers_module)

    questions_module = importlib.import_module("backend.app.api.questions")
    importlib.reload(questions_module)

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


def test_owner_can_accept_answer() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    _register_and_get_token(client, "other@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )
        answer = create_answer(
            session,
            question_id=question.id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )

    response = client.post(
        f"/questions/{question.id}/answers/{answer.id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )

    assert response.status_code == 200


def test_non_owner_cannot_accept_answer() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    other_token = _register_and_get_token(client, "other@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )
        answer = create_answer(
            session,
            question_id=question.id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )

    response = client.post(
        f"/questions/{question.id}/answers/{answer.id}/accept",
        headers={"Authorization": f"Bearer {other_token}"},
    )

    assert response.status_code == 403


def test_accepting_second_answer_unsets_first() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )
        answer1 = create_answer(
            session,
            question_id=question.id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )
        answer2 = create_answer(
            session,
            question_id=question.id,
            author_id=uuid.uuid4(),
            body="Another helpful answer with more details for clarity.",
        )

    first = client.post(
        f"/questions/{question.id}/answers/{answer1.id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert first.status_code == 200

    second = client.post(
        f"/questions/{question.id}/answers/{answer2.id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert second.status_code == 200

    with session_module.SessionLocal() as session:
        refreshed1 = session.get(type(answer1), answer1.id)
        refreshed2 = session.get(type(answer2), answer2.id)
        refreshed_q = session.get(type(question), question.id)

        assert refreshed1.is_accepted is False
        assert refreshed2.is_accepted is True
        assert refreshed_q.accepted_answer_id == answer2.id


def test_accept_answer_not_in_question_returns_400() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question1 = create_question(
            session,
            author_id=owner_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )
        question2 = create_question(
            session,
            author_id=owner_id,
            title="How to debug a React app?",
            body="What tools can I use to debug a React application effectively?",
            category="React",
            stage="Intermediate",
        )
        answer = create_answer(
            session,
            question_id=question2.id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )

    response = client.post(
        f"/questions/{question1.id}/answers/{answer.id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert response.status_code == 400


def test_accept_answer_missing_question_returns_404() -> None:
    client, _ = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")

    response = client.post(
        "/questions/00000000-0000-0000-0000-000000000000/answers/00000000-0000-0000-0000-000000000001/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert response.status_code == 404


def test_accept_answer_missing_answer_returns_404() -> None:
    client, session_module = setup_app_with_sqlite()

    owner_token = _register_and_get_token(client, "owner@example.com")
    owner_id = _decode_sub(owner_token)

    with session_module.SessionLocal() as session:
        question = create_question(
            session,
            author_id=owner_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )

    response = client.post(
        f"/questions/{question.id}/answers/00000000-0000-0000-0000-000000000001/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert response.status_code == 404
