from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.core.dependencies import get_db, get_current_user
from app.models.db_models import Analysis, Resume, User
from app.schemas.analysis import CreateAnalysisRequest, AnalysisResponse, AnalysisStatusResponse

router = APIRouter()


@router.post("/analyses")
async def create_analysis(
    request: CreateAnalysisRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.ai_orchestrator import run_analysis
    result = await db.execute(select(Resume).where(Resume.id == request.resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    result = await db.execute(select(User).where(User.clerk_id == current_user["clerk_id"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    analysis = Analysis(
        id=str(uuid.uuid4()), resume_id=resume.id, user_id=user.id,
        jd_text=request.jd_text, jd_url=request.jd_url,
        company_name=request.company_name, mode=request.mode, status="queued",
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)

    background_tasks.add_task(run_analysis, analysis.id, resume.raw_text or "", request.jd_text)
    return {"analysis_id": analysis.id, "status": "queued", "estimated_seconds": 35}


@router.get("/analyses/{analysis_id}/status", response_model=AnalysisStatusResponse)
async def get_analysis_status(analysis_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return AnalysisStatusResponse(status=analysis.status)


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis


@router.get("/analyses/by-resume/{resume_id}")
async def get_resume_analyses(resume_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Analysis).where(Analysis.resume_id == resume_id).order_by(Analysis.created_at.desc())
    )
    analyses = result.scalars().all()
    return {"analyses": [{"id": a.id, "overall_score": a.overall_score, "status": a.status, "created_at": a.created_at} for a in analyses]}
