from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.models.question_view import QuestionView


def create_view(
    session: Session, *, question_id, viewer_id=None, viewer_session=None
) -> QuestionView:
    view = QuestionView(
        question_id=question_id, viewer_id=viewer_id, viewer_session=viewer_session
    )
    session.add(view)
    session.commit()
    session.refresh(view)
    return view


def has_view_for_question(
    session: Session, *, question_id, viewer_id=None, viewer_session=None
) -> bool:
    stmt = select(QuestionView.id).where(QuestionView.question_id == question_id)
    if viewer_id is not None:
        stmt = stmt.where(QuestionView.viewer_id == viewer_id)
    if viewer_session is not None:
        stmt = stmt.where(QuestionView.viewer_session == viewer_session)
    return session.execute(stmt).first() is not None


def count_views_for_question(session: Session, *, question_id) -> int:
    stmt = select(func.count()).select_from(QuestionView).where(
        QuestionView.question_id == question_id
    )
    return int(session.scalar(stmt) or 0)
