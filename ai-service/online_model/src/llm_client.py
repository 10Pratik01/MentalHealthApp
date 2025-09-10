# src/llm_client.py
import os
import json
import re
from typing import Dict
from google import genai

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in environment/.env")

client = genai.Client(api_key=API_KEY)
MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-pro")

def generate_conversational_question(question_text: str) -> str:
    prompt = (
        "You are a compassionate conversational assistant. "
        "Rewrite the PHQ-style item below into a short, informal one-or-two sentence question "
        "that encourages a natural reply. Add short answer hints in parentheses such as "
        "'(rare / a few days / most days / nearly every day)'. Keep it empathetic and <= 2 sentences.\n\n"
        f"PHQ item: {question_text}"
    )
    resp = client.models.generate_content(
        model=MODEL,
        contents=[{"role": "user", "parts": [prompt]}],
        config={"temperature": 0.7, "max_output_tokens": 120}
    )
    return resp.text.strip()

def map_reply_to_score(question_text: str, user_reply: str) -> Dict:
    system_prompt = (
        "You are a calm, precise assistant. You MUST return valid JSON only (no extra commentary). "
        "The JSON must have keys: 'answer' (int 0..3), 'risk' ('none' or 'suicidal'), 'explain' (short text). "
        "Map the user's reply about frequency to the integer where: "
        "0=not at all, 1=several days, 2=more than half the days, 3=nearly every day. "
        "If the reply indicates suicidal ideation, self-harm intent, or plans, set 'risk' to 'suicidal'.\n\n"
        f"Question: {question_text}\nReply: {user_reply}"
    )

    resp = client.models.generate_content(
        model=MODEL,
        contents=[{"role": "user", "parts": [system_prompt]}],
        config={"temperature": 0.0, "max_output_tokens": 160}
    )
    raw = resp.text.strip()
    parsed = {"answer": 0, "risk": "none", "explain": "", "raw": raw}
    try:
        data = json.loads(raw)
        parsed.update({
            "answer": int(data.get("answer", 0)),
            "risk": data.get("risk", "none"),
            "explain": data.get("explain", "")
        })
        parsed["answer"] = max(0, min(3, parsed["answer"]))
    except Exception:
        m = re.search(r"\b([0-3])\b", raw)
        parsed["answer"] = int(m.group(1)) if m else 0
        low = raw.lower()
        if any(k in low for k in ["suicid", "kill myself", "hurt myself", "self harm", "want to die"]):
            parsed["risk"] = "suicidal"
        parsed["explain"] = raw.replace("\n", " ")[:300]
    return parsed

def generate_soothing_and_question(question_text: str, user_reply: str) -> Dict:
    """
    Improved empathy + next question generator.

    Returns:
      { "soothing": "<empathic reply referencing user>", "next_question": "<phq question with hints>", "raw": "<llm raw>" }
    """
    # Few-shot examples to teach reflection + brevity
    prompt = f"""
You are an empathic, concise counselor-style assistant.
Given the user's last message, produce JSON ONLY with keys 'soothing' and 'next_question'.
Rules:
 - 'soothing': 1-2 short sentences (15-30 words max) that acknowledge and reflect the user's feelings using some of their words.
   Use phrases like 'That sounds...', 'I can hear...', 'It makes sense you feel...' Avoid 'I hear you' alone.
 - 'next_question': a gentle, casual PHQ-style follow-up question (<=2 sentences) that asks the next PHQ item and includes answer hints like '(rare / a few days / most days / nearly every day)'.
 - Be specific but brief; avoid giving medical advice or instructions here.
 - Do NOT include anything else besides the JSON object.

Examples:
User: 'I'm exhausted and I can't focus on anything lately.'
JSON: {{"soothing":"That sounds really exhausting — it's understandable you're finding it hard to focus right now.", "next_question":"Lately, how often have you had trouble concentrating (rare / a few days / most days / nearly every day)?"}}

User: 'I feel hopeless — nothing seems to help.'
JSON: {{"soothing":"I’m so sorry — feeling hopeless can be overwhelming. You’re not alone in this.", "next_question":"Over the last two weeks, how often have you felt down, depressed, or hopeless (rare / a few days / most days / nearly every day)?"}}

Now produce a JSON for the following input.
User: "{user_reply}"
Next PHQ item (to phrase casually): "{question_text}"
Return JSON only.
"""

    resp = client.models.generate_content(
        model=MODEL,
        contents=[{"role": "user", "parts": [prompt]}],
        config={"temperature": 0.6, "max_output_tokens": 220}
    )
    out = resp.text.strip()

    # extract JSON robustly
    json_start = out.find("{")
    json_text = out[json_start:] if json_start != -1 else out
    try:
        data = json.loads(json_text)
        soothing = data.get("soothing", "").strip()
        next_q = data.get("next_question", "").strip()
        return {"soothing": soothing, "next_question": next_q, "raw": out}
    except Exception:
        # fallback: build a reflective soothing reply using the user's words
        # pick a short part of the user's text to mirror (first 6–12 words)
        mirror = " ".join(user_reply.split()[:12])
        soothing = f"It sounds like {mirror}... — that must be really hard. Thanks for sharing."
        # Use the existing helper to create a proper next question
        try:
            next_q = generate_conversational_question(question_text)
        except Exception:
            next_q = f"{question_text} (Please answer: rare / a few days / most days / nearly every day)"
        return {"soothing": soothing, "next_question": next_q, "raw": out}
