from fastapi import FastAPI, Request
from fastapi.responses import Response
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


@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept"
        response.headers["Access-Control-Max-Age"] = "86400"
        return response
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept"
    return response


@app.get("/health")
async def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


from app.routers import resumes, analyses, ai_router, users
app.include_router(resumes.router,    prefix="/api/v1", tags=["resumes"])
app.include_router(analyses.router,   prefix="/api/v1", tags=["analyses"])
app.include_router(ai_router.router,  prefix="/api/v1", tags=["ai"])
app.include_router(users.router,      prefix="/api/v1", tags=["users"])