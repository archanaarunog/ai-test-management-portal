from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.db.database import get_db
from app.db.models import Activity, User
from app.schemas.api import ErrorResponse, LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse,
             responses={401: {"model": ErrorResponse, "description": "Invalid email or password"},
                        422: {"model": ErrorResponse, "description": "Invalid request body"}})
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    db.add(Activity(id=f"act-login-{user.id}-{__import__('uuid').uuid4()}", actor_id=user.id, action="logged in", target="AI Test Management Portal"))
    db.commit()
    return {"access_token": create_access_token(user.id), "user": UserResponse.model_validate(user)}


@router.get("/me", response_model=UserResponse,
            responses={401: {"model": ErrorResponse, "description": "Valid bearer token required"}})
def me(user: User = Depends(get_current_user)):
    return user
