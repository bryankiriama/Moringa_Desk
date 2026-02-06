from datetime import datetime, timedelta, timezone

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.models.password_reset import PasswordResetToken
from backend.app.models.user import User
from backend.app.services.password_reset_service import (
    create_reset_token,
    verify_reset_token,
)


def _setup_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_create_reset_token_stores_hash() -> None:
    session = _setup_session()
    user = User(email="test@example.com", full_name="Test", password_hash="x")
    session.add(user)
    session.commit()

    raw = create_reset_token(session, user=user, expires_in_minutes=30)

    assert raw

    record = session.query(PasswordResetToken).first()
    assert record is not None
    assert record.token_hash != raw


def test_verify_reset_token_returns_user() -> None:
    session = _setup_session()
    user = User(email="test@example.com", full_name="Test", password_hash="x")
    session.add(user)
    session.commit()

    raw = create_reset_token(session, user=user, expires_in_minutes=30)

    found = verify_reset_token(session, token=raw)
    assert found is not None
    assert found.id == user.id


def test_verify_reset_token_expired_returns_none() -> None:
    session = _setup_session()
    user = User(email="test@example.com", full_name="Test", password_hash="x")
    session.add(user)
    session.commit()

    raw = create_reset_token(session, user=user, expires_in_minutes=30)

    record = session.query(PasswordResetToken).first()
    record.expires_at = datetime.now(tz=timezone.utc) - timedelta(minutes=1)
    session.commit()

    found = verify_reset_token(session, token=raw)
    assert found is None
