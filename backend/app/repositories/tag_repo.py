from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.models.question_tag import QuestionTag
from backend.app.models.tag import Tag


def _normalize_name(name: str) -> str:
    return name.strip().lower()


def create_tag(session: Session, *, name: str) -> Tag:
    tag = Tag(name=_normalize_name(name))
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag


def get_tag_by_name(session: Session, *, name: str) -> Tag | None:
    normalized = _normalize_name(name)
    stmt = select(Tag).where(Tag.name == normalized)
    return session.scalars(stmt).first()


def list_tags(session: Session) -> list[dict]:
    stmt = (
        select(
            Tag.id,
            Tag.name,
            Tag.created_at,
            func.count(QuestionTag.question_id).label("usage_count"),
        )
        .outerjoin(QuestionTag, Tag.id == QuestionTag.tag_id)
        .group_by(Tag.id)
        .order_by(Tag.name.asc())
    )
    rows = session.execute(stmt).all()
    return [
        {
            "id": row.id,
            "name": row.name,
            "created_at": row.created_at,
            "usage_count": int(row.usage_count or 0),
        }
        for row in rows
    ]
