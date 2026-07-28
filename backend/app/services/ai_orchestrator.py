from datetime import datetime


async def run_analysis(analysis_id: str, resume_text: str, jd_text: str = None):
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlalchemy import select
    from app.core.config import settings
    from app.models.db_models import Analysis
    from app.services.ats_scorer import score_resume

    engine = create_async_engine(settings.DATABASE_URL)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    async with SessionLocal() as db:
        result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
        analysis = result.scalar_one_or_none()
        if not analysis:
            return

        analysis.status = "processing"
        await db.commit()

        try:
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
