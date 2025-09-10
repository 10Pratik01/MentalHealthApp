# src/chatbot.py
import os
import sys
import csv
import json
from datetime import datetime

# Add src/ to path for imports
sys.path.append(os.path.dirname(__file__))

# Use absolute import so you can run `python chatbot.py` from inside src/
from infer import predict_from_answers

# PHQ-9 questions (same order used for training)
PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
    "Trouble concentrating on things, such as reading the newspaper or watching television?",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless?",
    "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way?"
]

LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "logs")
LOG_FILE = os.path.join(LOG_DIR, "phq9_chatbot_sessions.csv")


def consent_prompt() -> bool:
    print("\nThis session may store sensitive responses (mental health data).")
    print("By continuing you consent to saving this session locally (logs/phq9_chatbot_sessions.csv).")
    resp = input("Do you consent to saving this session? (y/N): ").strip().lower()
    return resp == "y"


def run_chatbot(save_logs_if_consented: bool = True):
    print("\n=== PHQ-9 Chatbot ===")
    print("You will be asked 9 questions. Answer naturally in free text.")
    print("Type 'quit' at any prompt to exit.\n")

    age = input("Age (optional): ").strip()
    gender = input("Gender (optional): ").strip()

    answers = []
    for i, q in enumerate(PHQ9_QUESTIONS, start=1):
        ans = input(f"Q{i}. {q}\n> ").strip()
        if ans.lower() in ("quit", "exit"):
            print("Exiting. No data saved.")
            return
        answers.append(ans)

    # run inference (this calls infer.predict_from_answers)
    print("\nAnalysing responses... (this may take a moment)")
    try:
        out = predict_from_answers(answers, top_k=5, allow_short=False)
    except Exception as e:
        print("Error during prediction:", e)
        return

    # display results
    print("\n=== Results ===")
    print(f"Predicted depression level: {out['label']} (class index {out['label_idx']})")
    print("\nTop predictions:")
    for idx, prob, name in out["topk"]:
        print(f"  {name:20s} prob={prob:.4f}")

    if out.get("q9_suicidal_flag"):
        print("\n⚠️  IMPORTANT: Answer to Q9 contains language that may indicate suicidal thoughts.")
        print("If you are in immediate danger, call your local emergency number now.")
        print("If you're in India, AASRA helpline: 91-22-27546669 / 27546667")
        print("Consider contacting a mental health professional or a crisis hotline.\n")

    # save logs if user consents and global flag enabled
    if save_logs_if_consented:
        do_save = consent_prompt()
    else:
        do_save = False

    if do_save:
        os.makedirs(LOG_DIR, exist_ok=True)
        write_header = not os.path.exists(LOG_FILE)
        header = ["timestamp", "age", "gender"] + [f"Q{i}" for i in range(1, 10)] + ["pred_label", "pred_idx", "probs", "q9_flag"]
        row = [datetime.utcnow().isoformat(), age, gender] + answers + [out["label"], out["label_idx"], json.dumps(out["probs"]), out["q9_suicidal_flag"]]
        try:
            with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                if write_header:
                    writer.writerow(header)
                writer.writerow(row)
            print(f"Session saved to: {LOG_FILE}")
        except Exception as e:
            print("Failed to save session:", e)
    else:
        print("Session not saved (no consent).")

    print("\nChatbot session complete. Take care!")

if __name__ == "__main__":
    run_chatbot()
