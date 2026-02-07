import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from backend.app.schemas.answer import AnswerOut


class QuestionDetailOut(BaseModel):
    id: uuid.UUID
    author_id: uuid.UUID
    title: str
    body: str
    category: str
    stage: str
    accepted_answer_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime
    answers: list[AnswerOut]

    model_config = ConfigDict(from_attributes=True)
