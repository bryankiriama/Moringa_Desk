from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.user import User


def get_user_by_email(session: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return session.scalars(stmt).first()


def get_user_by_id(session: Session, user_id) -> User | None:
    return session.get(User, user_id)


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


def delete_user(session: Session, *, user_id) -> bool:
    user = session.get(User, user_id)
    if user is None:
        return False
    session.delete(user)
    session.commit()
    return True
