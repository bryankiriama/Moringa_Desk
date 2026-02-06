import uuid

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.models.question import Question
from backend.app.models.related_question import RelatedQuestion
from backend.app.repositories.related_question_repo import (
    add_related_questions,
    list_related_questions,
)


def _setup_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_symmetric_linking_and_duplicates_ignored() -> None:
    session = _setup_session()

    q1 = Question(
        author_id=uuid.uuid4(),
        title="Question one title",
        body="Question one body is long enough for validation.",
        category="Python",
        stage="Foundation",
    )
    q2 = Question(
        author_id=uuid.uuid4(),
        title="Question two title",
        body="Question two body is long enough for validation.",
        category="React",
        stage="Intermediate",
    )
    session.add_all([q1, q2])
    session.commit()

    add_related_questions(session, question_id=q1.id, related_question_ids=[q2.id, q2.id])

    rows = session.scalars(select(RelatedQuestion)).all()
    assert len(rows) == 2

    # both directions exist
    assert any(r.question_id == q1.id and r.related_question_id == q2.id for r in rows)
    assert any(r.question_id == q2.id and r.related_question_id == q1.id for r in rows)


def test_self_link_ignored() -> None:
    session = _setup_session()

    q1 = Question(
        author_id=uuid.uuid4(),
        title="Question one title",
        body="Question one body is long enough for validation.",
        category="Python",
        stage="Foundation",
    )
    session.add(q1)
    session.commit()

    add_related_questions(session, question_id=q1.id, related_question_ids=[q1.id])

    rows = session.scalars(select(RelatedQuestion)).all()
    assert len(rows) == 0


def test_list_related_questions_ordered() -> None:
    session = _setup_session()

    q1 = Question(
        author_id=uuid.uuid4(),
        title="Question one title",
        body="Question one body is long enough for validation.",
        category="Python",
        stage="Foundation",
    )
    q2 = Question(
        author_id=uuid.uuid4(),
        title="Question two title",
        body="Question two body is long enough for validation.",
        category="React",
        stage="Intermediate",
    )
    q3 = Question(
        author_id=uuid.uuid4(),
        title="Question three title",
        body="Question three body is long enough for validation.",
        category="DevOps",
        stage="Advanced",
    )
    session.add_all([q1, q2, q3])
    session.commit()

    add_related_questions(session, question_id=q1.id, related_question_ids=[q2.id, q3.id])

    related = list_related_questions(session, question_id=q1.id)

    assert len(related) == 2
    assert related[0].id == q3.id
    assert related[1].id == q2.id
