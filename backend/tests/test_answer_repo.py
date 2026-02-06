import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.base import Base
from backend.app.repositories.answer_repo import create_answer, list_answers_for_question


def test_create_and_list_answers_for_question() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    question_id = uuid.uuid4()
    other_question_id = uuid.uuid4()

    with SessionLocal() as session:
        a1 = create_answer(
            session,
            question_id=question_id,
            author_id=uuid.uuid4(),
            body="This is a helpful answer that explains the solution clearly.",
        )
        a2 = create_answer(
            session,
            question_id=question_id,
            author_id=uuid.uuid4(),
            body="Another helpful answer with more details for clarity.",
        )
        create_answer(
            session,
            question_id=other_question_id,
            author_id=uuid.uuid4(),
            body="Answer for a different question.",
        )

        results = list_answers_for_question(session, question_id=question_id)

        assert len(results) == 2
        assert results[0].id == a1.id
        assert results[1].id == a2.id
