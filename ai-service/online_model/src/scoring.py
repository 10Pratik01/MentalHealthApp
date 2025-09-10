# src/scoring.py
"""
Scoring helpers: sum mapping and severity level conversion.
"""

def score_to_level(total_score: int) -> int:
    """
    Map PHQ-9 total (0-27) to 1..5 severity level.
    1: Minimal (0-4)
    2: Mild (5-9)
    3: Moderate (10-14)
    4: Moderately severe (15-19)
    5: Severe (20-27)
    """
    if total_score <= 4:
        return 1
    if total_score <= 9:
        return 2
    if total_score <= 14:
        return 3
    if total_score <= 19:
        return 4
    return 5

def level_label(level: int) -> str:
    labels = {
        1: "Minimal",
        2: "Mild",
        3: "Moderate",
        4: "Moderately severe",
        5: "Severe / High risk"
    }
    return labels.get(level, "Unknown")
