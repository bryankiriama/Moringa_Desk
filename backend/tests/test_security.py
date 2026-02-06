from backend.app.core.security import hash_password, verify_password


def test_hash_password_is_not_plain() -> None:
    password = "super-secret"
    hashed = hash_password(password)
    assert hashed != password


def test_verify_password_true_for_correct_password() -> None:
    password = "super-secret"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True


def test_verify_password_false_for_wrong_password() -> None:
    password = "super-secret"
    hashed = hash_password(password)
    assert verify_password("wrong-password", hashed) is False
