from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.flag import Flag


def create_flag(
    session: Session,
    *,
    user_id,
    target_type: str,
    target_id,
    reason: str,
) -> Flag:
    flag = Flag(
        user_id=user_id,
        target_type=target_type,
        target_id=target_id,
        reason=reason,
    )
    session.add(flag)
    session.commit()
    session.refresh(flag)
    return flag


def get_flag(
    session: Session,
    *,
    user_id,
    target_type: str,
    target_id,
) -> Flag | None:
    stmt = select(Flag).where(
        Flag.user_id == user_id,
        Flag.target_type == target_type,
        Flag.target_id == target_id,
    )
    return session.scalars(stmt).first()


def list_flags(
    session: Session,
    *,
    target_type: str | None = None,
    target_id=None,
) -> list[Flag]:
    stmt = select(Flag)
    if target_type is not None:
        stmt = stmt.where(Flag.target_type == target_type)
    if target_id is not None:
        stmt = stmt.where(Flag.target_id == target_id)
    stmt = stmt.order_by(Flag.created_at.desc())
    return list(session.scalars(stmt).all())


def delete_flag(session: Session, *, flag_id) -> bool:
    flag = session.get(Flag, flag_id)
    if flag is None:
        return False
    session.delete(flag)
    session.commit()
    return True
