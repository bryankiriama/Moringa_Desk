import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.question_repo import get_question_by_id
from backend.app.repositories.related_question_repo import (
    add_related_questions,
    list_related_questions,
)
from backend.app.schemas.question import QuestionOut
from backend.app.schemas.related_question import RelatedQuestionCreate

router = APIRouter(prefix="/questions/{question_id}/related", tags=["related"])


@router.post("", response_model=list[QuestionOut])
def add_related_questions_endpoint(
    question_id: uuid.UUID,
    payload: RelatedQuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[QuestionOut]:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    if question.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="not question owner"
        )

    for related_id in payload.related_question_ids:
        if related_id == question_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="self-linking not allowed",
            )
        if get_question_by_id(db, question_id=related_id) is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="related question not found",
            )

    add_related_questions(
        db, question_id=question_id, related_question_ids=payload.related_question_ids
    )
    return list_related_questions(db, question_id=question_id)


@router.get("", response_model=list[QuestionOut])
def list_related_questions_endpoint(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> list[QuestionOut]:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    return list_related_questions(db, question_id=question_id)
