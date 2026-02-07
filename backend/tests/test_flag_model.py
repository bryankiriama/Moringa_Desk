import uuid

from backend.app.models.flag import Flag


def test_flag_defaults() -> None:
    flag = Flag(
        user_id=uuid.uuid4(),
        target_type="question",
        target_id=uuid.uuid4(),
        reason="Spam content",
    )

    assert flag.id is not None
    assert flag.created_at is not None
