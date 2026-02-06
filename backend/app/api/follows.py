import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.follow_repo import (
    create_follow,
    delete_follow,
    list_followed_questions,
)
from backend.app.repositories.question_repo import get_question_by_id
from backend.app.schemas.question import QuestionOut

router = APIRouter(tags=["follows"])


@router.post("/questions/{question_id}/follow")
def follow_question_endpoint(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    create_follow(db, user_id=current_user.id, question_id=question_id)
    return {"detail": "followed"}


@router.delete("/questions/{question_id}/follow")
def unfollow_question_endpoint(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    delete_follow(db, user_id=current_user.id, question_id=question_id)
    return {"detail": "unfollowed"}


@router.get("/me/follows", response_model=list[QuestionOut])
def list_my_follows_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[QuestionOut]:
    return list_followed_questions(db, user_id=current_user.id)
