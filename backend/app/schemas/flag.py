import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class FlagCreate(BaseModel):
    target_type: Literal["question", "answer"]
    target_id: uuid.UUID
    reason: str = Field(min_length=5, max_length=300)


class FlagOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    target_type: str
    target_id: uuid.UUID
    reason: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
