from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.answer import Answer
from backend.app.models.question import Question
from backend.app.models.user import User
from backend.app.repositories.flag_repo import create_flag, get_flag, list_flags
from backend.app.schemas.flag import FlagCreate, FlagOut

router = APIRouter(prefix="/flags", tags=["flags"])


@router.post("", response_model=FlagOut)
def create_flag_endpoint(
    payload: FlagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FlagOut:
    if payload.target_type == "question":
        target = db.get(Question, payload.target_id)
    else:
        target = db.get(Answer, payload.target_id)

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="target not found"
        )

    if target.author_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="self-flag not allowed"
        )

    existing = get_flag(
        db,
        user_id=current_user.id,
        target_type=payload.target_type,
        target_id=payload.target_id,
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="already flagged",
        )

    return create_flag(
        db,
        user_id=current_user.id,
        target_type=payload.target_type,
        target_id=payload.target_id,
        reason=payload.reason,
    )


@router.get("", response_model=list[FlagOut])
def list_flags_endpoint(
    target_type: str | None = None,
    target_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[FlagOut]:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )

    return list_flags(db, target_type=target_type, target_id=target_id)
