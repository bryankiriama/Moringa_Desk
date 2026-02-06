from sqlalchemy.orm import Session

from backend.app.models.answer import Answer
from backend.app.models.question import Question
from backend.app.models.vote import Vote
from backend.app.repositories.vote_repo import upsert_vote


class VoteTargetNotFound(Exception):
    pass


class SelfVoteNotAllowed(Exception):
    pass


def cast_vote(
    session: Session,
    *,
    actor_id,
    target_type: str,
    target_id,
    value: int,
) -> Vote:
    if target_type == "question":
        target = session.get(Question, target_id)
        if target is None:
            raise VoteTargetNotFound("question not found")
        author_id = target.author_id
    elif target_type == "answer":
        target = session.get(Answer, target_id)
        if target is None:
            raise VoteTargetNotFound("answer not found")
        author_id = target.author_id
    else:
        raise VoteTargetNotFound("unknown target type")

    if author_id == actor_id:
        raise SelfVoteNotAllowed("self vote not allowed")

    return upsert_vote(
        session,
        user_id=actor_id,
        target_type=target_type,
        target_id=target_id,
        value=value,
    )
