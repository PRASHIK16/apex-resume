from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.routers import resumes, analyses, ai_router, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting Apex Resume API - env: {settings.ENVIRONMENT}")
    yield
    print("Shutting down")


app = FastAPI(
    title="Apex Resume API",
    description="AI-Powered Resume Optimization Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


app.include_router(resumes.router,    prefix="/api/v1", tags=["resumes"])
app.include_router(analyses.router,   prefix="/api/v1", tags=["analyses"])
app.include_router(ai_router.router,  prefix="/api/v1", tags=["ai"])
app.include_router(users.router,      prefix="/api/v1", tags=["users"])
