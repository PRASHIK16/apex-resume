from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.models.db_models import User
from app.schemas.user import UserSyncRequest, UserResponse

router = APIRouter()


@router.post("/users/sync")
async def sync_user(request: UserSyncRequest, db: AsyncSession = Depends(get_db)):
    data = request.data
    clerk_id = data.get("id")
    email_addresses = data.get("email_addresses", [])
    email = email_addresses[0].get("email_address") if email_addresses else ""
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    full_name = f"{first_name} {last_name}".strip() or None

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()
    if user:
        user.email = email
        user.full_name = full_name
    else:
        user = User(clerk_id=clerk_id, email=email, full_name=full_name)
        db.add(user)
    await db.commit()
    return {"synced": True}


@router.get("/users/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.clerk_id == current_user["clerk_id"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
