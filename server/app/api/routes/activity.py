from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import Activity, User
from app.schemas.api import ActivityResponse, ErrorResponse

router = APIRouter(prefix="/activity", tags=["Activity"], dependencies=[Depends(get_current_user)],
                   responses={401: {"model": ErrorResponse, "description": "Valid bearer token required"}})


@router.get("", response_model=list[ActivityResponse])
def list_activity(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    rows = db.scalars(select(Activity).options(joinedload(Activity.actor)).order_by(Activity.created_at.desc()).limit(limit)).unique().all()
    return [{"id": row.id, "actor": row.actor.name if row.actor else "System", "action": row.action,
             "target": row.target, "timestamp": row.created_at, "status": row.status} for row in rows]
