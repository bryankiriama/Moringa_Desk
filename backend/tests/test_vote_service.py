import uuid

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.models.question import Question
from backend.app.models.vote import Vote
from backend.app.services.vote_service import SelfVoteNotAllowed, cast_vote


def _setup_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_vote_on_others_content_succeeds() -> None:
    session = _setup_session()
    owner_id = uuid.uuid4()
    actor_id = uuid.uuid4()

    question = Question(
        author_id=owner_id,
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )
    session.add(question)
    session.commit()

    vote = cast_vote(
        session,
        actor_id=actor_id,
        target_type="question",
        target_id=question.id,
        value=1,
    )

    assert vote.value == 1


def test_self_vote_raises() -> None:
    session = _setup_session()
    owner_id = uuid.uuid4()

    question = Question(
        author_id=owner_id,
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )
    session.add(question)
    session.commit()

    try:
        cast_vote(
            session,
            actor_id=owner_id,
            target_type="question",
            target_id=question.id,
            value=1,
        )
        assert False, "expected SelfVoteNotAllowed"
    except SelfVoteNotAllowed:
        assert True


def test_switching_vote_updates_value_and_keeps_one_row() -> None:
    session = _setup_session()
    owner_id = uuid.uuid4()
    actor_id = uuid.uuid4()

    question = Question(
        author_id=owner_id,
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )
    session.add(question)
    session.commit()

    first = cast_vote(
        session,
        actor_id=actor_id,
        target_type="question",
        target_id=question.id,
        value=1,
    )
    second = cast_vote(
        session,
        actor_id=actor_id,
        target_type="question",
        target_id=question.id,
        value=-1,
    )

    assert first.id == second.id
    assert second.value == -1

    rows = session.scalars(
        select(Vote).where(
            Vote.user_id == actor_id,
            Vote.target_type == "question",
            Vote.target_id == question.id,
        )
    ).all()
    assert len(rows) == 1
