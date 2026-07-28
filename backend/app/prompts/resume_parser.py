SYSTEM_PROMPT = (
    "You are an expert resume parser. Extract structured information from the resume text "
    "and return it as valid JSON. Be thorough and accurate."
)

def build_parse_prompt(resume_text: str) -> str:
    return (
        "Parse this resume and extract all sections. Return ONLY valid JSON.\n\n"
        f"Resume:\n{resume_text[:6000]}"
    )
