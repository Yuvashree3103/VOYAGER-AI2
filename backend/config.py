import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # API Keys
    OPENWEATHER_KEY = os.getenv('OPENWEATHER_KEY')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')  # Free Groq API
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    UNSPLASH_ACCESS_KEY = os.getenv('UNSPLASH_ACCESS_KEY')
    PEXELS_API_KEY = os.getenv('PEXELS_API_KEY')
    GOOGLE_MAPS_KEY = os.getenv('GOOGLE_MAPS_KEY')
    GOOGLE_TRANSLATE_KEY = os.getenv('GOOGLE_TRANSLATE_KEY')
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
