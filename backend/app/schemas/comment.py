from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str
    parent_id: int | None = None
    reply_to_user_id: int | None = None


class CommentResponse(BaseModel):
    id: int
    post_id: int
    author_name: str
    avatar_url: str | None = None
    content: str
    created_at: str

    model_config = {"from_attributes": True}
