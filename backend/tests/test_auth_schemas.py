import pytest
from pydantic import ValidationError

from backend.app.schemas.auth import LoginRequest, RegisterRequest


def test_register_missing_email() -> None:
    with pytest.raises(ValidationError):
        RegisterRequest(password="password123", full_name="Test User")


def test_register_invalid_email() -> None:
    with pytest.raises(ValidationError):
        RegisterRequest(email="not-an-email", password="password123", full_name="Test User")


def test_register_password_too_short() -> None:
    with pytest.raises(ValidationError):
        RegisterRequest(email="test@example.com", password="short", full_name="Test User")


def test_login_missing_email() -> None:
    with pytest.raises(ValidationError):
        LoginRequest(password="password123")


def test_login_missing_password() -> None:
    with pytest.raises(ValidationError):
        LoginRequest(email="test@example.com")


def test_login_password_too_short() -> None:
    with pytest.raises(ValidationError):
        LoginRequest(email="test@example.com", password="short")
