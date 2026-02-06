import uuid

from backend.app.models.question_tag import QuestionTag


def test_question_tag_defaults() -> None:
    qt = QuestionTag(
        question_id=uuid.uuid4(),
        tag_id=uuid.uuid4(),
    )

    assert qt.created_at is not None
