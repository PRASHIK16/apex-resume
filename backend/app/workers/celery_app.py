from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "apex_resume",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.tasks.analysis_tasks"],
)

celery_app.conf.task_routes = {
    "app.workers.tasks.analysis_tasks.*": {"queue": "analysis"},
}
