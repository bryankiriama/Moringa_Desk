from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.answer import Answer


def create_answer(
    session: Session, *, question_id, author_id, body: str
) -> Answer:
    answer = Answer(
        question_id=question_id,
        author_id=author_id,
        body=body,
    )
    session.add(answer)
    session.commit()
    session.refresh(answer)
    return answer


def list_answers_for_question(
    session: Session, *, question_id
) -> list[Answer]:
    stmt = (
        select(Answer)
        .where(Answer.question_id == question_id)
        .order_by(Answer.created_at.asc())
    )
    return list(session.scalars(stmt).all())


def list_answers_for_question_ordered(
    session: Session, *, question_id
) -> list[Answer]:
    answers = list_answers_for_question(session, question_id=question_id)
    accepted = [a for a in answers if a.is_accepted]
    non_accepted = [a for a in answers if not a.is_accepted]
    return accepted + non_accepted


def list_answers_by_author(session: Session, *, author_id) -> list[Answer]:
    stmt = (
        select(Answer)
        .where(Answer.author_id == author_id)
        .order_by(Answer.created_at.desc())
    )
    return list(session.scalars(stmt).all())
