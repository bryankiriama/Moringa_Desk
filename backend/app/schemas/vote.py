import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class VoteCreate(BaseModel):
    target_type: Literal["question", "answer"]
    target_id: uuid.UUID
    value: int = Field(ge=-1, le=1)

    @field_validator("value")
    @classmethod
    def value_must_be_non_zero(cls, value: int) -> int:
        if value == 0:
            raise ValueError("value must be -1 or 1")
        return value


class VoteOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    target_type: str
    target_id: uuid.UUID
    value: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
