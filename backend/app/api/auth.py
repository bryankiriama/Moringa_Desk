from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.jwt import create_access_token
from backend.app.db.session import get_db
from backend.app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from backend.app.services.auth_service import authenticate_user, register_user

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
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="email already registered",
        )

    access_token = create_access_token(sub=str(user.id))
    return TokenResponse(access_token=access_token, token_type="bearer")


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
    return TokenResponse(access_token=access_token, token_type="bearer")
