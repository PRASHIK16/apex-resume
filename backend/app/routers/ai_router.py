from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.core.config import settings

router = APIRouter()

PASSIVE_REPLACEMENTS = {
    "worked on": "developed",
    "helped with": "contributed to",
    "assisted with": "supported",
    "was responsible for": "owned",
    "participated in": "drove",
    "involved in": "led",
    "took part in": "collaborated on",
    "was part of": "served on",
    "helped to": "directly",
}

POWER_VERBS = [
    "Led", "Built", "Developed", "Designed", "Architected", "Launched",
    "Scaled", "Delivered", "Drove", "Optimized", "Created", "Implemented",
    "Established", "Spearheaded", "Engineered", "Managed", "Directed",
    "Orchestrated", "Pioneered", "Transformed",
]


def rule_based_rewrite(bullet: str) -> list[dict]:
    rewrites = []
    improved = bullet
    changes = []

    # Pass 1: replace passive phrases
    for passive, active in PASSIVE_REPLACEMENTS.items():
        if passive.lower() in improved.lower():
            idx = improved.lower().find(passive.lower())
            improved = improved[:idx] + active + improved[idx + len(passive):]
            if improved:
                improved = improved[0].upper() + improved[1:]
            changes.append(f"'{passive}' → '{active}'")

    if improved != bullet:
        rewrites.append({
            "text": improved.strip(),
            "confidence_score": 72,
            "explanation": f"Replaced passive language: {', '.join(changes)}",
            "ats_keywords_added": [],
        })

    # Pass 2: add quantification hint if no numbers
    has_number = any(c.isdigit() for c in bullet)
    base = improved if improved != bullet else bullet

    if not has_number:
        quantified = base.rstrip('.') + " — achieving measurable impact (tip: add % improvement, # users, or time saved)"
        rewrites.append({
            "text": quantified,
            "confidence_score": 80,
            "explanation": "Quantified bullets are 40% more effective — add specific numbers, percentages, or scale.",
            "ats_keywords_added": [],
        })
    else:
        # Has numbers but might start weak — suggest power verb
        words = base.split()
        if words:
            first = words[0].lower().rstrip(',')
            low_power = ["helped", "worked", "assisted", "was", "did", "made", "got", "used"]
            if first in low_power:
                verb = POWER_VERBS[len(bullet) % len(POWER_VERBS)]
                stronger = verb + " " + " ".join(words[1:])
                rewrites.append({
                    "text": stronger.strip(),
                    "confidence_score": 82,
                    "explanation": f"Stronger opening verb — '{verb}' demonstrates clear ownership and leadership.",
                    "ats_keywords_added": [verb],
                })

    # Ensure always at least one rewrite
    if not rewrites:
        words = bullet.split()
        if words:
            verb = POWER_VERBS[len(bullet) % len(POWER_VERBS)]
            first = words[0]
            if first.lower() not in [v.lower() for v in POWER_VERBS]:
                rewrites.append({
                    "text": (verb + " " + " ".join(words[1:])).strip(),
                    "confidence_score": 70,
                    "explanation": f"'{verb}' signals stronger ownership than '{first}'.",
                    "ats_keywords_added": [verb],
                })
            else:
                rewrites.append({
                    "text": bullet + " (consider adding a specific metric for stronger impact)",
                    "confidence_score": 65,
                    "explanation": "This bullet already uses a power verb — adding a metric would make it excellent.",
                    "ats_keywords_added": [],
                })

    return rewrites[:2]  # max 2 rewrites


class RewriteRequest(BaseModel):
    bullet_text: str
    context: dict = {}
    mode: str = "kind"


class RewriteResponse(BaseModel):
    rewrites: list[dict]


@router.post("/ai/rewrite-bullet", response_model=RewriteResponse)
async def rewrite_bullet(
    request: RewriteRequest,
    current_user: dict = Depends(get_current_user),
):
    # If Anthropic key available — use Claude
    if settings.ANTHROPIC_API_KEY:
        try:
            import anthropic
            import json

            client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            mode_msg = "Be direct and critical" if request.mode == "brutal" else "Be constructive"
            role = request.context.get("role", "Software Engineer")

            prompt = (
                "You are an expert resume writer. Rewrite this bullet to be stronger, "
                "more impactful, and ATS-friendly. Provide 2 rewrite options.\n\n"
                f"Original: {request.bullet_text}\n"
                f"Role: {role}\nTone: {mode_msg}\n\n"
                'Return ONLY valid JSON: {"rewrites":[{"text":"...","confidence_score":85,"explanation":"...","ats_keywords_added":[]}]}'
            )

            message = await client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )

            text = message.content[0].text
            if "```" in text:
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            result = json.loads(text.strip())
            return RewriteResponse(rewrites=result["rewrites"])

        except Exception:
            # Fall through to rule-based
            pass

    # Rule-based fallback (free, no API key needed)
    rewrites = rule_based_rewrite(request.bullet_text)
    return RewriteResponse(rewrites=rewrites)