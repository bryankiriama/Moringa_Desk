from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.jwt import create_access_token
from backend.app.core.security import hash_password
from backend.app.db.session import get_db
from backend.app.repositories.user_repo import get_user_by_email
from backend.app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from backend.app.schemas.password_reset import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from backend.app.services.auth_service import authenticate_user, register_user
from backend.app.services.password_reset_service import (
    consume_reset_token,
    create_reset_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register_user_endpoint(
    payload: RegisterRequest, db: Session = Depends(get_db)
) -> TokenResponse:
    try:
        user = register_user(
            db,
            email=payload.email,
            full_name=payload.full_name,
            password=payload.password,
            role=payload.role,
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="email already registered",
        )

    access_token = create_access_token(sub=str(user.id))
    return TokenResponse(
        access_token=access_token, token_type="bearer", role=user.role
    )


@router.post("/login", response_model=TokenResponse)
def login_user_endpoint(
    payload: LoginRequest, db: Session = Depends(get_db)
) -> TokenResponse:
    user = authenticate_user(db, email=payload.email, password=payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid credentials",
        )

    access_token = create_access_token(sub=str(user.id))
    return TokenResponse(
        access_token=access_token, token_type="bearer", role=user.role
    )


@router.post("/forgot-password")
def forgot_password_endpoint(
    payload: ForgotPasswordRequest, db: Session = Depends(get_db)
) -> dict:
    user = get_user_by_email(db, payload.email)
    if user is not None:
        token = create_reset_token(db, user=user)
        print(f"Password reset token for {payload.email}: {token}")

    return {"detail": "if the email exists, a reset link will be sent"}


@router.post("/reset-password")
def reset_password_endpoint(
    payload: ResetPasswordRequest, db: Session = Depends(get_db)
) -> dict:
    user = consume_reset_token(db, token=payload.token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid or expired token",
        )

    user.password_hash = hash_password(payload.new_password)
    db.add(user)
    db.commit()

    return {"detail": "password updated"}
