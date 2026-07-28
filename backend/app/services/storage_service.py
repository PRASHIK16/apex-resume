import os
from app.core.config import settings


async def upload_file(file_bytes: bytes, filename: str, content_type: str) -> str:
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        return await _upload_supabase(file_bytes, filename, content_type)
    return await _upload_local(file_bytes, filename)


async def _upload_supabase(file_bytes: bytes, filename: str, content_type: str) -> str:
    try:
        from supabase import create_client
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
        client.storage.from_("resumes").upload(
            path=filename,
            file=file_bytes,
            file_options={"content-type": content_type},
        )
        return f"{settings.SUPABASE_URL}/storage/v1/object/resumes/{filename}"
    except Exception as e:
        raise RuntimeError(f"Supabase upload failed: {e}")


async def _upload_local(file_bytes: bytes, filename: str) -> str:
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    path = os.path.join(upload_dir, filename)
    with open(path, "wb") as f:
        f.write(file_bytes)
    return f"local://{path}"
