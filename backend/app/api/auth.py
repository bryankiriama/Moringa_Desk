from fastapi import APIRouter

from backend.app.schemas.auth import LoginRequest, RegisterRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register_user(payload: RegisterRequest) -> dict:
    return {"detail": "stub"}


@router.post("/login")
def login_user(payload: LoginRequest) -> dict:
    return {"detail": "stub"}
