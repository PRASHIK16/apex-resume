from app.workers.celery_app import celery_app
import asyncio


@celery_app.task(bind=True, max_retries=3)
def run_analysis_task(self, analysis_id: str, resume_text: str, jd_text: str = None):
    try:
        from app.services.ai_orchestrator import run_analysis
        asyncio.run(run_analysis(analysis_id, resume_text, jd_text))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)
