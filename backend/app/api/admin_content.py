import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.admin_content_repo import (
    delete_answer,
    delete_question,
    update_answer_content,
    update_question_content,
)
from backend.app.schemas.answer import AnswerAdminUpdate, AnswerOut
from backend.app.schemas.question import QuestionAdminUpdate, QuestionOut
from backend.app.repositories.answer_repo import count_answers_for_question
from backend.app.repositories.vote_repo import get_vote_score

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


@router.patch("/questions/{question_id}", response_model=QuestionOut)
def update_question_endpoint(
    question_id: uuid.UUID,
    payload: QuestionAdminUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> QuestionOut:
    _ensure_admin(current_user)
    question = update_question_content(
        db,
        question_id=question_id,
        title=payload.title,
        body=payload.body,
        category=payload.category,
        stage=payload.stage,
    )
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )
    return QuestionOut(
        id=question.id,
        author_id=question.author_id,
        author_name=None,
        title=question.title,
        body=question.body,
        category=question.category,
        stage=question.stage,
        accepted_answer_id=question.accepted_answer_id,
        created_at=question.created_at,
        updated_at=question.updated_at,
        answers_count=count_answers_for_question(db, question_id=question.id),
        views_count=0,
        vote_score=get_vote_score(
            db, target_type="question", target_id=question.id
        ),
    )


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


@router.patch("/answers/{answer_id}", response_model=AnswerOut)
def update_answer_endpoint(
    answer_id: uuid.UUID,
    payload: AnswerAdminUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnswerOut:
    _ensure_admin(current_user)
    answer = update_answer_content(db, answer_id=answer_id, body=payload.body)
    if answer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="answer not found"
        )
    return AnswerOut(
        id=answer.id,
        question_id=answer.question_id,
        author_id=answer.author_id,
        author_name=None,
        body=answer.body,
        is_accepted=answer.is_accepted,
        created_at=answer.created_at,
        updated_at=answer.updated_at,
        vote_score=get_vote_score(
            db, target_type="answer", target_id=answer.id
        ),
    )
