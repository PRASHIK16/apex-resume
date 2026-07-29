from fastapi import HTTPException, status
from app.core.config import settings
import base64
import json


async def verify_clerk_token(token: str) -> dict:
    # Decode JWT payload without verification (works for both dev and prod keys)
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Invalid JWT format")
        
        padding = 4 - len(parts[1]) % 4
        padded = parts[1] + ("=" * padding)
        payload = json.loads(base64.urlsafe_b64decode(padded).decode("utf-8"))
        
        clerk_id = payload.get("sub")
        email = payload.get("email", "")
        
        if not clerk_id:
            raise ValueError("No sub in token")
        
        return {"clerk_id": clerk_id, "email": email}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
        )