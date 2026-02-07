from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.question_repo import (
    create_question,
    get_question_by_id,
    list_questions,
    search_questions_by_title,
)
from backend.app.schemas.question import QuestionCreate, QuestionOut

router = APIRouter(prefix="/questions", tags=["questions"])


@router.post("", response_model=QuestionOut)
def create_question_endpoint(
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> QuestionOut:
    question = create_question(
        db,
        author_id=current_user.id,
        title=payload.title,
        body=payload.body,
        category=payload.category,
        stage=payload.stage,
    )
    return question


@router.get("", response_model=list[QuestionOut])
def list_questions_endpoint(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
) -> list[QuestionOut]:
    return list_questions(db, limit=limit, offset=offset)


@router.get("/duplicates", response_model=list[QuestionOut])
def duplicate_questions_endpoint(
    title: str,
    db: Session = Depends(get_db),
) -> list[QuestionOut]:
    if len(title) < 10:
        return []

    return search_questions_by_title(db, title=title, limit=5)


@router.get("/{question_id}", response_model=QuestionOut)
def get_question_endpoint(
    question_id,
    db: Session = Depends(get_db),
) -> QuestionOut:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )
    return question
