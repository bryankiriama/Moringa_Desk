from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.question_tag import QuestionTag
from backend.app.models.tag import Tag


def attach_tags(
    session: Session, *, question_id, tag_ids: list
) -> None:
    for tag_id in tag_ids:
        exists = session.get(QuestionTag, {"question_id": question_id, "tag_id": tag_id})
        if exists is not None:
            continue
        session.add(QuestionTag(question_id=question_id, tag_id=tag_id))
    session.commit()


def list_tags_for_question(session: Session, *, question_id) -> list[Tag]:
    stmt = (
        select(Tag)
        .join(QuestionTag, Tag.id == QuestionTag.tag_id)
        .where(QuestionTag.question_id == question_id)
        .order_by(Tag.name.asc())
    )
    return list(session.scalars(stmt).all())
