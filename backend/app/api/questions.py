import uuid

from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user, get_optional_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.answer_repo import (
    count_answers_for_question,
    list_answers_for_question_ordered,
)
from backend.app.repositories.question_repo import (
    create_question,
    get_question_by_id,
    list_questions,
    search_questions_by_title,
)
from backend.app.repositories.question_tag_repo import list_tags_for_question
from backend.app.repositories.related_question_repo import (
    list_related_questions,
    list_related_questions_by_tags,
)
from backend.app.repositories.question_view_repo import (
    count_views_for_question,
    create_view,
    has_view_for_question,
)
from backend.app.repositories.vote_repo import get_vote_score
from backend.app.schemas.question import QuestionCreate, QuestionOut
from backend.app.schemas.question_detail import QuestionDetailOut

router = APIRouter(prefix="/questions", tags=["questions"])


def _author_lookup(db: Session, author_ids: list) -> dict:
    if not author_ids:
        return {}
    rows = db.execute(
        select(User.id, User.full_name).where(User.id.in_(author_ids))
    ).all()
    return {row[0]: row[1] for row in rows}


def _question_out(db: Session, question, author_map: dict | None = None) -> QuestionOut:
    author_name = None
    if author_map is not None:
        author_name = author_map.get(question.author_id)
    return QuestionOut(
        id=question.id,
        author_id=question.author_id,
        author_name=author_name,
        title=question.title,
        body=question.body,
        category=question.category,
        stage=question.stage,
        accepted_answer_id=question.accepted_answer_id,
        created_at=question.created_at,
        updated_at=question.updated_at,
        answers_count=count_answers_for_question(db, question_id=question.id),
        views_count=count_views_for_question(db, question_id=question.id),
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
    return _question_out(db, question, {current_user.id: current_user.full_name})


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
    author_map = _author_lookup(db, [q.author_id for q in questions])
    return [_question_out(db, q, author_map) for q in questions]


@router.get("/duplicates", response_model=list[QuestionOut])
def duplicate_questions_endpoint(
    title: str,
    db: Session = Depends(get_db),
) -> list[QuestionOut]:
    if len(title) < 10:
        return []

    questions = search_questions_by_title(db, title=title, limit=5)
    author_map = _author_lookup(db, [q.author_id for q in questions])
    return [_question_out(db, q, author_map) for q in questions]


@router.get("/{question_id}", response_model=QuestionDetailOut)
def get_question_endpoint(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
    track_view: bool = False,
    view_session: str | None = Header(default=None, alias="X-View-Session"),
    current_user: User | None = Depends(get_optional_user),
) -> QuestionDetailOut:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    if track_view:
        viewer_id = current_user.id if current_user is not None else None
        has_view = has_view_for_question(
            db,
            question_id=question.id,
            viewer_id=viewer_id,
            viewer_session=view_session,
        )
        if not has_view:
            create_view(
                db,
                question_id=question.id,
                viewer_id=viewer_id,
                viewer_session=view_session,
            )

    answers = list_answers_for_question_ordered(db, question_id=question_id)
    tags = list_tags_for_question(db, question_id=question_id)
    related = list_related_questions(db, question_id=question_id)
    if not related:
      related = list_related_questions_by_tags(db, question_id=question_id)
    author_ids = {question.author_id}
    author_ids.update(a.author_id for a in answers)
    author_ids.update(q.author_id for q in related)
    author_map = _author_lookup(db, list(author_ids))

    answers_out = [
        {
            "id": a.id,
            "question_id": a.question_id,
            "author_id": a.author_id,
            "author_name": author_map.get(a.author_id),
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
        author_name=author_map.get(question.author_id),
        title=question.title,
        body=question.body,
        category=question.category,
        stage=question.stage,
        accepted_answer_id=question.accepted_answer_id,
        created_at=question.created_at,
        updated_at=question.updated_at,
        answers_count=count_answers_for_question(db, question_id=question.id),
        views_count=count_views_for_question(db, question_id=question.id),
        answers=answers_out,
        tags=tags,
        related_questions=[_question_out(db, q, author_map) for q in related],
    )
