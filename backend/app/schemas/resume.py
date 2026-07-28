from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ResumeUploadResponse(BaseModel):
    resume_id: str
    file_name: str
    parse_status: str
    created_at: datetime


class ResumeResponse(BaseModel):
    id: str
    original_filename: Optional[str]
    file_type: Optional[str]
    parse_status: str
    current_version: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class ResumeListResponse(BaseModel):
    resumes: list[ResumeResponse]
    total: int
