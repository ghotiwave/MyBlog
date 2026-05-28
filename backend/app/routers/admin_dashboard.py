from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.post import Post
from app.models.comment import Comment
from app.models.user import User
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin/dashboard", tags=["admin-dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    total_posts = db.query(func.count(Post.id)).scalar() or 0
    published_posts = db.query(func.count(Post.id)).filter(Post.published == True).scalar() or 0
    total_comments = db.query(func.count(Comment.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    return {
        "total_posts": total_posts,
        "published_posts": published_posts,
        "total_comments": total_comments,
        "total_users": total_users,
    }
