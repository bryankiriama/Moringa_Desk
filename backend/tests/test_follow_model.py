import uuid

from backend.app.models.follow import Follow


def test_follow_defaults() -> None:
    follow = Follow(user_id=uuid.uuid4(), question_id=uuid.uuid4())

    assert follow.id is not None
    assert follow.created_at is not None
