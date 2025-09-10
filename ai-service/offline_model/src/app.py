# src/app.py
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from infer import predict_from_answers
from asgiref.wsgi import WsgiToAsgi
import logging
import numpy as np

# --- Setup logging ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__, template_folder="../templates")
CORS(app, resources={r"/api/": {"origins": "*"}})

# --- PHQ-9 Questions ---
PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things? Please answer roughly: rare / a few days / most days / nearly every day (or reply in your own words).",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
    "Trouble concentrating on things, such as reading the newspaper or watching television?",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless?",
    "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way?"
]

# --- Helper: convert NumPy to Python-native types ---
def to_serializable(obj):
    """Recursively convert numpy types to Python types for JSON serialization."""
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.int32, np.int64)):
        return int(obj)
    if isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    if isinstance(obj, dict):
        return {k: to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_serializable(v) for v in obj]
    return obj


# --- Web form route ---
@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    if request.method == "POST":
        answers = [request.form.get(f"q{i}", "") for i in range(1, 10)]
        logging.info(f"[WEB FORM] Input to model: {answers}")
        try:
            result = predict_from_answers(answers, top_k=5)
            result = to_serializable(result)
            logging.info(f"[WEB FORM] Model output: {result}")
        except Exception as e:
            result = {"error": str(e)}
            logging.error(f"[WEB FORM] Error: {e}")

    return render_template("index.html", questions=PHQ9_QUESTIONS, result=result)


# --- API endpoint for Postman / React Native ---
@app.route("/api/predict", methods=["POST"])
def api_predict():
    try:
        data = request.get_json(force=True)
        answers = data.get("answers", [])

        # Log input
        logging.info(f"[API] Input to model: {answers}")

        # Model prediction
        result = predict_from_answers(answers, top_k=5)

        # Convert NumPy → JSON safe
        result_serializable = to_serializable(result)

        # Log output
        logging.info(f"[API] Model output: {result_serializable}")

        return jsonify({"success": True, "result": result_serializable})
    except Exception as e:
        logging.error(f"[API] Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 400


# --- Wrap Flask WSGI into ASGI ---
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    app.run(debug=True)
