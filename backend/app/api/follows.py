import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.follow_repo import (
    create_follow,
    delete_follow,
    list_followed_questions,
)
from backend.app.repositories.answer_repo import count_answers_for_question
from backend.app.repositories.question_repo import get_question_by_id
from backend.app.repositories.vote_repo import get_vote_score
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
    questions = list_followed_questions(db, user_id=current_user.id)
    if not questions:
        return []
    rows = db.execute(
        select(User.id, User.full_name).where(
            User.id.in_([q.author_id for q in questions])
        )
    ).all()
    author_map = {row[0]: row[1] for row in rows}
    return [
        QuestionOut(
            id=q.id,
            author_id=q.author_id,
            author_name=author_map.get(q.author_id),
            title=q.title,
            body=q.body,
            category=q.category,
            stage=q.stage,
            accepted_answer_id=q.accepted_answer_id,
            created_at=q.created_at,
            updated_at=q.updated_at,
            answers_count=count_answers_for_question(db, question_id=q.id),
            views_count=0,
            vote_score=get_vote_score(
                db, target_type="question", target_id=q.id
            ),
        )
        for q in questions
    ]
