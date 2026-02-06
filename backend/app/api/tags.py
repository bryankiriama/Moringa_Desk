from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.question_repo import get_question_by_id
from backend.app.repositories.question_tag_repo import attach_tags, list_tags_for_question
from backend.app.repositories.tag_repo import create_tag, list_tags
from backend.app.schemas.question_tag import QuestionTagCreate
from backend.app.schemas.tag import TagCreate, TagOut

router = APIRouter(tags=["tags"])


@router.get("/tags", response_model=list[TagOut])
def list_tags_endpoint(db: Session = Depends(get_db)) -> list[TagOut]:
    return list_tags(db)


@router.post("/tags", response_model=TagOut)
def create_tag_endpoint(
    payload: TagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TagOut:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )

    return create_tag(db, name=payload.name)


@router.post("/questions/{question_id}/tags", response_model=list[TagOut])
def attach_tags_endpoint(
    question_id,
    payload: QuestionTagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TagOut]:
    question = get_question_by_id(db, question_id=question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="question not found"
        )

    if question.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="not question owner"
        )

    attach_tags(db, question_id=question_id, tag_ids=payload.tag_ids)
    return list_tags_for_question(db, question_id=question_id)
