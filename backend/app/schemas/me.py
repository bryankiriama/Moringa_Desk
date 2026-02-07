import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MyQuestionOut(BaseModel):
    id: uuid.UUID
    author_id: uuid.UUID
    title: str
    body: str
    category: str
    stage: str
    accepted_answer_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MyAnswerOut(BaseModel):
    id: uuid.UUID
    question_id: uuid.UUID
    author_id: uuid.UUID
    body: str
    is_accepted: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
