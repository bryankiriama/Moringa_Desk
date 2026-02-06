from backend.app.models.user import User


def test_user_defaults() -> None:
    user = User(
        email="test@example.com",
        full_name="Test User",
        password_hash="hashed",
    )

    assert user.role == "student"
    assert user.created_at is not None
    assert user.updated_at is not None
