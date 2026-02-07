from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.answer_repo import list_answers_by_author
from backend.app.repositories.question_repo import list_questions_by_author
from backend.app.schemas.me import MyAnswerOut, MyQuestionOut

router = APIRouter(prefix="/me", tags=["me"])


@router.get("/questions", response_model=list[MyQuestionOut])
def my_questions_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MyQuestionOut]:
    return list_questions_by_author(db, author_id=current_user.id)


@router.get("/answers", response_model=list[MyAnswerOut])
def my_answers_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MyAnswerOut]:
    return list_answers_by_author(db, author_id=current_user.id)
