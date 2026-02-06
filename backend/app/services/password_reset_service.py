import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.password_reset import PasswordResetToken
from backend.app.models.user import User


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_reset_token(
    session: Session, *, user: User, expires_in_minutes: int = 30
) -> str:
    raw_token = secrets.token_urlsafe(32)
    token_hash = _hash_token(raw_token)
    expires_at = datetime.now(tz=timezone.utc) + timedelta(minutes=expires_in_minutes)

    record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    session.add(record)
    session.commit()

    return raw_token


def verify_reset_token(session: Session, *, token: str) -> User | None:
    token_hash = _hash_token(token)
    stmt = select(PasswordResetToken).where(PasswordResetToken.token_hash == token_hash)
    record = session.scalars(stmt).first()
    if record is None:
        return None

    if record.expires_at <= datetime.now(tz=timezone.utc):
        return None

    return session.get(User, record.user_id)
