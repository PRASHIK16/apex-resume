from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CreateAnalysisRequest(BaseModel):
    resume_id: str
    jd_text: Optional[str] = None
    jd_url: Optional[str] = None
    company_name: Optional[str] = None
    mode: str = "kind"


class AnalysisStatusResponse(BaseModel):
    status: str
    processing_steps: Optional[list] = None
    estimated_remaining_seconds: Optional[int] = None


class AnalysisResponse(BaseModel):
    id: str
    resume_id: str
    status: str
    mode: str
    overall_score: Optional[int] = None
    ats_keyword_score: Optional[int] = None
    ats_format_score: Optional[int] = None
    content_quality_score: Optional[int] = None
    confidence_score: Optional[int] = None
    impact_score: Optional[int] = None
    readability_score: Optional[int] = None
    peer_percentile: Optional[int] = None
    rejection_risks: list = []
    bullet_analyses: list = []
    missing_keywords: list = []
    matched_keywords: list = []
    priority_fixes: list = []
    created_at: datetime
    completed_at: Optional[datetime] = None
    class Config:
        from_attributes = True
