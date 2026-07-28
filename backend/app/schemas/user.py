from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserSyncRequest(BaseModel):
    event_type: str
    data: dict


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    plan: str
    credits_remaining: int
    analyses_this_month: int
    created_at: datetime
    class Config:
        from_attributes = True
