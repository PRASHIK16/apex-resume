from fastapi import HTTPException, status
from jose import jwt, JWTError
from app.core.config import settings
import httpx


async def verify_clerk_token(token: str) -> dict:
    if settings.ENVIRONMENT == "development" and not settings.CLERK_JWT_PUBLIC_KEY:
        return {"sub": "dev_user_123", "email": "dev@example.com"}
    try:
        payload = jwt.decode(token, settings.CLERK_JWT_PUBLIC_KEY, algorithms=["RS256"])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")
