import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FAQCreate(BaseModel):
    question: str = Field(min_length=10)
    answer: str = Field(min_length=20)
    category: str | None = Field(default=None, min_length=2, max_length=50)


class FAQOut(BaseModel):
    id: uuid.UUID
    question: str
    answer: str
    category: str | None
    created_by: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FAQUpdate(BaseModel):
    question: str | None = Field(default=None, min_length=10)
    answer: str | None = Field(default=None, min_length=20)
    category: str | None = Field(default=None, min_length=2, max_length=50)
