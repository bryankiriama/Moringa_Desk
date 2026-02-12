import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: str
    questions_count: int = 0
    answers_count: int = 0
    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class UserRoleUpdate(BaseModel):
    role: Literal["student", "admin"]
