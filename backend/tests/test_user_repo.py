from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.models.user import User
from backend.app.repositories.user_repo import create_user, get_user_by_email


def test_create_and_get_user_by_email() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)

    SessionLocal = sessionmaker(bind=engine)

    with SessionLocal() as session:
        created = create_user(
            session,
            email="test@example.com",
            full_name="Test User",
            password_hash="hashed",
        )

        assert created.id is not None
        assert created.email == "test@example.com"

        found = get_user_by_email(session, "test@example.com")
        assert found is not None
        assert isinstance(found, User)
        assert found.id == created.id
