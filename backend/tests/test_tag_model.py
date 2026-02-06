from backend.app.models.tag import Tag


def test_tag_defaults() -> None:
    tag = Tag(name="python")

    assert tag.id is not None
    assert tag.created_at is not None
