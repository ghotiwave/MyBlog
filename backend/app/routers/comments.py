from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentResponse

router = APIRouter(prefix="/api/posts", tags=["comments"])


def _serialize_comment(c):
    return CommentResponse(
        id=c.id,
        post_id=c.post_id,
        author_name=c.author_name,
        content=c.content,
        created_at=c.created_at.isoformat() if c.created_at else "",
    )


@router.get("/{post_id}/comments", response_model=list[CommentResponse])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id, Post.published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )
    return [_serialize_comment(c) for c in comments]


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=201)
def create_comment(post_id: int, req: CommentCreate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id, Post.published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not req.author_name.strip() or not req.content.strip():
        raise HTTPException(status_code=422, detail="Author name and content are required")
    comment = Comment(post_id=post_id, author_name=req.author_name.strip(), content=req.content.strip())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _serialize_comment(comment)
