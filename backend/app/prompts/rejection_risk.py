def build_risk_prompt(resume_text: str, jd_text: str = "") -> str:
    jd_section = f"Job Description:\n{jd_text[:2000]}\n\n" if jd_text else ""
    return (
        "Analyze this resume and identify the top 3 rejection risks.\n\n"
        + jd_section +
        f"Resume:\n{resume_text[:4000]}\n\n"
        "Return JSON with key 'risks' containing array of objects with: "
        "riskTitle, specificText, whyItHurts, severity (HIGH/MEDIUM/LOW), fix."
    )
