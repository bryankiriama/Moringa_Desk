import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.answer import Answer
from backend.app.models.question import Question
from backend.app.models.user import User
from backend.app.repositories.admin_content_repo import delete_user_content
from backend.app.repositories.user_repo import delete_user
from backend.app.schemas.user import UserOut, UserRoleUpdate

router = APIRouter(prefix="/admin/users", tags=["admin"])


def _ensure_admin(current_user: User) -> None:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )


@router.get("", response_model=list[UserOut])
def list_users_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserOut]:
    _ensure_admin(current_user)
    users = list(db.scalars(select(User).order_by(User.created_at.desc())).all())

    question_counts = {
        row.author_id: row.count
        for row in db.execute(
            select(Question.author_id, func.count(Question.id).label("count")).group_by(
                Question.author_id
            )
        ).all()
    }
    answer_counts = {
        row.author_id: row.count
        for row in db.execute(
            select(Answer.author_id, func.count(Answer.id).label("count")).group_by(
                Answer.author_id
            )
        ).all()
    }

    return [
        UserOut(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            questions_count=int(question_counts.get(user.id, 0)),
            answers_count=int(answer_counts.get(user.id, 0)),
            created_at=user.created_at,
            updated_at=user.updated_at,
        )
        for user in users
    ]


@router.patch("/{user_id}", response_model=UserOut)
def update_user_role_endpoint(
    user_id: uuid.UUID,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserOut:
    _ensure_admin(current_user)

    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="cannot change own role",
        )

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="user not found"
        )

    user.role = payload.role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user_endpoint(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    _ensure_admin(current_user)

    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="cannot delete own account",
        )

    delete_user_content(db, user_id=user_id)
    if not delete_user(db, user_id=user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="user not found"
        )

    return {"detail": "user removed"}
