def build_rewrite_prompt(bullet: str, role: str, mode: str) -> str:
    tone = "direct and critical" if mode == "brutal" else "constructive and encouraging"
    return (
        f"Rewrite this resume bullet to be stronger and ATS-friendly.\n"
        f"Role: {role}\nTone: {tone}\n\n"
        f"Original: {bullet}\n\n"
        "Return JSON with key 'rewrites' containing an array of objects, each with: "
        "text, confidence_score (0-100), explanation, ats_keywords_added (array)."
    )
