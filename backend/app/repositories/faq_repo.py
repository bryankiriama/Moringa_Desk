from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.faq import FAQ


def create_faq(
    session: Session, *, question: str, answer: str, category: str | None, created_by
) -> FAQ:
    faq = FAQ(
        question=question, answer=answer, category=category, created_by=created_by
    )
    session.add(faq)
    session.commit()
    session.refresh(faq)
    return faq


def list_faqs(session: Session) -> list[FAQ]:
    stmt = select(FAQ).order_by(FAQ.created_at.desc())
    return list(session.scalars(stmt).all())


def update_faq(
    session: Session,
    *,
    faq_id,
    question: str | None,
    answer: str | None,
    category: str | None,
) -> FAQ | None:
    faq = session.get(FAQ, faq_id)
    if faq is None:
        return None
    if question is not None:
        faq.question = question
    if answer is not None:
        faq.answer = answer
    if category is not None:
        faq.category = category
    session.add(faq)
    session.commit()
    session.refresh(faq)
    return faq


def delete_faq(session: Session, *, faq_id) -> bool:
    faq = session.get(FAQ, faq_id)
    if faq is None:
        return False
    session.delete(faq)
    session.commit()
    return True
