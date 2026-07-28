from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.core.dependencies import get_current_user
from app.core.config import settings

router = APIRouter()


class RewriteRequest(BaseModel):
    bullet_text: str
    context: dict = {}
    mode: str = 'kind'


class RewriteResponse(BaseModel):
    rewrites: list[dict]


@router.post('/ai/rewrite-bullet', response_model=RewriteResponse)
async def rewrite_bullet(
    request: RewriteRequest,
    current_user: dict = Depends(get_current_user),
):
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail='AI service not configured. Add ANTHROPIC_API_KEY to backend/.env',
        )

    import anthropic
    import json

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    mode_msg = 'Be direct and critical' if request.mode == 'brutal' else 'Be constructive'
    role = request.context.get('role', 'Software Engineer')

    prompt = (
        'You are an expert resume writer. Rewrite this bullet to be stronger,\n'
        'more impactful, and ATS-friendly. Provide 2 rewrite options.\n\n'
        f'Original bullet: {request.bullet_text}\n'
        f'Role: {role}\n'
        f'Tone: {mode_msg}\n\n'
        'Return ONLY valid JSON (no markdown), exactly this structure:\n'
        '{"rewrites":[{"text":"...","confidence_score":85,"explanation":"...","ats_keywords_added":[]}]}'
    )

    message = client.messages.create(
        model='claude-3-5-sonnet-20241022',
        max_tokens=1024,
        messages=[{'role': 'user', 'content': prompt}],
    )

    try:
        text = message.content[0].text
        if '```' in text:
            text = text.split('```')[1]
            if text.startswith('json'):
                text = text[4:]
        result = json.loads(text.strip())
        return RewriteResponse(rewrites=result['rewrites'])
    except Exception:
        return RewriteResponse(rewrites=[{
            'text': request.bullet_text,
            'confidence_score': 50,
            'explanation': 'Could not generate rewrite',
            'ats_keywords_added': [],
        }])
