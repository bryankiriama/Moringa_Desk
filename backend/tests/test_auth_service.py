from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.services.auth_service import authenticate_user, register_user


def test_register_user_creates_user() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    with SessionLocal() as session:
        user = register_user(
            session,
            email="test@example.com",
            full_name="Test User",
            password="password123",
        )

        assert user.id is not None
        assert user.email == "test@example.com"


def test_register_user_duplicate_email_raises() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    with SessionLocal() as session:
        register_user(
            session,
            email="test@example.com",
            full_name="Test User",
            password="password123",
        )

        try:
            register_user(
                session,
                email="test@example.com",
                full_name="Another",
                password="password456",
            )
            assert False, "expected ValueError"
        except ValueError:
            assert True


def test_authenticate_user() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    with SessionLocal() as session:
        register_user(
            session,
            email="test@example.com",
            full_name="Test User",
            password="password123",
        )

        user = authenticate_user(
            session, email="test@example.com", password="password123"
        )
        assert user is not None

        wrong = authenticate_user(
            session, email="test@example.com", password="wrong"
        )
        assert wrong is None
