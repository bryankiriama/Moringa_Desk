import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.answer_repo import create_answer, list_answers_for_question
from backend.app.repositories.question_repo import get_question_by_id
from backend.app.schemas.answer import AnswerCreate, AnswerOut

router = APIRouter(prefix="/questions/{question_id}/answers", tags=["answers"])


@router.post("", response_model=AnswerOut)
def create_answer_endpoint(
    question_id: uuid.UUID,
    payload: AnswerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnswerOut:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    answer = create_answer(
        db,
        question_id=question_id,
        author_id=current_user.id,
        body=payload.body,
    )
    return answer


@router.get("", response_model=list[AnswerOut])
def list_answers_endpoint(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> list[AnswerOut]:
    return list_answers_for_question(db, question_id=question_id)
