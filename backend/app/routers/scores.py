from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.score import Score
from app.models.user import User
from app.schemas.score import ScoreSubmit, ScoreResponse, LeaderboardResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/scores", tags=["scores"])


@router.get("/leaderboard", response_model=LeaderboardResponse)
def leaderboard(db: Session = Depends(get_db)):
    rows = (
        db.query(Score, User.username)
        .join(User, Score.user_id == User.id)
        .order_by(Score.score.desc())
        .limit(20)
        .all()
    )
    leaderboard = [
        ScoreResponse(
            id=s.id,
            username=username,
            score=s.score,
            played_at=s.played_at.isoformat() if s.played_at else "",
        )
        for s, username in rows
    ]
    return LeaderboardResponse(leaderboard=leaderboard)


@router.post("", response_model=ScoreResponse, status_code=201)
def submit_score(
    req: ScoreSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    score = Score(user_id=current_user.id, score=req.score)
    db.add(score)
    db.commit()
    db.refresh(score)
    return ScoreResponse(
        id=score.id,
        username=current_user.username,
        score=score.score,
        played_at=score.played_at.isoformat() if score.played_at else "",
    )
