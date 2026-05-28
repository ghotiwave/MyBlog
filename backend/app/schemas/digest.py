from pydantic import BaseModel


class DigestResponse(BaseModel):
    id: int
    title: str
    topic: str
    content: str
    source_urls: str | None = None
    created_at: str

    model_config = {"from_attributes": True}


class PaginatedDigests(BaseModel):
    items: list[DigestResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
