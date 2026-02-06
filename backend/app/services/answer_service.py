from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.answer import Answer
from backend.app.models.question import Question


class AcceptAnswerResult:
    def __init__(self, question: Question, answer: Answer) -> None:
        self.question = question
        self.answer = answer


def accept_answer(
    session: Session, *, question_id, answer_id, acting_user_id
) -> AcceptAnswerResult | None:
    question = session.get(Question, question_id)
    if question is None:
        return None

    if question.author_id != acting_user_id:
        raise PermissionError("not question owner")

    answer = session.get(Answer, answer_id)
    if answer is None:
        raise LookupError("answer not found")

    if answer.question_id != question.id:
        raise ValueError("answer not in question")

    if question.accepted_answer_id == answer.id and answer.is_accepted:
        return AcceptAnswerResult(question=question, answer=answer)

    if question.accepted_answer_id is not None:
        prev_answer = session.get(Answer, question.accepted_answer_id)
        if prev_answer is not None:
            prev_answer.is_accepted = False

    answer.is_accepted = True
    question.accepted_answer_id = answer.id

    session.add(question)
    session.add(answer)
    session.commit()

    return AcceptAnswerResult(question=question, answer=answer)
