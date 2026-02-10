import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.admin_content_repo import (
    delete_answer,
    delete_question,
)

router = APIRouter(prefix="/admin/content", tags=["admin"])


def _ensure_admin(current_user: User) -> None:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )


@router.delete("/questions/{question_id}")
def delete_question_endpoint(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    _ensure_admin(current_user)
    if not delete_question(db, question_id=question_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )
    return {"detail": "question removed"}


@router.delete("/answers/{answer_id}")
def delete_answer_endpoint(
    answer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    _ensure_admin(current_user)
    if not delete_answer(db, answer_id=answer_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="answer not found"
        )
    return {"detail": "answer removed"}
