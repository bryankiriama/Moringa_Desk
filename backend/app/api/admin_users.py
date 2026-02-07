import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserOut, UserRoleUpdate

router = APIRouter(prefix="/admin/users", tags=["admin"])


def _ensure_admin(current_user: User) -> None:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )


@router.get("", response_model=list[UserOut])
def list_users_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserOut]:
    _ensure_admin(current_user)
    stmt = select(User).order_by(User.created_at.desc())
    return list(db.scalars(stmt).all())


@router.patch("/{user_id}", response_model=UserOut)
def update_user_role_endpoint(
    user_id: uuid.UUID,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserOut:
    _ensure_admin(current_user)

    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="cannot change own role",
        )

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="user not found"
        )

    user.role = payload.role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
