import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FollowCreate(BaseModel):
    question_id: uuid.UUID


class FollowOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    question_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
