import uuid

from backend.app.models.notification import Notification


def test_notification_defaults() -> None:
    notification = Notification(
        user_id=uuid.uuid4(),
        type="answer_posted",
        payload={"question_id": str(uuid.uuid4())},
    )

    assert notification.id is not None
    assert notification.is_read is False
    assert notification.created_at is not None
