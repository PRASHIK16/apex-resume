-- Run this in Supabase SQL Editor to create the database schema
-- Go to: Supabase → SQL Editor → New Query → paste this → Run

CREATE TABLE IF NOT EXISTS users (
    id          VARCHAR PRIMARY KEY,
    clerk_id    VARCHAR UNIQUE NOT NULL,
    email       VARCHAR UNIQUE NOT NULL,
    full_name   VARCHAR,
    plan        VARCHAR DEFAULT 'free',
    credits_remaining   INTEGER DEFAULT 3,
    analyses_this_month INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resumes (
    id                VARCHAR PRIMARY KEY,
    user_id           VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url          TEXT NOT NULL,
    original_filename VARCHAR,
    file_type         VARCHAR(10),
    file_size_bytes   INTEGER,
    raw_text          TEXT,
    parsed_sections   JSONB,
    parse_status      VARCHAR DEFAULT 'pending',
    parse_error       TEXT,
    is_master         BOOLEAN DEFAULT FALSE,
    current_version   INTEGER DEFAULT 1,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analyses (
    id                    VARCHAR PRIMARY KEY,
    resume_id             VARCHAR NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    user_id               VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jd_text               TEXT,
    jd_url                VARCHAR,
    company_name          VARCHAR,
    status                VARCHAR DEFAULT 'queued',
    mode                  VARCHAR DEFAULT 'kind',
    overall_score         INTEGER,
    ats_keyword_score     INTEGER,
    ats_format_score      INTEGER,
    content_quality_score INTEGER,
    confidence_score      INTEGER,
    impact_score          INTEGER,
    readability_score     INTEGER,
    peer_percentile       INTEGER,
    rejection_risks       JSONB DEFAULT '[]',
    bullet_analyses       JSONB DEFAULT '[]',
    missing_keywords      JSONB DEFAULT '[]',
    matched_keywords      JSONB DEFAULT '[]',
    priority_fixes        JSONB DEFAULT '[]',
    full_analysis         JSONB,
    celery_task_id        VARCHAR,
    error_message         TEXT,
    created_at            TIMESTAMP DEFAULT NOW(),
    completed_at          TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id   ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_resume_id ON analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id   ON analyses(user_id);
