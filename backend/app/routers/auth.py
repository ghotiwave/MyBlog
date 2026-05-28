from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta, timezone
import bcrypt
from app.database import get_db
from app.config import settings
from app.models.user import User
from app.schemas.user import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def create_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user.id), "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def user_to_response(user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else "",
    }


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    user = User(
        username=req.username,
        email=req.email,
        password_hash=bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_token(user)
    return TokenResponse(access_token=token, user=user_to_response(user))


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not bcrypt.checkpw(req.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_token(user)
    return TokenResponse(access_token=token, user=user_to_response(user))


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
