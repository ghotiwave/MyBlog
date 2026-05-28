from pydantic import BaseModel


class ScoreSubmit(BaseModel):
    score: int


class ScoreResponse(BaseModel):
    id: int
    username: str
    score: int
    played_at: str


class LeaderboardResponse(BaseModel):
    leaderboard: list[ScoreResponse]
