from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings


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

# CORS — allow all origins in production temporarily to fix CORS issue
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://apex-resume-ivory.vercel.app",
    "https://apex-resume-git-main-prashikdongre3937-7184s-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


from app.routers import resumes, analyses, ai_router, users
app.include_router(resumes.router,    prefix="/api/v1", tags=["resumes"])
app.include_router(analyses.router,   prefix="/api/v1", tags=["analyses"])
app.include_router(ai_router.router,  prefix="/api/v1", tags=["ai"])
app.include_router(users.router,      prefix="/api/v1", tags=["users"])