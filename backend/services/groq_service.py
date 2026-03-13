import os
import requests
import json
from dotenv import load_dotenv

# Force remove proxy settings
os.environ['HTTP_PROXY'] = ''
os.environ['HTTPS_PROXY'] = ''
os.environ['http_proxy'] = ''
os.environ['https_proxy'] = ''

load_dotenv()

class GroqAIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        # WORKING MODEL - Updated to llama-3.1-8b-instant
        self.model = "llama-3.1-8b-instant"
        
        if not self.api_key:
            print("❌ GROQ_API_KEY not found in .env file")
        else:
            print(f"✅ API Key found: {self.api_key[:10]}...")
            print(f"✅ Using model: {self.model}")
    
    def ask(self, question, chat_history=None, system_prompt=None):
        if not self.api_key:
            return "❌ GROQ API key not configured"
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Build messages
        prompt = system_prompt or "You are a professional Tamil Nadu travel expert. Provide accurate information about places, timings, costs in ₹, transport, safety, and local tips. Keep answers clear and use emojis."
        messages = [
            {
                "role": "system",
                "content": prompt
            }
        ]
        
        # Add chat history if exists
        if chat_history:
            for msg in chat_history[-6:]:
                if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                    messages.append(msg)
        
        # Add current question
        messages.append({"role": "user", "content": question})
        
        # Payload with working model
        data = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.5,
            "max_tokens": 1024
        }
        
        try:
            session = requests.Session()
            session.trust_env = False
            
            response = session.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                error_text = response.text
                print(f"❌ API Error {response.status_code}: {error_text}")
                return f"❌ API Error: {error_text[:200]}"
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return f"❌ Error: {str(e)}"

print("🔄 Initializing GROQ Service with llama-3.1-8b-instant...")
groq_service = GroqAIService()
