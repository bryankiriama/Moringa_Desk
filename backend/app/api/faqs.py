from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.faq_repo import create_faq, delete_faq, list_faqs, update_faq
from backend.app.schemas.faq import FAQCreate, FAQOut, FAQUpdate

router = APIRouter(prefix="/faqs", tags=["faqs"])


@router.get("", response_model=list[FAQOut])
def list_faqs_endpoint(db: Session = Depends(get_db)) -> list[FAQOut]:
    return list_faqs(db)


@router.post("", response_model=FAQOut)
def create_faq_endpoint(
    payload: FAQCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FAQOut:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )

    return create_faq(
        db,
        question=payload.question,
        answer=payload.answer,
        created_by=current_user.id,
    )


@router.patch("/{faq_id}", response_model=FAQOut)
def update_faq_endpoint(
    faq_id: str,
    payload: FAQUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FAQOut:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )

    faq = update_faq(
        db,
        faq_id=faq_id,
        question=payload.question,
        answer=payload.answer,
    )
    if faq is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="faq not found"
        )
    return faq


@router.delete("/{faq_id}")
def delete_faq_endpoint(
    faq_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="admin only"
        )

    if not delete_faq(db, faq_id=faq_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="faq not found"
        )

    return {"detail": "faq deleted"}
