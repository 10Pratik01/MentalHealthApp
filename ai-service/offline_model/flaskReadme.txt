from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Simple chatbot responses (replace with your AI model)
def generate_response(message, chat_history):
    message_lower = message.lower()
    
    # Simple keyword-based responses
    if any(word in message_lower for word in ['suicide', 'kill myself', 'end it all', 'want to die']):
        return {
            'response': "I'm very concerned about you. Please reach out to a mental health professional immediately. You can call Tele-MANAS at 14416. You're not alone in this.",
            'riskAssessment': {
                'riskLevel': 'high',
                'phq9Score': 20,
                'gad7Score': 15
            }
        }
    
    elif any(word in message_lower for word in ['anxious', 'worried', 'panic', 'stress']):
        return {
            'response': "I understand you're feeling anxious. That's very common and there are ways to help manage these feelings. Can you tell me what specific situations make you feel this way?",
            'riskAssessment': {
                'riskLevel': 'mid',
                'phq9Score': 12,
                'gad7Score': 10
            }
        }
    
    elif any(word in message_lower for word in ['sad', 'depressed', 'down', 'lonely']):
        return {
            'response': "I hear that you're going through a difficult time. It's brave of you to share this. What has been weighing on your mind lately?",
            'riskAssessment': {
                'riskLevel': 'mid',
                'phq9Score': 10,
                'gad7Score': 8
            }
        }
    
    else:
        return {
            'response': "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you've been feeling lately?",
            'riskAssessment': {
                'riskLevel': 'low',
                'phq9Score': 5,
                'gad7Score': 4
            }
        }

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        chat_history = data.get('chatHistory', [])
        
        response_data = generate_response(message, chat_history)
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
