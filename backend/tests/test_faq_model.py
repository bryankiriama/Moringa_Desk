from backend.app.models.faq import FAQ


def test_faq_defaults() -> None:
    faq = FAQ(
        question="How do I reset my password?",
        answer="Use the forgot password link to request a reset email.",
    )

    assert faq.id is not None
    assert faq.created_at is not None
    assert faq.updated_at is not None
