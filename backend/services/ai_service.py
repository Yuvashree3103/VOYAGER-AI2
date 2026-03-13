import os
from groq import Groq

class AIService:
    def __init__(self):
        # You need to get a GROQ API key from https://console.groq.com
        self.client = Groq(api_key="your-groq-api-key-here")  # Replace with your key
        print("✅ GROQ AI Service initialized")
    
    def ask(self, question):
        try:
            response = self.client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {"role": "system", "content": "You are a Chennai travel expert. Give accurate, helpful information."},
                    {"role": "user", "content": question}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"GROQ error: {e}")
            return self.get_fallback(question)
    
    def get_fallback(self, question):
        q = question.lower()
        if 'marina' in q:
            return "🏖️ Marina Beach: World's second-longest beach. Best time: Evening 4-7 PM. Free entry."
        elif 'mahabalipuram' in q:
            return "🏛️ Mahabalipuram: UNESCO site. Entry ₹40. Timings 6 AM-6 PM."
        elif 'food' in q:
            return "🍛 Try Murugan Idli Shop (Besant Nagar) for breakfast, Anjappar for Chettinad food."
        else:
            return "I'm your Chennai travel assistant! Ask me about beaches, temples, food, or budget."

ai_service = AIService()