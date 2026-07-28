import re
from typing import List, Dict, Any


PASSIVE_PHRASES = [
    "worked on", "helped with", "assisted with", "was responsible for",
    "participated in", "involved in", "contributed to", "supported the",
    "took part in", "was part of",
]

POWER_VERBS = [
    "led", "built", "designed", "developed", "architected", "launched",
    "scaled", "delivered", "drove", "owned", "created", "implemented",
    "optimized", "reduced", "increased", "generated", "managed", "founded",
]

QUANTIFICATION_PATTERNS = [
    r'\d+%', r'\$\d+', r'\d+x', r'\d+ (users|customers|clients|engineers)',
    r'(increased|decreased|reduced|improved).{0,30}\d+',
    r'\d+ (million|thousand|hundred)', r'(top|first|#1)',
]


def score_resume(raw_text: str, jd_text: str = "") -> Dict[str, Any]:
    if not raw_text:
        return _empty_scores()

    text_lower = raw_text.lower()
    bullets = _extract_bullets(raw_text)

    ats_format = _score_ats_format(raw_text)
    ats_keyword = _score_ats_keywords(raw_text, jd_text) if jd_text else 65
    content_quality = _score_content(bullets)
    confidence = _score_confidence(bullets)
    impact = _score_impact(bullets)
    readability = _score_readability(raw_text)

    weights = {"ats_keyword": 0.20, "ats_format": 0.15, "content": 0.20, "confidence": 0.20, "impact": 0.15, "readability": 0.10}
    overall = (
        ats_keyword * weights["ats_keyword"] +
        ats_format * weights["ats_format"] +
        content_quality * weights["content"] +
        confidence * weights["confidence"] +
        impact * weights["impact"] +
        readability * weights["readability"]
    )

    return {
        "overall_score": round(overall),
        "ats_keyword_score": ats_keyword,
        "ats_format_score": ats_format,
        "content_quality_score": content_quality,
        "confidence_score": confidence,
        "impact_score": impact,
        "readability_score": readability,
        "rejection_risks": _detect_rejection_risks(bullets, raw_text),
        "bullet_analyses": _analyze_bullets(bullets),
        "missing_keywords": _find_missing_keywords(raw_text, jd_text),
    }


def _extract_bullets(text: str) -> List[str]:
    lines = text.split("\n")
    bullets = []
    for line in lines:
        stripped = line.strip()
        if len(stripped) > 30 and (stripped.startswith(("•", "-", "*")) or _looks_like_bullet(stripped)):
            bullets.append(stripped.lstrip("•-* "))
    return bullets[:30]


def _looks_like_bullet(line: str) -> bool:
    first_word = line.split()[0].lower() if line.split() else ""
    return first_word in POWER_VERBS or first_word in [p.split()[0] for p in PASSIVE_PHRASES]


def _score_ats_format(text: str) -> int:
    score = 60
    if "@" in text: score += 8
    if "linkedin" in text.lower(): score += 5
    if "github" in text.lower(): score += 5
    if len(text.split()) > 200: score += 7
    if "experience" in text.lower(): score += 5
    if "education" in text.lower(): score += 5
    if "skills" in text.lower(): score += 5
    return min(score, 100)


def _score_ats_keywords(text: str, jd_text: str) -> int:
    if not jd_text:
        return 65
    jd_words = set(re.findall(r'\b[a-z]{4,}\b', jd_text.lower()))
    resume_words = set(re.findall(r'\b[a-z]{4,}\b', text.lower()))
    matched = jd_words & resume_words
    score = min(int((len(matched) / max(len(jd_words), 1)) * 100), 100)
    return max(score, 40)


def _score_content(bullets: List[str]) -> int:
    if not bullets:
        return 45
    total = 0
    for b in bullets:
        s = 40
        if any(re.search(p, b, re.I) for p in QUANTIFICATION_PATTERNS):
            s += 30
        if any(b.lower().startswith(v) for v in POWER_VERBS):
            s += 20
        if len(b.split()) >= 8:
            s += 10
        total += min(s, 100)
    return round(total / len(bullets))


def _score_confidence(bullets: List[str]) -> int:
    if not bullets:
        return 40
    passive_count = sum(1 for b in bullets if any(pp in b.lower() for pp in PASSIVE_PHRASES))
    ratio = passive_count / len(bullets)
    return max(int(100 - ratio * 80), 20)


def _score_impact(bullets: List[str]) -> int:
    if not bullets:
        return 40
    quantified = sum(1 for b in bullets if any(re.search(p, b, re.I) for p in QUANTIFICATION_PATTERNS))
    ratio = quantified / len(bullets)
    return max(int(40 + ratio * 60), 30)


def _score_readability(text: str) -> int:
    words = text.split()
    if not words:
        return 50
    sentences = text.count(".") + text.count("!") + text.count("?")
    if sentences == 0:
        return 60
    avg_sentence = len(words) / sentences
    score = 100 - max(0, (avg_sentence - 15) * 3)
    return max(min(int(score), 100), 40)


def _detect_rejection_risks(bullets: List[str], text: str) -> List[Dict]:
    risks = []
    passive_bullets = [b for b in bullets if any(pp in b.lower() for pp in PASSIVE_PHRASES)]
    if len(passive_bullets) >= 3:
        risks.append({
            "riskTitle": "Passive language throughout",
            "specificText": passive_bullets[0][:80],
            "whyItHurts": "Passive phrasing signals lack of ownership to senior reviewers",
            "severity": "HIGH",
            "fix": "Replace passive phrases with power verbs: 'Led', 'Built', 'Owned'",
        })

    quantified = sum(1 for b in bullets if any(re.search(p, b, re.I) for p in QUANTIFICATION_PATTERNS))
    if bullets and quantified / len(bullets) < 0.3:
        risks.append({
            "riskTitle": "Missing quantification",
            "specificText": "Most bullets lack numbers or metrics",
            "whyItHurts": "Vague impact claims are ignored — recruiters want numbers",
            "severity": "HIGH",
            "fix": "Add metrics: percentages, user counts, time saved, revenue impacted",
        })

    if "linkedin" not in text.lower():
        risks.append({
            "riskTitle": "No LinkedIn URL",
            "specificText": "Contact section",
            "whyItHurts": "Recruiters verify candidates on LinkedIn — missing it raises doubt",
            "severity": "MEDIUM",
            "fix": "Add your LinkedIn profile URL to the contact section",
        })

    return risks


def _analyze_bullets(bullets: List[str]) -> List[Dict]:
    result = []
    for i, b in enumerate(bullets[:10]):
        passive = [pp for pp in PASSIVE_PHRASES if pp in b.lower()]
        has_quant = any(re.search(p, b, re.I) for p in QUANTIFICATION_PATTERNS)
        starts_power = any(b.lower().startswith(v) for v in POWER_VERBS)
        confidence_score = max(20, min(95, (90 if starts_power else 30) + (30 if has_quant else 0) - len(passive) * 15))
        impact = "HIGH" if has_quant and starts_power else ("MEDIUM" if has_quant or starts_power else "LOW")
        result.append({
            "bulletId": f"b{i+1}", "original": b[:120],
            "confidenceScore": confidence_score, "impactLevel": impact,
            "hasQuantification": has_quant, "passivePhrases": passive,
        })
    return result


def _find_missing_keywords(text: str, jd_text: str) -> List[Dict]:
    if not jd_text:
        return []
    jd_words = set(re.findall(r'\b[a-z]{5,}\b', jd_text.lower()))
    resume_words = set(re.findall(r'\b[a-z]{5,}\b', text.lower()))
    missing = list(jd_words - resume_words)[:10]
    return [{"keyword": k, "importance": "nice_to_have", "whereToAdd": "Skills section"} for k in missing]


def _empty_scores() -> Dict[str, Any]:
    return {
        "overall_score": 0, "ats_keyword_score": 0, "ats_format_score": 0,
        "content_quality_score": 0, "confidence_score": 0, "impact_score": 0,
        "readability_score": 0, "rejection_risks": [], "bullet_analyses": [],
        "missing_keywords": [],
    }
