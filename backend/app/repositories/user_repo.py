from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.user import User


def get_user_by_email(session: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return session.scalars(stmt).first()


def create_user(
    session: Session,
    *,
    email: str,
    full_name: str,
    password_hash: str,
    role: str = "student",
) -> User:
    user = User(
        email=email,
        full_name=full_name,
        password_hash=password_hash,
        role=role,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
