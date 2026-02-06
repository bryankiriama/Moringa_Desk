import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.models.question import Question
from backend.app.repositories.follow_repo import (
    create_follow,
    delete_follow,
    get_follow,
    list_followed_questions,
)


def _setup_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_create_follow_idempotent() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()

    q = Question(
        author_id=uuid.uuid4(),
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )
    session.add(q)
    session.commit()

    first = create_follow(session, user_id=user_id, question_id=q.id)
    second = create_follow(session, user_id=user_id, question_id=q.id)

    assert first.id == second.id


def test_list_followed_questions_ordered() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()

    q1 = Question(
        author_id=uuid.uuid4(),
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )
    q2 = Question(
        author_id=uuid.uuid4(),
        title="How to debug a React app?",
        body="What tools can I use to debug a React application effectively?",
        category="React",
        stage="Intermediate",
    )
    session.add_all([q1, q2])
    session.commit()

    create_follow(session, user_id=user_id, question_id=q1.id)
    create_follow(session, user_id=user_id, question_id=q2.id)

    questions = list_followed_questions(session, user_id=user_id)

    assert len(questions) == 2
    assert questions[0].id == q2.id
    assert questions[1].id == q1.id


def test_delete_follow_idempotent() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()

    q = Question(
        author_id=uuid.uuid4(),
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )
    session.add(q)
    session.commit()

    create_follow(session, user_id=user_id, question_id=q.id)
    delete_follow(session, user_id=user_id, question_id=q.id)
    delete_follow(session, user_id=user_id, question_id=q.id)

    assert get_follow(session, user_id=user_id, question_id=q.id) is None
