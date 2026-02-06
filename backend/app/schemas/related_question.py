import uuid

from pydantic import BaseModel, Field


class RelatedQuestionCreate(BaseModel):
    related_question_ids: list[uuid.UUID] = Field(min_length=1)
