from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.models.vote import Vote


def create_vote(
    session: Session,
    *,
    user_id,
    target_type: str,
    target_id,
    value: int,
) -> Vote:
    vote = Vote(
        user_id=user_id,
        target_type=target_type,
        target_id=target_id,
        value=value,
    )
    session.add(vote)
    session.commit()
    session.refresh(vote)
    return vote


def get_vote(
    session: Session,
    *,
    user_id,
    target_type: str,
    target_id,
) -> Vote | None:
    stmt = select(Vote).where(
        Vote.user_id == user_id,
        Vote.target_type == target_type,
        Vote.target_id == target_id,
    )
    return session.scalars(stmt).first()


def upsert_vote(
    session: Session,
    *,
    user_id,
    target_type: str,
    target_id,
    value: int,
) -> Vote:
    existing = get_vote(
        session,
        user_id=user_id,
        target_type=target_type,
        target_id=target_id,
    )

    if existing is not None:
        existing.value = value
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    return create_vote(
        session,
        user_id=user_id,
        target_type=target_type,
        target_id=target_id,
        value=value,
    )


def get_vote_score(
    session: Session, *, target_type: str, target_id
) -> int:
    stmt = select(func.coalesce(func.sum(Vote.value), 0)).where(
        Vote.target_type == target_type,
        Vote.target_id == target_id,
    )
    return int(session.execute(stmt).scalar_one())
