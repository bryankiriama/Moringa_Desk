import uuid

from backend.app.models.related_question import RelatedQuestion


def test_related_question_defaults() -> None:
    rel = RelatedQuestion(
        question_id=uuid.uuid4(),
        related_question_id=uuid.uuid4(),
    )

    assert rel.created_at is not None
