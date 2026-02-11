from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from backend.app.models.answer import Answer
from backend.app.models.flag import Flag
from backend.app.models.follow import Follow
from backend.app.models.notification import Notification
from backend.app.models.question import Question
from backend.app.models.question_tag import QuestionTag
from backend.app.models.question_view import QuestionView
from backend.app.models.related_question import RelatedQuestion
from backend.app.models.vote import Vote


def delete_answer(session: Session, *, answer_id) -> bool:
    answer = session.get(Answer, answer_id)
    if answer is None:
        return False

    question = session.get(Question, answer.question_id)
    if question is not None and question.accepted_answer_id == answer.id:
        question.accepted_answer_id = None
        session.add(question)

    session.execute(
        delete(Flag).where(
            Flag.target_type == "answer",
            Flag.target_id == answer.id,
        )
    )
    session.execute(
        delete(Vote).where(
            Vote.target_type == "answer",
            Vote.target_id == answer.id,
        )
    )

    session.delete(answer)
    session.commit()
    return True


def delete_user_content(session: Session, *, user_id) -> None:
    answer_ids = list(
        session.scalars(select(Answer.id).where(Answer.author_id == user_id)).all()
    )
    for answer_id in answer_ids:
        delete_answer(session, answer_id=answer_id)

    question_ids = list(
        session.scalars(select(Question.id).where(Question.author_id == user_id)).all()
    )
    for question_id in question_ids:
        delete_question(session, question_id=question_id)

    session.execute(delete(Flag).where(Flag.user_id == user_id))
    session.execute(delete(Vote).where(Vote.user_id == user_id))
    session.execute(delete(Follow).where(Follow.user_id == user_id))
    session.execute(delete(QuestionView).where(QuestionView.viewer_id == user_id))
    session.execute(
        delete(Notification).where(Notification.user_id == user_id)
    )
    session.commit()


def delete_question(session: Session, *, question_id) -> bool:
    question = session.get(Question, question_id)
    if question is None:
        return False

    answer_ids = list(
        session.scalars(select(Answer.id).where(Answer.question_id == question_id)).all()
    )
    if answer_ids:
        session.execute(
            delete(Flag).where(
                Flag.target_type == "answer",
                Flag.target_id.in_(answer_ids),
            )
        )
        session.execute(
            delete(Vote).where(
                Vote.target_type == "answer",
                Vote.target_id.in_(answer_ids),
            )
        )
        session.execute(delete(Answer).where(Answer.id.in_(answer_ids)))

    session.execute(
        delete(Flag).where(
            Flag.target_type == "question",
            Flag.target_id == question_id,
        )
    )
    session.execute(
        delete(Vote).where(
            Vote.target_type == "question",
            Vote.target_id == question_id,
        )
    )
    session.execute(delete(Follow).where(Follow.question_id == question_id))
    session.execute(delete(QuestionTag).where(QuestionTag.question_id == question_id))
    session.execute(
        delete(RelatedQuestion).where(
            (RelatedQuestion.question_id == question_id)
            | (RelatedQuestion.related_question_id == question_id)
        )
    )
    session.execute(delete(QuestionView).where(QuestionView.question_id == question_id))

    session.delete(question)
    session.commit()
    return True


def update_question_content(
    session: Session,
    *,
    question_id,
    title: str | None,
    body: str | None,
    category: str | None,
    stage: str | None,
) -> Question | None:
    question = session.get(Question, question_id)
    if question is None:
        return None
    if title is not None:
        question.title = title
    if body is not None:
        question.body = body
    if category is not None:
        question.category = category
    if stage is not None:
        question.stage = stage
    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def update_answer_content(
    session: Session,
    *,
    answer_id,
    body: str,
) -> Answer | None:
    answer = session.get(Answer, answer_id)
    if answer is None:
        return None
    answer.body = body
    session.add(answer)
    session.commit()
    session.refresh(answer)
    return answer
