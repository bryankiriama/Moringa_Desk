import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.models.question import Question
from backend.app.repositories.question_tag_repo import attach_tags, list_tags_for_question
from backend.app.repositories.tag_repo import create_tag, list_tags


def _setup_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_create_and_list_tags_normalized() -> None:
    session = _setup_session()

    create_tag(session, name="  Python ")
    create_tag(session, name="React")

    tags = list_tags(session)
    assert [t.name for t in tags] == ["python", "react"]


def test_attach_tags_ignores_duplicates() -> None:
    session = _setup_session()

    q = Question(
        author_id=uuid.uuid4(),
        title="How do I set up a virtual environment?",
        body="I need help setting up a virtual environment in Python.",
        category="Python",
        stage="Foundation",
    )
    session.add(q)
    session.commit()

    t1 = create_tag(session, name="Python")
    t2 = create_tag(session, name="DevOps")

    attach_tags(session, question_id=q.id, tag_ids=[t1.id, t2.id, t1.id])

    tags = list_tags_for_question(session, question_id=q.id)
    assert [t.name for t in tags] == ["devops", "python"]
