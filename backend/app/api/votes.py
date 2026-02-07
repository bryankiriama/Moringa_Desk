from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.answer import Answer
from backend.app.models.question import Question
from backend.app.models.user import User
from backend.app.repositories.notification_repo import create_notification
from backend.app.schemas.vote import VoteCreate, VoteOut
from backend.app.services.vote_service import (
    SelfVoteNotAllowed,
    VoteTargetNotFound,
    cast_vote,
)

router = APIRouter(prefix="/votes", tags=["votes"])


def _build_vote_notification(db: Session, payload: VoteCreate, actor_id) -> dict | None:
    if payload.target_type == "question":
        target = db.get(Question, payload.target_id)
        if target is None:
            return None
        owner_id = target.author_id
        if owner_id == actor_id:
            return None
        return {
            "user_id": owner_id,
            "type": "vote_received",
            "payload": {
                "target_type": "question",
                "target_id": str(payload.target_id),
                "actor_id": str(actor_id),
                "value": payload.value,
            },
        }

    target = db.get(Answer, payload.target_id)
    if target is None:
        return None
    owner_id = target.author_id
    if owner_id == actor_id:
        return None
    return {
        "user_id": owner_id,
        "type": "vote_received",
        "payload": {
            "target_type": "answer",
            "target_id": str(payload.target_id),
            "actor_id": str(actor_id),
            "value": payload.value,
            "question_id": str(target.question_id),
        },
    }


@router.post("", response_model=VoteOut)
def create_vote_endpoint(
    payload: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoteOut:
    try:
        vote = cast_vote(
            db,
            actor_id=current_user.id,
            target_type=payload.target_type,
            target_id=payload.target_id,
            value=payload.value,
        )
    except SelfVoteNotAllowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="self vote not allowed"
        )
    except VoteTargetNotFound as exc:
        detail = str(exc)
        if "not found" in detail:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

    notification = _build_vote_notification(db, payload, current_user.id)
    if notification is not None:
        create_notification(
            db,
            user_id=notification["user_id"],
            type=notification["type"],
            payload=notification["payload"],
        )

    return vote
