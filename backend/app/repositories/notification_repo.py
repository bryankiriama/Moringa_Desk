from sqlalchemy import select, update
from sqlalchemy.orm import Session

from backend.app.models.notification import Notification


def create_notification(
    session: Session, *, user_id, type: str, payload: dict
) -> Notification:
    notification = Notification(user_id=user_id, type=type, payload=payload)
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification


def list_notifications(
    session: Session, *, user_id, unread_only: bool = False
) -> list[Notification]:
    stmt = select(Notification).where(Notification.user_id == user_id)
    if unread_only:
        stmt = stmt.where(Notification.is_read.is_(False))
    stmt = stmt.order_by(Notification.created_at.desc())
    return list(session.scalars(stmt).all())


def mark_all_read(session: Session, *, user_id) -> int:
    result = session.execute(
        update(Notification)
        .where(Notification.user_id == user_id)
        .values(is_read=True)
    )
    session.commit()
    return result.rowcount or 0
