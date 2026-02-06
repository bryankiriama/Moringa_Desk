from sqlalchemy.orm import Session

from backend.app.core.security import hash_password, verify_password
from backend.app.models.user import User
from backend.app.repositories.user_repo import create_user, get_user_by_email


def register_user(
    session: Session, *, email: str, full_name: str, password: str
) -> User:
    existing = get_user_by_email(session, email)
    if existing is not None:
        raise ValueError("email already registered")

    password_hash = hash_password(password)
    return create_user(
        session,
        email=email,
        full_name=full_name,
        password_hash=password_hash,
    )


def authenticate_user(session: Session, *, email: str, password: str) -> User | None:
    user = get_user_by_email(session, email)
    if user is None:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user
