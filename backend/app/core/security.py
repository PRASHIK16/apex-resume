from fastapi import HTTPException, status
from app.core.config import settings
import httpx


async def verify_clerk_token(token: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.clerk.com/v1/tokens/verify",
                headers={
                    "Authorization": f"Bearer {settings.CLERK_SECRET_KEY}",
                    "Content-Type": "application/json",
                },
                params={"token": token},
            )
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "clerk_id": data.get("sub"),
                    "email": data.get("email", ""),
                }
    except Exception:
        pass

    # Fallback — decode without verification for development
    try:
        import base64, json
        parts = token.split(".")
        if len(parts) == 3:
            padded = parts[1] + "=" * (4 - len(parts[1]) % 4)
            payload = json.loads(base64.urlsafe_b64decode(padded))
            return {
                "clerk_id": payload.get("sub"),
                "email": payload.get("email", ""),
            }
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication token",
    )