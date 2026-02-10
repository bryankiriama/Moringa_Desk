import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from backend.app.schemas.answer import AnswerOut
from backend.app.schemas.question import QuestionOut
from backend.app.schemas.tag import TagOut


class QuestionDetailOut(BaseModel):
    id: uuid.UUID
    author_id: uuid.UUID
    author_name: str | None
    title: str
    body: str
    category: str
    stage: str
    accepted_answer_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime
    answers: list[AnswerOut]
    tags: list[TagOut]
    related_questions: list[QuestionOut]

    model_config = ConfigDict(from_attributes=True)
