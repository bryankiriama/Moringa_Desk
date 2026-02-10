import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from backend.app.core.jwt import decode_token
from backend.app.db.session import get_db
from backend.app.repositories.user_repo import get_user_by_id

security = HTTPBearer(auto_error=False)


def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return None

    token = credentials.credentials
    try:
        payload = decode_token(token)
        sub = payload.get("sub")
        if not sub:
            return None
        user_id = uuid.UUID(sub)
    except (JWTError, ValueError):
        return None

    return get_user_by_id(db, user_id)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="not authenticated",
        )

    token = credentials.credentials
    try:
        payload = decode_token(token)
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="invalid token",
            )
        user_id = uuid.UUID(sub)
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid token",
        )

    user = get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="user not found",
        )

    return user
