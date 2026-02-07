from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.answer_repo import list_answers_for_question_ordered
from backend.app.repositories.question_repo import (
    create_question,
    get_question_by_id,
    list_questions,
    search_questions_by_title,
)
from backend.app.repositories.question_tag_repo import list_tags_for_question
from backend.app.repositories.related_question_repo import list_related_questions
from backend.app.repositories.vote_repo import get_vote_score
from backend.app.schemas.question import QuestionCreate, QuestionOut
from backend.app.schemas.question_detail import QuestionDetailOut

router = APIRouter(prefix="/questions", tags=["questions"])


def _question_out(db: Session, question) -> QuestionOut:
    return QuestionOut(
        id=question.id,
        author_id=question.author_id,
        title=question.title,
        body=question.body,
        category=question.category,
        stage=question.stage,
        accepted_answer_id=question.accepted_answer_id,
        created_at=question.created_at,
        updated_at=question.updated_at,
        vote_score=get_vote_score(
            db, target_type="question", target_id=question.id
        ),
    )


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
    return _question_out(db, question)


@router.get("", response_model=list[QuestionOut])
def list_questions_endpoint(
    limit: int = 20,
    offset: int = 0,
    tag: str | None = None,
    category: str | None = None,
    stage: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
) -> list[QuestionOut]:
    questions = list_questions(
        db,
        limit=limit,
        offset=offset,
        tag=tag,
        category=category,
        stage=stage,
        q=q,
    )
    return [_question_out(db, q) for q in questions]


@router.get("/duplicates", response_model=list[QuestionOut])
def duplicate_questions_endpoint(
    title: str,
    db: Session = Depends(get_db),
) -> list[QuestionOut]:
    if len(title) < 10:
        return []

    questions = search_questions_by_title(db, title=title, limit=5)
    return [_question_out(db, q) for q in questions]


@router.get("/{question_id}", response_model=QuestionDetailOut)
def get_question_endpoint(
    question_id,
    db: Session = Depends(get_db),
) -> QuestionDetailOut:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    answers = list_answers_for_question_ordered(db, question_id=question_id)
    tags = list_tags_for_question(db, question_id=question_id)
    related = list_related_questions(db, question_id=question_id)

    answers_out = [
        {
            "id": a.id,
            "question_id": a.question_id,
            "author_id": a.author_id,
            "body": a.body,
            "is_accepted": a.is_accepted,
            "created_at": a.created_at,
            "updated_at": a.updated_at,
            "vote_score": get_vote_score(
                db, target_type="answer", target_id=a.id
            ),
        }
        for a in answers
    ]

    return QuestionDetailOut(
        id=question.id,
        author_id=question.author_id,
        title=question.title,
        body=question.body,
        category=question.category,
        stage=question.stage,
        accepted_answer_id=question.accepted_answer_id,
        created_at=question.created_at,
        updated_at=question.updated_at,
        answers=answers_out,
        tags=tags,
        related_questions=[_question_out(db, q) for q in related],
    )
