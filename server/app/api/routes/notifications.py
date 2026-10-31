from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import Notification, User
from app.schemas.api import ErrorResponse, MarkReadResponse, NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"], dependencies=[Depends(get_current_user)],
                   responses={401: {"model": ErrorResponse, "description": "Valid bearer token required"}})


@router.get("", response_model=list[NotificationResponse])
def list_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Notification).where(or_(Notification.user_id.is_(None), Notification.user_id == user.id)).order_by(Notification.created_at.desc())).all()
    return [{"id": row.id, "type": row.type, "title": row.title, "message": row.message,
             "timestamp": row.created_at, "read": row.read} for row in rows]


@router.patch("/{notification_id}/read", response_model=MarkReadResponse,
              responses={404: {"model": ErrorResponse, "description": "Notification not found"}})
def mark_read(notification_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.scalar(select(Notification).where(Notification.id == notification_id,
                                                or_(Notification.user_id.is_(None), Notification.user_id == user.id)))
    if row is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    row.read = True
    db.commit()
    return {"id": row.id, "read": row.read}
