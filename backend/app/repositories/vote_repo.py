from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.vote import Vote


def get_vote(
    session: Session, *, user_id, target_type: str, target_id
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
