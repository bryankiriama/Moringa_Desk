import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TagCreate(BaseModel):
    name: str = Field(min_length=2)


class TagOut(BaseModel):
    id: uuid.UUID
    name: str
    created_at: datetime
    usage_count: int = 0

    model_config = ConfigDict(from_attributes=True)
