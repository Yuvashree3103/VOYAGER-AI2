import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
print(f"API Key: {api_key[:15]}..." if api_key else "No API key")

# WORKING MODEL - llama-3.1-8b-instant
model = "llama-3.1-8b-instant"
print(f"\n📡 Testing model: {model}")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "model": model,
    "messages": [
        {
            "role": "system",
            "content": "You are a Chennai travel expert."
        },
        {
            "role": "user",
            "content": "Tell me about Marina Beach in 2 sentences"
        }
    ],
    "temperature": 0.5,
    "max_tokens": 500
}

try:
    session = requests.Session()
    session.trust_env = False
    
    response = session.post(url, headers=headers, json=data, timeout=30)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Success!")
        print(f"Response: {result['choices'][0]['message']['content']}")
    else:
        print(f"❌ Failed: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")