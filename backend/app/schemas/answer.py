import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AnswerCreate(BaseModel):
    body: str = Field(min_length=20)


class AnswerOut(BaseModel):
    id: uuid.UUID
    question_id: uuid.UUID
    author_id: uuid.UUID
    body: str
    is_accepted: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
