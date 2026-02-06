import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.repositories.notification_repo import (
    create_notification,
    list_notifications,
    mark_all_read,
)


def _setup_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_create_and_list_notifications() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()

    create_notification(session, user_id=user_id, type="answer_posted", payload={})
    create_notification(session, user_id=user_id, type="vote_received", payload={})

    items = list_notifications(session, user_id=user_id)
    assert len(items) == 2


def test_unread_only_filter() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()

    n1 = create_notification(session, user_id=user_id, type="answer_posted", payload={})
    n1.is_read = True
    session.commit()

    create_notification(session, user_id=user_id, type="vote_received", payload={})

    items = list_notifications(session, user_id=user_id, unread_only=True)
    assert len(items) == 1
    assert items[0].is_read is False


def test_mark_all_read_updates_only_user() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()
    other_id = uuid.uuid4()

    create_notification(session, user_id=user_id, type="answer_posted", payload={})
    create_notification(session, user_id=user_id, type="vote_received", payload={})
    create_notification(session, user_id=other_id, type="answer_posted", payload={})

    updated = mark_all_read(session, user_id=user_id)
    assert updated == 2

    items = list_notifications(session, user_id=user_id, unread_only=True)
    assert len(items) == 0

    other_items = list_notifications(session, user_id=other_id, unread_only=True)
    assert len(other_items) == 1
