from sqlalchemy import select
from sqlalchemy.orm import Session

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


def list_tags(session: Session) -> list[Tag]:
    stmt = select(Tag).order_by(Tag.name.asc())
    return list(session.scalars(stmt).all())
