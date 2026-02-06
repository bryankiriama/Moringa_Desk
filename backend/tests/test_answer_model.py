import uuid

from backend.app.models.answer import Answer


def test_answer_defaults() -> None:
    answer = Answer(
        question_id=uuid.uuid4(),
        author_id=uuid.uuid4(),
        body="This is a helpful answer that explains the solution clearly.",
    )

    assert answer.id is not None
    assert answer.is_accepted is False
    assert answer.created_at is not None
    assert answer.updated_at is not None
