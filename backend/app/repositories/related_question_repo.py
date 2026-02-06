from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.question import Question
from backend.app.models.related_question import RelatedQuestion


def _link_exists(session: Session, *, question_id, related_question_id) -> bool:
    return (
        session.get(
            RelatedQuestion,
            {
                "question_id": question_id,
                "related_question_id": related_question_id,
            },
        )
        is not None
    )


def add_related_questions(
    session: Session, *, question_id, related_question_ids: list
) -> None:
    for related_id in related_question_ids:
        if related_id == question_id:
            continue

        if not _link_exists(
            session, question_id=question_id, related_question_id=related_id
        ):
            session.add(
                RelatedQuestion(
                    question_id=question_id, related_question_id=related_id
                )
            )

        if not _link_exists(
            session, question_id=related_id, related_question_id=question_id
        ):
            session.add(
                RelatedQuestion(
                    question_id=related_id, related_question_id=question_id
                )
            )

    session.commit()


def list_related_questions(session: Session, *, question_id) -> list[Question]:
    stmt = (
        select(Question)
        .join(
            RelatedQuestion,
            RelatedQuestion.related_question_id == Question.id,
        )
        .where(RelatedQuestion.question_id == question_id)
        .order_by(Question.created_at.desc())
    )
    return list(session.scalars(stmt).all())
