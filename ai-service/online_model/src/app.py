# src/app.py
try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=".env")
except Exception:
    pass

import os
import json
from flask import Flask, request, jsonify, session, render_template
from typing import Dict
from phq_items import PHQ_ITEMS, ANSWER_HINTS
from scoring import score_to_level, level_label
from llm_client import generate_conversational_question, map_reply_to_score, generate_soothing_and_question

app = Flask(__name__, static_folder="../static", template_folder="../templates")
app.secret_key = os.environ.get("FLASK_SECRET", "dev-secret-change-me")
SESSION_KEY = "phq_state"

def init_session():
    session[SESSION_KEY] = {"index": 0, "answers": []}

def get_state() -> Dict:
    return session.get(SESSION_KEY)

def clear_state():
    session.pop(SESSION_KEY, None)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/start", methods=["POST"])
def start():
    # start session but return initial BOT greeting rather than first PHQ question
    init_session()
    greeting = "Hi — I'm here to listen. How are you feeling today?"
    return jsonify({"bot_greeting": greeting}), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/answer", methods=["POST"])
def answer():
    data = request.get_json(silent=True) or {}
    user_reply = (data.get("reply") or "").strip()
    if not user_reply:
        return jsonify({"error": "missing 'reply' in JSON body"}), 400

    state = get_state()
    if state is None:
        return jsonify({"error": "session not initialized. Call /start first."}), 400

    idx = state["index"]
    if idx >= len(PHQ_ITEMS):
        clear_state()
        return jsonify({"error": "assessment already completed. Call /start to begin again."}), 400

    question_text = PHQ_ITEMS[idx]

    # Map reply to score
    try:
        mapped = map_reply_to_score(question_text, user_reply)
    except Exception as e:
        app.logger.error("map_reply_to_score failed: %s", e)
        mapped = {"answer": 0, "risk": "none", "explain": "LLM mapping failed", "raw": ""}

    answer_val = int(mapped.get("answer", 0))
    risk_flag = (mapped.get("risk", "none") == "suicidal")

    # Save answer and advance
    state["answers"].append(answer_val)
    state["index"] = idx + 1
    session[SESSION_KEY] = state

    # If Q9 flagged for suicidality, escalate immediately
    if idx == 8 and risk_flag:
        total = sum(state["answers"])
        clear_state()
        escalate_message = (
            "I’m really sorry — your reply indicates possible self-harm or suicidal thoughts. "
            "If you are in immediate danger, please call your local emergency number right now. "
            "Would you like me to provide crisis helpline numbers or connect you to someone?"
        )
        return jsonify({"status": "escalate", "message": escalate_message, "level": 5, "score": total}), 200

    # If finished after saving this answer, return final summary with a gentle closing message
    if state["index"] >= len(PHQ_ITEMS):
        total = sum(state["answers"])
        level = score_to_level(total)
        label = level_label(level)
        summary = {
            "score": total,
            "level": level,
            "label": label,
            "details": {"answers": state["answers"]}
        }
        clear_state()
        closing = "Thanks for sharing — that was helpful. Based on this quick screening, I've summarized your responses above. Would you like resources or next steps?"
        return jsonify({"status": "finished", "summary": summary, "bot_message": closing, "mapped": mapped}), 200

    # Otherwise, generate soothing reply + next question in one LLM call
    next_q_text = PHQ_ITEMS[state["index"]]  # next question to ask
    try:
        so_and_next = generate_soothing_and_question(next_q_text, user_reply)
        soothing = so_and_next.get("soothing") or "I hear you — thank you for telling me that."
        next_question = so_and_next.get("next_question") or (f"{next_q_text} ({ANSWER_HINTS})")
    except Exception as e:
        app.logger.error("generate_soothing_and_question failed: %s", e)
        soothing = "I hear you — thanks for sharing."
        next_question = f"{next_q_text} ({ANSWER_HINTS})"

    return jsonify({
        "status": "continue",
        "soothing": soothing,
        "question": next_question,
        "index": state["index"],
        "mapped": mapped
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=os.environ.get("FLASK_ENV") == "development")
