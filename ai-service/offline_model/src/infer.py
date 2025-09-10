# src/infer.py
import re
import json
from datetime import datetime
from typing import List, Dict, Any

from model import PHQ9ModelWrapper

# === Config / constants ===
DELIMITER = " ||| "       # must match training notebook / train script
TOP_K_DEFAULT = 5

# simple suicidal keyword detector for Q9 (basic safety net)
_SUICIDAL_RE = re.compile(
    r"\b(kill myself|suicid(e|al)|end my life|want to die|hurt myself|cut myself|hang myself|better off dead)\b",
    flags=re.IGNORECASE
)

# instantiate model wrapper once (module-level)
_model_wrapper = None


def _get_wrapper() -> PHQ9ModelWrapper:
    global _model_wrapper
    if _model_wrapper is None:
        _model_wrapper = PHQ9ModelWrapper()  # uses the DEFAULT_MODEL_DIR in model.py
    return _model_wrapper


def q9_suicidal_flag(q9_text: str) -> bool:
    """Return True if q9_text contains obvious suicidal keywords (case-insensitive)."""
    if not q9_text:
        return False
    return bool(_SUICIDAL_RE.search(q9_text))


def predict_from_answers(answers: List[str], top_k: int = TOP_K_DEFAULT, allow_short: bool = False) -> Dict[str, Any]:
    """
    Predict using a list of 9 free-text answers (Q1..Q9 order).
    Returns a dict:
      {
        "concat_text": str,
        "label_idx": int,
        "label": str,
        "probs": [float,...],
        "topk": [(idx, prob, label_name), ...],
        "q9_suicidal_flag": bool,
        "raw_model_output": {...}   # optional raw outputs from wrapper
      }
    Parameters:
      - answers: list of 9 strings (if fewer and allow_short=True, missing entries will be filled with "")
      - top_k: number of top predictions to return
      - allow_short: if True, will pad answers to length 9 with empty strings; otherwise will raise on length != 9
    """
    if not isinstance(answers, (list, tuple)):
        raise ValueError("answers must be a list/tuple of 9 strings (Q1..Q9).")

    if len(answers) != 9:
        if allow_short and len(answers) < 9:
            # pad with empty strings
            answers = list(answers) + [""] * (9 - len(answers))
        else:
            raise ValueError(f"answers must have length 9. Got length {len(answers)}.")

    # ensure strings
    answers = ["" if a is None else str(a).strip() for a in answers]

    concat_text = DELIMITER.join(answers)

    wrapper = _get_wrapper()
    raw_out = wrapper.predict_raw([concat_text], top_k=top_k)[0]

    label_idx = int(raw_out["pred_idx"])
    label = raw_out["pred_label"]
    probs = raw_out["probs"].tolist() if hasattr(raw_out["probs"], "tolist") else list(raw_out["probs"])
    topk = raw_out["topk"]

    q9_flag = q9_suicidal_flag(answers[8])  # Q9 is answers[8]

    result = {
        "concat_text": concat_text,
        "label_idx": label_idx,
        "label": label,
        "probs": probs,
        "topk": topk,
        "q9_suicidal_flag": q9_flag,
        "raw_model_output": raw_out
    }
    return result


def predict_text(text: str, top_k: int = TOP_K_DEFAULT) -> Dict[str, Any]:
    """
    Predict for a single text input (not the 9-answer concatenation).
    Useful for backwards compatibility.
    Returns the same structure as predict_from_answers but without q9 flag.
    """
    if text is None:
        raise ValueError("text must be a non-empty string")

    wrapper = _get_wrapper()
    raw_out = wrapper.predict_raw([text], top_k=top_k)[0]
    label_idx = int(raw_out["pred_idx"])
    label = raw_out["pred_label"]
    probs = raw_out["probs"].tolist() if hasattr(raw_out["probs"], "tolist") else list(raw_out["probs"])
    topk = raw_out["topk"]

    return {
        "text": text,
        "label_idx": label_idx,
        "label": label,
        "probs": probs,
        "topk": topk,
        "raw_model_output": raw_out
    }


# -------------------------
# CLI / quick interactive testing
# -------------------------
def _interactive_cli():
    print("PHQ-9 infer CLI — enter 9 answers (free text) for Q1..Q9.")
    print("Type 'quit' at any question to exit.\n")
    age = input("Age (optional): ").strip()
    gender = input("Gender (optional): ").strip()

    answers = []
    for i in range(1, 10):
        a = input(f"Q{i}: ").strip()
        if a.lower() in ("quit", "exit"):
            print("Exiting.")
            return
        answers.append(a)

    out = predict_from_answers(answers, top_k=TOP_K_DEFAULT, allow_short=False)

    print("\n--- Prediction ---")
    print("Predicted label idx:", out["label_idx"])
    print("Predicted label:", out["label"])
    print("Top-k:")
    for idx, prob, name in out["topk"]:
        print(f"  idx={idx}  prob={prob:.4f}  label={name}")
    print("Q9 suicidal keyword flag:", out["q9_suicidal_flag"])
    print("\nConcatenated text (truncated):", out["concat_text"][:300])

    # optional: save quick session to logs
    save = input("\nSave this session to logs/phq9_results_concatenated.csv? (y/N): ").strip().lower()
    if save == "y":
        import csv, os
        os.makedirs("logs", exist_ok=True)
        fname = "logs/phq9_results_concatenated.csv"
        header = ["timestamp", "age", "gender"] + [f"Q{i}" for i in range(1,10)] + ["pred_label", "pred_idx", "probs", "q9_flag"]
        write_header = not os.path.exists(fname)
        with open(fname, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if write_header:
                writer.writerow(header)
            row = [datetime.utcnow().isoformat(), age, gender] + answers + [out["label"], out["label_idx"], json.dumps(out["probs"]), out["q9_suicidal_flag"]]
            writer.writerow(row)
        print(f"Saved to {fname}")

if __name__ == "__main__":
    _interactive_cli()
