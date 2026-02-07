import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.repositories.flag_repo import create_flag, list_flags


def _setup_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_create_and_list_flags_ordered() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()

    f1 = create_flag(
        session,
        user_id=user_id,
        target_type="question",
        target_id=uuid.uuid4(),
        reason="Spam content",
    )
    f2 = create_flag(
        session,
        user_id=user_id,
        target_type="answer",
        target_id=uuid.uuid4(),
        reason="Offensive language",
    )

    items = list_flags(session)
    assert len(items) == 2
    assert items[0].id == f2.id
    assert items[1].id == f1.id


def test_list_flags_filters() -> None:
    session = _setup_session()
    user_id = uuid.uuid4()
    target_id = uuid.uuid4()

    create_flag(
        session,
        user_id=user_id,
        target_type="question",
        target_id=target_id,
        reason="Duplicate",
    )
    create_flag(
        session,
        user_id=user_id,
        target_type="answer",
        target_id=uuid.uuid4(),
        reason="Spam",
    )

    by_type = list_flags(session, target_type="question")
    assert len(by_type) == 1
    assert by_type[0].target_type == "question"

    by_target = list_flags(session, target_id=target_id)
    assert len(by_target) == 1
    assert by_target[0].target_id == target_id

    combined = list_flags(session, target_type="question", target_id=target_id)
    assert len(combined) == 1
    assert combined[0].target_id == target_id
