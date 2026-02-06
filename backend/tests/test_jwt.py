from datetime import timedelta
import os
import importlib

import pytest
from jose import ExpiredSignatureError


def test_create_and_decode_round_trip() -> None:
    os.environ["JWT_SECRET"] = "test-secret"
    os.environ["JWT_ALGORITHM"] = "HS256"
    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

    jwt_module = importlib.import_module("backend.app.core.jwt")

    token = jwt_module.create_access_token("user-123")
    payload = jwt_module.decode_token(token)

    assert payload["sub"] == "user-123"


def test_expired_token_raises_error() -> None:
    os.environ["JWT_SECRET"] = "test-secret"
    os.environ["JWT_ALGORITHM"] = "HS256"
    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

    jwt_module = importlib.import_module("backend.app.core.jwt")

    token = jwt_module.create_access_token(
        "user-123", expires_delta=timedelta(seconds=-1)
    )

    with pytest.raises(ExpiredSignatureError):
        jwt_module.decode_token(token)
