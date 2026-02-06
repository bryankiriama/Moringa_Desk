from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.follow import Follow
from backend.app.models.question import Question


def get_follow(session: Session, *, user_id, question_id) -> Follow | None:
    stmt = select(Follow).where(
        Follow.user_id == user_id,
        Follow.question_id == question_id,
    )
    return session.scalars(stmt).first()


def create_follow(session: Session, *, user_id, question_id) -> Follow:
    existing = get_follow(session, user_id=user_id, question_id=question_id)
    if existing is not None:
        return existing

    follow = Follow(user_id=user_id, question_id=question_id)
    session.add(follow)
    session.commit()
    session.refresh(follow)
    return follow


def delete_follow(session: Session, *, user_id, question_id) -> None:
    existing = get_follow(session, user_id=user_id, question_id=question_id)
    if existing is None:
        return

    session.delete(existing)
    session.commit()


def list_followed_questions(session: Session, *, user_id) -> list[Question]:
    stmt = (
        select(Question)
        .join(Follow, Follow.question_id == Question.id)
        .where(Follow.user_id == user_id)
        .order_by(Follow.created_at.desc())
    )
    return list(session.scalars(stmt).all())
