# src/model.py
import os
import sys
import pickle
from pathlib import Path
from typing import List, Tuple, Dict, Any

import numpy as np
import torch

from transformers import AlbertTokenizerFast, AlbertForSequenceClassification


# ----------------------
# CONFIG - adjust only if your folder differs
# ----------------------
DEFAULT_MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models", "phq9_albert_concat")
DEFAULT_MAX_LEN = 256

# ----------------------
# Wrapper
# ----------------------
class PHQ9ModelWrapper:
    def __init__(self, model_dir: Path = DEFAULT_MODEL_DIR, device: torch.device = None, max_len: int = DEFAULT_MAX_LEN):
        self.model_dir = Path(model_dir).resolve()
        self.max_len = int(max_len)
        self.device = device or (torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu"))

        # sanity checks
        if not self.model_dir.exists() or not self.model_dir.is_dir():
            raise FileNotFoundError(f"Model directory does not exist: {self.model_dir}")

        # show files for debugging
        files = sorted([p.name for p in self.model_dir.iterdir()])
        print(f"[model] Loading model from: {self.model_dir}")
        print(f"[model] Files found: {files}")

        # load tokenizer
        try:
            self.tokenizer = AlbertTokenizerFast.from_pretrained(str(self.model_dir), local_files_only=True)
        except Exception as e:
            raise RuntimeError(
                f"Failed to load tokenizer from '{self.model_dir}'.\n"
                f"Ensure tokenizer files (tokenizer.json or vocab/spiece.model and tokenizer_config.json) exist in that folder.\n"
                f"Original error: {e}"
            ) from e

        # load model
        try:
            self.model = AlbertForSequenceClassification.from_pretrained(str(self.model_dir), local_files_only=True)
        except Exception as e:
            raise RuntimeError(
                f"Failed to load model weights from '{self.model_dir}'.\n"
                f"Ensure model files (pytorch_model.bin or model.safetensors and config.json) exist in that folder.\n"
                f"Original error: {e}"
            ) from e

        self.model.to(self.device)
        self.model.eval()

        # load label_map (optional) - maps index -> human-readable label
        label_map_path = self.model_dir / "label_map.pkl"
        if label_map_path.exists():
            try:
                with open(label_map_path, "rb") as f:
                    self.label_map = pickle.load(f)
                print(f"[model] Loaded label_map from {label_map_path}")
            except Exception as e:
                print(f"[model] Warning: failed to load label_map.pkl: {e}. Falling back to numeric labels.")
                self.label_map = self._build_fallback_label_map()
        else:
            self.label_map = self._build_fallback_label_map()

    def _build_fallback_label_map(self) -> Dict[int, str]:
        n = getattr(self.model.config, "num_labels", None)
        if n is None:
            # guess from weights
            try:
                n = int(self.model.classifier.out_features)
            except Exception:
                n = 2
        return {i: f"label_{i}" for i in range(n)}

    def predict_raw(self, texts: List[str], top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Run inference on a list of texts (batch).
        Returns a list of dicts, one per input:
          {
            "logits": np.ndarray (num_labels,),
            "probs": np.ndarray (num_labels,),
            "pred_idx": int,
            "pred_label": str,
            "topk": [(idx, prob, label_name), ...]
          }
        """
        if isinstance(texts, str):
            texts = [texts]
        if not isinstance(texts, (list, tuple)):
            raise ValueError("texts must be a string or list/tuple of strings")

        enc = self.tokenizer(
            list(texts),
            truncation=True,
            padding=True,
            max_length=self.max_len,
            return_tensors="pt"
        )

        input_ids = enc["input_ids"].to(self.device)
        attention_mask = enc["attention_mask"].to(self.device)

        with torch.no_grad():
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
            logits_t = outputs.logits  # torch tensor [B, num_labels]
            probs_t = torch.softmax(logits_t, dim=-1)

        logits = logits_t.cpu().numpy()
        probs = probs_t.cpu().numpy()

        results = []
        for i in range(len(texts)):
            p = probs[i]
            pred_idx = int(np.argmax(p))
            pred_label = self.label_map.get(pred_idx, str(pred_idx))
            # top-k
            topk_idx = list(np.argsort(p)[-top_k:][::-1])
            topk = [(int(ii), float(p[ii]), self.label_map.get(ii, str(ii))) for ii in topk_idx]
            results.append({
                "logits": logits[i],
                "probs": p,
                "pred_idx": pred_idx,
                "pred_label": pred_label,
                "topk": topk
            })
        return results


# ----------------------
# CLI quick test when executed directly
# ----------------------
def _cli_test():
    print("=== PHQ9ModelWrapper quick test ===")
    try:
        wrapper = PHQ9ModelWrapper()
    except Exception as e:
        print("Failed to instantiate PHQ9ModelWrapper:", e)
        sys.exit(1)

    sample_answers = [
        "Not at all", "Several days", "More than half the days",
        "Nearly every day", "Not at all", "Several days",
        "Not at all", "Not at all", "Several days"
    ]
    # Create a concatenated input similar to training format (if you used a delimiter)
    sample_text = " ||| ".join(sample_answers)
    print("Sample concatenated text:", sample_text[:200])

    out = wrapper.predict_raw([sample_text], top_k=5)[0]
    print("\nPrediction result:")
    print(" pred_idx:", out["pred_idx"])
    print(" pred_label:", out["pred_label"])
    print(" topk:", out["topk"])
    print(" probs:", list(np.round(out["probs"], 4)))

if __name__ == "__main__":
    _cli_test()
