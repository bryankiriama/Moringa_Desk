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

    me_module = importlib.import_module("backend.app.api.me")
    importlib.reload(me_module)

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


def test_me_endpoints_require_auth() -> None:
    client, _ = setup_app_with_sqlite()

    q = client.get("/me/questions")
    a = client.get("/me/answers")

    assert q.status_code == 401
    assert a.status_code == 401


def test_me_questions_and_answers_return_current_user_data() -> None:
    client, session_module = setup_app_with_sqlite()

    token = _register_and_get_token(client, "user@example.com")
    user_id = _decode_sub(token)

    with session_module.SessionLocal() as session:
        q1 = create_question(
            session,
            author_id=user_id,
            title="Question one title",
            body="Question one body is long enough for validation.",
            category="Python",
            stage="Foundation",
        )
        q2 = create_question(
            session,
            author_id=uuid.uuid4(),
            title="Other question title",
            body="Other question body is long enough for validation.",
            category="React",
            stage="Intermediate",
        )
        create_answer(
            session,
            question_id=q1.id,
            author_id=user_id,
            body="This is a helpful answer that explains the solution clearly.",
        )
        create_answer(
            session,
            question_id=q2.id,
            author_id=uuid.uuid4(),
            body="This is another answer that should not appear.",
        )

    my_questions = client.get(
        "/me/questions", headers={"Authorization": f"Bearer {token}"}
    )
    assert my_questions.status_code == 200
    q_ids = [q["id"] for q in my_questions.json()]
    assert str(q1.id) in q_ids
    assert str(q2.id) not in q_ids

    my_answers = client.get(
        "/me/answers", headers={"Authorization": f"Bearer {token}"}
    )
    assert my_answers.status_code == 200
    a_items = my_answers.json()
    assert len(a_items) == 1
