import uuid

from pydantic import BaseModel, Field


class QuestionTagCreate(BaseModel):
    tag_ids: list[uuid.UUID] = Field(min_length=1)
