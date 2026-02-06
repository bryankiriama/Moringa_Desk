import uuid

from backend.app.models.vote import Vote


def test_vote_defaults() -> None:
    vote = Vote(
        user_id=uuid.uuid4(),
        target_type="question",
        target_id=uuid.uuid4(),
        value=1,
    )

    assert vote.id is not None
    assert vote.created_at is not None
