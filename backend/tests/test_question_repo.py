import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.repositories.question_repo import create_question, list_questions


def test_create_and_list_questions() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    with SessionLocal() as session:
        author_id = uuid.uuid4()
        q1 = create_question(
            session,
            author_id=author_id,
            title="How do I set up a virtual environment?",
            body="I need help setting up a virtual environment in Python.",
            category="Python",
            stage="Foundation",
        )
        q2 = create_question(
            session,
            author_id=author_id,
            title="How to debug a React app?",
            body="What tools can I use to debug a React application effectively?",
            category="React",
            stage="Intermediate",
        )

        results = list_questions(session, limit=10, offset=0)

        assert len(results) == 2
        assert results[0].id == q2.id
        assert results[1].id == q1.id
