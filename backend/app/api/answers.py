import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.answer_repo import create_answer, list_answers_for_question
from backend.app.repositories.notification_repo import create_notification
from backend.app.repositories.question_repo import get_question_by_id
from backend.app.repositories.vote_repo import get_vote_score
from backend.app.schemas.answer import AnswerCreate, AnswerOut
from backend.app.services.answer_service import accept_answer

router = APIRouter(prefix="/questions/{question_id}/answers", tags=["answers"])


def _answer_out(db: Session, answer) -> AnswerOut:
    return AnswerOut(
        id=answer.id,
        question_id=answer.question_id,
        author_id=answer.author_id,
        body=answer.body,
        is_accepted=answer.is_accepted,
        created_at=answer.created_at,
        updated_at=answer.updated_at,
        vote_score=get_vote_score(db, target_type="answer", target_id=answer.id),
    )


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

    if question.author_id != current_user.id:
        create_notification(
            db,
            user_id=question.author_id,
            type="answer_posted",
            payload={
                "question_id": str(question.id),
                "answer_id": str(answer.id),
                "actor_id": str(current_user.id),
            },
        )

    return _answer_out(db, answer)


@router.get("", response_model=list[AnswerOut])
def list_answers_endpoint(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> list[AnswerOut]:
    return [_answer_out(db, a) for a in list_answers_for_question(db, question_id=question_id)]


@router.post("/{answer_id}/accept")
def accept_answer_endpoint(
    question_id: uuid.UUID,
    answer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    try:
        result = accept_answer(
            db,
            question_id=question_id,
            answer_id=answer_id,
            acting_user_id=current_user.id,
        )
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="not question owner"
        )
    except LookupError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="answer not found"
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="answer not in question"
        )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    return {"detail": "accepted"}
