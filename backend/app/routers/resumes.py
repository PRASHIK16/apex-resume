from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.core.dependencies import get_db, get_current_user
from app.models.db_models import Resume, User
from app.schemas.resume import ResumeUploadResponse, ResumeListResponse, ResumeResponse
from app.services.pdf_parser import extract_text
from app.services.storage_service import upload_file

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}


@router.post("/resumes/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")

    file_type = ALLOWED_TYPES[file.content_type]
    file_id = str(uuid.uuid4())
    stored_name = f"{file_id}.{file_type}"
    file_url = await upload_file(file_bytes, stored_name, file.content_type)

    result = await db.execute(select(User).where(User.clerk_id == current_user["clerk_id"]))
    user = result.scalar_one_or_none()
    if not user:
    clerk_id = current_user["clerk_id"]
    email = current_user.get("email") or f"{clerk_id}@clerk.local"
    user = User(clerk_id=clerk_id, email=email)
    db.add(user)
    await db.flush()

    resume = Resume(
        id=file_id, user_id=user.id, file_url=file_url,
        original_filename=file.filename, file_type=file_type,
        file_size_bytes=len(file_bytes), parse_status="pending",
    )
    db.add(resume)

    try:
        raw_text, is_parseable = await extract_text(file_bytes, file_type)
        if is_parseable:
            resume.raw_text = raw_text
            resume.parse_status = "complete"
        else:
            resume.parse_status = "failed"
            resume.parse_error = "Image-based PDF"
    except Exception as e:
        resume.parse_status = "failed"
        resume.parse_error = str(e)

    await db.commit()
    await db.refresh(resume)
    return ResumeUploadResponse(
        resume_id=resume.id, file_name=resume.original_filename or stored_name,
        parse_status=resume.parse_status, created_at=resume.created_at,
    )


@router.get("/resumes", response_model=ResumeListResponse)
async def list_resumes(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.clerk_id == current_user["clerk_id"]))
    user = result.scalar_one_or_none()
    if not user:
        return ResumeListResponse(resumes=[], total=0)
    result = await db.execute(select(Resume).where(Resume.user_id == user.id).order_by(Resume.created_at.desc()))
    resumes = result.scalars().all()
    return ResumeListResponse(resumes=list(resumes), total=len(resumes))


@router.get("/resumes/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    await db.delete(resume)
    await db.commit()
    return {"deleted": True}
