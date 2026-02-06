from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.deps import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.faq_repo import create_faq, list_faqs
from backend.app.schemas.faq import FAQCreate, FAQOut

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
