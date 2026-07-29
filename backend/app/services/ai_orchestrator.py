import json
import re
from datetime import datetime


def _clean_json(text: str) -> str:
    text = text.strip()
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            if part.startswith("{"):
                return part
    return text


def _build_prompt(resume_text: str, jd_text: str = None) -> str:
    jd_section = f"\n\nJob Description:\n{jd_text[:2000]}" if jd_text else ""
    return f"""You are an expert resume analyst and ATS specialist. Analyze this resume and return a detailed JSON analysis.

Resume Text:
{resume_text[:5000]}{jd_section}

Return ONLY valid JSON, no markdown, no explanation:
{{
  "overall_score": <integer 0-100>,
  "ats_keyword_score": <integer 0-100>,
  "ats_format_score": <integer 0-100>,
  "content_quality_score": <integer 0-100>,
  "confidence_score": <integer 0-100>,
  "impact_score": <integer 0-100>,
  "readability_score": <integer 0-100>,
  "rejection_risks": [
    {{
      "riskTitle": "<short title>",
      "specificText": "<exact text from resume>",
      "whyItHurts": "<specific reason>",
      "severity": "<HIGH|MEDIUM|LOW>",
      "fix": "<actionable fix>"
    }}
  ],
  "bullet_analyses": [
    {{
      "bulletId": "b1",
      "original": "<exact bullet text>",
      "confidenceScore": <integer 0-100>,
      "impactLevel": "<HIGH|MEDIUM|LOW>",
      "hasQuantification": <true|false>,
      "passivePhrases": ["<passive phrase if any>"]
    }}
  ],
  "missing_keywords": [
    {{
      "keyword": "<missing keyword>",
      "importance": "<required|nice_to_have>",
      "whereToAdd": "<where to add>"
    }}
  ]
}}

Rules:
- rejection_risks: 2-4 real specific risks from THIS resume
- bullet_analyses: up to 8 actual bullets from the resume
- Scores must reflect ACTUAL content, not generic values
- Quote actual text from the resume"""


async def _analyze_with_claude(resume_text: str, jd_text: str = None, api_key: str = "") -> dict:
    import anthropic

    if not resume_text or len(resume_text.strip()) < 50:
        return {}

    client = anthropic.AsyncAnthropic(api_key=api_key)
    prompt = _build_prompt(resume_text, jd_text)

    message = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text
    cleaned = _clean_json(raw)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if match:
            data = json.loads(match.group())
        else:
            return {}

    required = ["overall_score", "ats_keyword_score", "rejection_risks"]
    if not all(k in data for k in required):
        return {}

    return data


async def run_analysis(analysis_id: str, resume_text: str, jd_text: str = None):
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlalchemy.pool import NullPool
    from sqlalchemy import select
    from app.core.config import settings
    from app.models.db_models import Analysis
    from app.services.ats_scorer import score_resume

    engine = create_async_engine(
        settings.DATABASE_URL,
        poolclass=NullPool,
        connect_args={"statement_cache_size": 0},
    )
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    async with SessionLocal() as db:
        result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
        analysis = result.scalar_one_or_none()
        if not analysis:
            await engine.dispose()
            return

        analysis.status = "processing"
        await db.commit()

        try:
            scores = {}

            if settings.ANTHROPIC_API_KEY:
                scores = await _analyze_with_claude(
                    resume_text, jd_text, settings.ANTHROPIC_API_KEY
                )

            if not scores:
                scores = score_resume(resume_text, jd_text or "")

            analysis.overall_score         = scores.get("overall_score")
            analysis.ats_keyword_score     = scores.get("ats_keyword_score")
            analysis.ats_format_score      = scores.get("ats_format_score")
            analysis.content_quality_score = scores.get("content_quality_score")
            analysis.confidence_score      = scores.get("confidence_score")
            analysis.impact_score          = scores.get("impact_score")
            analysis.readability_score     = scores.get("readability_score")
            analysis.rejection_risks       = scores.get("rejection_risks", [])
            analysis.bullet_analyses       = scores.get("bullet_analyses", [])
            analysis.missing_keywords      = scores.get("missing_keywords", [])
            analysis.status                = "complete"
            analysis.completed_at          = datetime.utcnow()

        except Exception as e:
            analysis.status = "failed"
            analysis.error_message = str(e)

        await db.commit()

    await engine.dispose()