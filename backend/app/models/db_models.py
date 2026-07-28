from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, JSON, Float, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship
from datetime import datetime
import uuid


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_id = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=True)
    plan = Column(String, default="free")
    credits_remaining = Column(Integer, default=3)
    analyses_this_month = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    file_url = Column(Text, nullable=False)
    original_filename = Column(String)
    file_type = Column(String(10))
    file_size_bytes = Column(Integer)
    raw_text = Column(Text)
    parsed_sections = Column(JSON)
    parse_status = Column(String, default="pending")
    parse_error = Column(Text)
    is_master = Column(Boolean, default=False)
    current_version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume", cascade="all, delete-orphan")


class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    jd_text = Column(Text)
    jd_url = Column(String)
    company_name = Column(String)
    status = Column(String, default="queued")
    mode = Column(String, default="kind")
    overall_score = Column(Integer)
    ats_keyword_score = Column(Integer)
    ats_format_score = Column(Integer)
    content_quality_score = Column(Integer)
    confidence_score = Column(Integer)
    impact_score = Column(Integer)
    readability_score = Column(Integer)
    peer_percentile = Column(Integer)
    rejection_risks = Column(JSON, default=list)
    bullet_analyses = Column(JSON, default=list)
    missing_keywords = Column(JSON, default=list)
    matched_keywords = Column(JSON, default=list)
    priority_fixes = Column(JSON, default=list)
    full_analysis = Column(JSON)
    celery_task_id = Column(String)
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    resume = relationship("Resume", back_populates="analyses")
