import uuid

from backend.app.models.question import Question


def test_question_defaults() -> None:
    question = Question(
        author_id=uuid.uuid4(),
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )

    assert question.id is not None
    assert question.created_at is not None
    assert question.updated_at is not None
    assert question.accepted_answer_id is None
