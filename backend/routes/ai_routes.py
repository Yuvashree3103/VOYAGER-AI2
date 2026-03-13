from flask import Blueprint, request, jsonify
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.groq_service import groq_service

ai_bp = Blueprint('ai_assistant', __name__)

# Store chat sessions in memory
chat_sessions = {}

@ai_bp.route('/ask', methods=['POST'])
def ask_assistant():
    """Real-time AI assistant using GROQ"""
    try:
        data = request.json
        question = data.get('question', '')
        session_id = data.get('session_id', 'default')
        language = (data.get('language') or 'English').strip()
        
        print(f"📝 Question: {question}")
        print(f"🆔 Session: {session_id}")
        
        # Get or create chat history for this session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []
        
        system_prompt = (
            "You are VoyagerAI, a Tamil Nadu travel expert. Answer about places, food, transport, safety, and itinerary planning. "
            f"Respond in {language}. If language is Tanglish, mix Tamil words in Latin script."
        )
        answer = groq_service.ask(question, chat_sessions[session_id], system_prompt=system_prompt)
        
        # Update history
        chat_sessions[session_id].append({"role": "user", "content": question})
        chat_sessions[session_id].append({"role": "assistant", "content": answer})
        
        # Keep only last 10 messages
        if len(chat_sessions[session_id]) > 20:
            chat_sessions[session_id] = chat_sessions[session_id][-20:]
        
        return jsonify({
            'success': True,
            'answer': answer,
            'session_id': session_id,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({
            'success': False,
            'answer': f"❌ Server error: {str(e)}",
            'error': str(e)
        }), 500

@ai_bp.route('/clear', methods=['POST'])
def clear_session():
    """Clear chat history for a session"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id in chat_sessions:
            chat_sessions[session_id] = []
        
        return jsonify({
            'success': True, 
            'message': 'Chat history cleared',
            'session_id': session_id
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint for AI assistant"""
    return ask_assistant()

@ai_bp.route('/status', methods=['GET'])
def status():
    """Check if GROQ is configured"""
    if groq_service.api_key:
        return jsonify({
            'status': 'ok',
            'message': 'GROQ AI is configured and ready'
        })
    else:
        return jsonify({
            'status': 'error',
            'message': 'GROQ AI is not configured. Please check your .env file.'
        }), 503
