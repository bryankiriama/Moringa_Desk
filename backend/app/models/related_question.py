import uuid
from datetime import datetime, timezone

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.base import Base


class RelatedQuestion(Base):
    __tablename__ = "related_questions"

    question_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("questions.id"), primary_key=True
    )
    related_question_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("questions.id"), primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(tz=timezone.utc)
    )
