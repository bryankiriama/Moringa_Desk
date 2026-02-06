from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.question import Question


def create_question(
    session: Session,
    *,
    author_id,
    title: str,
    body: str,
    category: str,
    stage: str,
) -> Question:
    question = Question(
        author_id=author_id,
        title=title,
        body=body,
        category=category,
        stage=stage,
    )
    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def list_questions(session: Session, *, limit: int = 20, offset: int = 0) -> list[Question]:
    stmt = (
        select(Question)
        .order_by(Question.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return list(session.scalars(stmt).all())
