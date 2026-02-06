import uuid

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.models.vote import Vote
from backend.app.repositories.vote_repo import get_vote, upsert_vote


def test_create_vote() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    user_id = uuid.uuid4()
    target_id = uuid.uuid4()

    with SessionLocal() as session:
        vote = upsert_vote(
            session,
            user_id=user_id,
            target_type="question",
            target_id=target_id,
            value=1,
        )

        assert vote.value == 1

        found = get_vote(
            session,
            user_id=user_id,
            target_type="question",
            target_id=target_id,
        )
        assert found is not None
        assert found.id == vote.id


def test_update_vote_overwrites_value() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    user_id = uuid.uuid4()
    target_id = uuid.uuid4()

    with SessionLocal() as session:
        first = upsert_vote(
            session,
            user_id=user_id,
            target_type="answer",
            target_id=target_id,
            value=1,
        )
        second = upsert_vote(
            session,
            user_id=user_id,
            target_type="answer",
            target_id=target_id,
            value=-1,
        )

        assert first.id == second.id
        assert second.value == -1

        rows = session.scalars(
            select(Vote).where(
                Vote.user_id == user_id,
                Vote.target_type == "answer",
                Vote.target_id == target_id,
            )
        ).all()
        assert len(rows) == 1
