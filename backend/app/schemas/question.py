import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class QuestionCreate(BaseModel):
    title: str = Field(min_length=10)
    body: str = Field(min_length=20)
    category: str
    stage: str


class QuestionAdminUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=10)
    body: str | None = Field(default=None, min_length=20)
    category: str | None = None
    stage: str | None = None


class QuestionOut(BaseModel):
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
    answers_count: int
    views_count: int
    vote_score: int

    model_config = ConfigDict(from_attributes=True)
