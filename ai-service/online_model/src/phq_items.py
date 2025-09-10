# src/phq_items.py
"""
List of PHQ-9 items (plain text). Import this from the Flask app.
Index 0..8 correspond to the 9 PHQ items; index 8 is Q9 (self-harm).
"""
PHQ_ITEMS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed; or the opposite — being fidgety or restless",
    "Thoughts that you would be better off dead or of hurting yourself in some way"  # Q9 - special
]

# Friendly conversational hints you can append when asking the user.
ANSWER_HINTS = "Please answer roughly: rare / a few days / most days / nearly every day (or reply in your own words)."

# Mapping human-friendly words to canonical 0..3 (used only if needed client-side)
HINT_TO_SCORE = {
    "rare": 0,
    "not at all": 0,
    "a few days": 1,
    "few": 1,
    "several days": 1,
    "most days": 2,
    "more than half the days": 2,
    "nearly every day": 3,
    "almost every day": 3,
    "every day": 3
}
