import asyncio
from typing import Tuple

async def extract_text(file_bytes: bytes, file_type: str) -> Tuple[str, bool]:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _extract_sync, file_bytes, file_type)

def _extract_sync(file_bytes: bytes, file_type: str) -> Tuple[str, bool]:
    if file_type == "pdf":
        return _extract_pdf(file_bytes)
    elif file_type == "docx":
        return _extract_docx(file_bytes)
    return "", False

def _extract_pdf(file_bytes: bytes) -> Tuple[str, bool]:
    try:
        import pdfplumber
        import io
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        text = "\n\n".join(p for p in pages if p.strip())
        return text, bool(text.strip())
    except Exception as e:
        return f"Parse error: {e}", False

def _extract_docx(file_bytes: bytes) -> Tuple[str, bool]:
    try:
        from docx import Document
        import io
        doc = Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs), bool(paragraphs)
    except Exception as e:
        return f"Parse error: {e}", False
