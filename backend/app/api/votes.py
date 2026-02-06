from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.vote import VoteCreate, VoteOut
from backend.app.services.vote_service import (
    SelfVoteNotAllowed,
    VoteTargetNotFound,
    cast_vote,
)

router = APIRouter(prefix="/votes", tags=["votes"])


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

    return vote
