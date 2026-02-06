from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.faq import FAQ


def create_faq(
    session: Session, *, question: str, answer: str, created_by
) -> FAQ:
    faq = FAQ(question=question, answer=answer, created_by=created_by)
    session.add(faq)
    session.commit()
    session.refresh(faq)
    return faq


def list_faqs(session: Session) -> list[FAQ]:
    stmt = select(FAQ).order_by(FAQ.created_at.desc())
    return list(session.scalars(stmt).all())
