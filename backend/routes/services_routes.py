from flask import Blueprint, request, jsonify
import requests
from config import Config
from datetime import datetime
import time

services_bp = Blueprint('services', __name__)
_cache = {}
_cache_ttl_s = 600

def _cache_get(key):
    entry = _cache.get(key)
    if not entry:
        return None
    ts, value = entry
    if time.time() - ts > _cache_ttl_s:
        _cache.pop(key, None)
        return None
    return value

def _cache_set(key, value):
    _cache[key] = (time.time(), value)

def _detect_language(text):
    if not text:
        return 'en'
    if any('\u0B80' <= ch <= '\u0BFF' for ch in text):
        return 'ta'
    if any('\u0900' <= ch <= '\u097F' for ch in text):
        return 'hi'
    lower = text.lower()
    tamil_signals = ['vanakkam', 'enna', 'epdi', 'ennaiku', 'inga', 'nan', 'iruku', 'pona', 'venum']
    if any(sig in lower for sig in tamil_signals):
        return 'tanglish'
    return 'en'

_tamil_to_tanglish = {
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo', 'எ': 'e', 'ஏ': 'ea', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oo', 'ஔ': 'au',
    'க': 'ka', 'ங': 'nga', 'ச': 'cha', 'ஞ': 'nja', 'ட': 'ta', 'ண': 'na', 'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma',
    'ய': 'ya', 'ர': 'ra', 'ல': 'la', 'வ': 'va', 'ழ': 'zha', 'ள': 'la', 'ற': 'ra', 'ன': 'na',
    'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo', 'ெ': 'e', 'ே': 'ea', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oo', 'ௌ': 'au', '்': ''
}

def tamil_to_tanglish(text):
    out = []
    for ch in text:
        out.append(_tamil_to_tanglish.get(ch, ch))
    return ''.join(out)

def _ai_translate(text, source, target):
    if Config.OPENAI_API_KEY:
        headers = {
            'Authorization': f"Bearer {Config.OPENAI_API_KEY}",
            'Content-Type': 'application/json'
        }
        payload = {
            'model': 'gpt-4o-mini',
            'messages': [
                {'role': 'system', 'content': 'You are a translation engine. Reply with only the translated text.'},
                {'role': 'user', 'content': f"Translate from {source} to {target}: {text}"}
            ],
            'temperature': 0.2,
            'max_tokens': 512
        }
        response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            data = response.json()
            return data['choices'][0]['message']['content'].strip()
    if Config.GROQ_API_KEY:
        headers = {
            'Authorization': f"Bearer {Config.GROQ_API_KEY}",
            'Content-Type': 'application/json'
        }
        payload = {
            'model': 'llama-3.1-8b-instant',
            'messages': [
                {'role': 'system', 'content': 'You are a translation engine. Reply with only the translated text.'},
                {'role': 'user', 'content': f"Translate from {source} to {target}: {text}"}
            ],
            'temperature': 0.2,
            'max_tokens': 512
        }
        response = requests.post('https://api.groq.com/openai/v1/chat/completions', headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            data = response.json()
            return data['choices'][0]['message']['content'].strip()
    return None

def _google_translate(text, source, target):
    if not Config.GOOGLE_TRANSLATE_KEY:
        return None
    params = {
        'q': text,
        'target': target,
        'key': Config.GOOGLE_TRANSLATE_KEY
    }
    if source and source != 'auto':
        params['source'] = source
    response = requests.post('https://translation.googleapis.com/language/translate/v2', params=params, timeout=15)
    if response.status_code == 200:
        data = response.json()
        translations = data.get('data', {}).get('translations', [])
        if translations:
            return translations[0].get('translatedText')
    return None

@services_bp.route('/weather', methods=['GET'])
def get_weather():
    """Get real-time weather from OpenWeatherMap"""
    try:
        api_key = Config.OPENWEATHER_KEY
        
        if not api_key:
            return jsonify({
                'success': False,
                'error': 'OpenWeather API key not configured'
            }), 500
        
        # Call OpenWeatherMap API
        url = f"http://api.openweathermap.org/data/2.5/weather?q=Chennai,IN&appid={api_key}&units=metric"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            weather = {
                'temp': round(data['main']['temp'], 1),
                'feels_like': round(data['main']['feels_like'], 1),
                'humidity': data['main']['humidity'],
                'description': data['weather'][0]['description'].capitalize(),
                'icon': data['weather'][0]['icon'],
                'wind_speed': data['wind']['speed'],
                'city': 'Chennai',
                'country': 'IN'
            }
            
            # Add weather-based suggestions
            suggestions = []
            if 'rain' in weather['description'].lower():
                suggestions = [
                    "🌧️ Visit indoor attractions like Express Avenue Mall",
                    "☕ Enjoy filter coffee at local cafes",
                    "🏛️ Explore museums and heritage sites"
                ]
            elif weather['temp'] > 35:
                suggestions = [
                    "🏖️ Visit beaches in the evening",
                    "🛍️ Explore air-conditioned malls",
                    "💧 Stay hydrated - carry water"
                ]
            else:
                suggestions = [
                    "🌤️ Pleasant weather for sightseeing",
                    "🏛️ Good day to visit temples",
                    "🍛 Try local South Indian food"
                ]
            
            return jsonify({
                'success': True,
                'weather': weather,
                'suggestions': suggestions,
                'timestamp': datetime.now().isoformat()
            })
        else:
            # Fallback to simulated data
            return jsonify({
                'success': True,
                'weather': {
                    'temp': 32,
                    'feels_like': 35,
                    'humidity': 70,
                    'description': 'Haze',
                    'icon': '50d',
                    'city': 'Chennai',
                    'country': 'IN'
                },
                'suggestions': [
                    "Typical Chennai weather - stay hydrated",
                    "Plan indoor activities during afternoon"
                ],
                'source': 'fallback'
            })
            
    except Exception as e:
        print(f"Weather API error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@services_bp.route('/food-suggestions', methods=['GET'])
def get_food_suggestions():
    """Get food suggestions"""
    try:
        food_type = request.args.get('type', 'All')
        budget = request.args.get('budget', 'All')
        
        # Chennai restaurant database
        restaurants = [
            # Vegetarian
            {'name': 'Murugan Idli Shop', 'type': 'Vegetarian', 'cuisine': 'South Indian', 
             'price': 'Budget', 'rating': 4.5, 'address': 'Besant Nagar'},
            {'name': 'Ratna Cafe', 'type': 'Vegetarian', 'cuisine': 'South Indian', 
             'price': 'Budget', 'rating': 4.4, 'address': 'Triplicane'},
            {'name': 'Hotel Saravana Bhavan', 'type': 'Vegetarian', 'cuisine': 'South Indian', 
             'price': 'Medium', 'rating': 4.5, 'address': 'Pondy Bazaar'},
            
            # Non-Vegetarian
            {'name': 'BBQ Nation', 'type': 'Non-Vegetarian', 'cuisine': 'Barbecue', 
             'price': 'Premium', 'rating': 4.3, 'address': 'Nungambakkam'},
            {'name': 'Anjappar Chettinad', 'type': 'Non-Vegetarian', 'cuisine': 'Chettinad', 
             'price': 'Medium', 'rating': 4.3, 'address': 'T Nagar'},
            {'name': 'Buhari Hotel', 'type': 'Non-Vegetarian', 'cuisine': 'Mughlai', 
             'price': 'Medium', 'rating': 4.2, 'address': 'Anna Salai'},
        ]
        
        # Filter based on preferences
        filtered = restaurants
        if food_type != 'All':
            filtered = [r for r in filtered if r['type'] == food_type]
        
        if budget != 'All':
            filtered = [r for r in filtered if r['price'] == budget]
        
        return jsonify({
            'success': True,
            'restaurants': filtered,
            'total': len(filtered)
        })
        
    except Exception as e:
        print(f"Food suggestions error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@services_bp.route('/emergency-contacts', methods=['GET'])
def get_emergency_contacts():
    """Get emergency contacts"""
    return jsonify({
        'success': True,
        'contacts': {
            'police': [
                {'name': 'Chennai City Police', 'phone': '100', 'emergency': True},
                {'name': 'Mylapore Police Station', 'phone': '044-24941234', 'emergency': False},
            ],
            'ambulance': [
                {'name': '108 Emergency Services', 'phone': '108', 'emergency': True},
                {'name': 'Apollo Hospital Emergency', 'phone': '044-28293333', 'emergency': True},
            ],
            'hospital': [
                {'name': 'Apollo Hospital', 'phone': '044-28293333', 'address': 'Greams Road'},
                {'name': 'MIOT International', 'phone': '044-42002288', 'address': 'Manapakkam'},
            ],
            'fire': [
                {'name': 'Fire Services', 'phone': '101', 'emergency': True},
            ],
            'women': [
                {'name': 'Women Helpline', 'phone': '1091', 'emergency': True},
            ]
        }
    })

@services_bp.route('/translate', methods=['POST'])
def translate_text():
    data = request.json or {}
    text = (data.get('text') or '').strip()
    source = (data.get('from') or 'auto').lower()
    target = (data.get('to') or 'ta').lower()
    auto_detect = data.get('autoDetect', True)

    if not text:
        return jsonify({'success': False, 'error': 'Text is required'}), 400

    if source == 'auto' or auto_detect:
        source = _detect_language(text)

    cache_key = f"translate:{source}:{target}:{text}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return jsonify({'success': True, 'translatedText': cached, 'source': 'cache'})

    if target == 'tanglish':
        translated = tamil_to_tanglish(text) if source in ['ta', 'tamil'] else text
        _cache_set(cache_key, translated)
        return jsonify({'success': True, 'translatedText': translated, 'source': 'tanglish'})

    if source == 'tanglish' and target == 'ta':
        translated = text
        _cache_set(cache_key, translated)
        return jsonify({'success': True, 'translatedText': translated, 'source': 'tanglish'})

    phrase_map = {
        ('en', 'ta'): {
            'where is the temple?': 'கோவில் எங்கே இருக்கிறது?',
            'call an ambulance': 'ஆம்புலன்ஸை அழைக்கவும்',
            'where is the bus stop?': 'பஸ் நிறுத்தம் எங்கே இருக்கிறது?',
            'i need help': 'எனக்கு உதவி வேண்டும்',
            'how much does this cost?': 'இதற்கு எவ்வளவு செலவு?',
            'i am vegetarian': 'நான் சைவம்',
        },
        ('en', 'hi'): {
            'where is the temple?': 'मंदिर कहाँ है?',
            'call an ambulance': 'एम्बुलेंस बुलाइए',
            'where is the bus stop?': 'बस स्टॉप कहाँ है?',
            'i need help': 'मुझे मदद चाहिए',
            'how much does this cost?': 'इसकी कीमत कितनी है?',
            'i am vegetarian': 'मैं शाकाहारी हूँ',
        },
        ('en', 'te'): {
            'where is the temple?': 'దేవాలయం ఎక్కడ ఉంది?',
            'call an ambulance': 'అంబులెన్స్‌ను పిలవండి',
            'where is the bus stop?': 'బస్ స్టాప్ ఎక్కడ ఉంది?',
            'i need help': 'నాకు సహాయం కావాలి',
            'how much does this cost?': 'ఇది ఎంత ఖర్చు?',
            'i am vegetarian': 'నేను శాకాహారి',
        },
        ('en', 'ml'): {
            'where is the temple?': 'ക്ഷേത്രം എവിടെയാണ്?',
            'call an ambulance': 'ആംബുലൻസിനെ വിളിക്കൂ',
            'where is the bus stop?': 'ബസ് സ്റ്റോപ്പ് എവിടെയാണ്?',
            'i need help': 'എനിക്ക് സഹായം വേണം',
            'how much does this cost?': 'ഇതിന് എത്ര വിലയാണ്?',
            'i am vegetarian': 'ഞാൻ ശാഖാഹാരിയാണ്',
        },
    }

    normalized = text.lower().strip()
    translated = phrase_map.get((source, target), {}).get(normalized)
    if not translated:
        translated = _google_translate(text, source, target) or _ai_translate(text, source, target) or text

    _cache_set(cache_key, translated)
    return jsonify({'success': True, 'translatedText': translated, 'source': 'static' if translated == text else 'ai'})

@services_bp.route('/images/search', methods=['GET'])
def search_images():
    query = request.args.get('query', '').strip()
    per_page = min(int(request.args.get('per_page', 30)), 30)
    if not query:
        return jsonify({'success': False, 'error': 'query is required'}), 400

    cache_key = f"images:{query}:{per_page}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return jsonify({'success': True, 'images': cached, 'source': 'cache'})

    images = []
    if Config.UNSPLASH_ACCESS_KEY:
        url = "https://api.unsplash.com/search/photos"
        params = {'query': query, 'per_page': per_page, 'orientation': 'landscape'}
        headers = {'Authorization': f"Client-ID {Config.UNSPLASH_ACCESS_KEY}"}
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            images = [
                {
                    'url': item['urls']['regular'],
                    'thumb': item['urls']['small'],
                    'alt': item.get('alt_description') or query,
                    'source': 'unsplash'
                }
                for item in data.get('results', [])[:per_page]
            ]
    if not images and Config.PEXELS_API_KEY:
        url = "https://api.pexels.com/v1/search"
        params = {'query': query, 'per_page': per_page, 'orientation': 'landscape'}
        headers = {'Authorization': Config.PEXELS_API_KEY}
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            images = [
                {
                    'url': item['src']['large'],
                    'thumb': item['src']['medium'],
                    'alt': item.get('alt') or query,
                    'source': 'pexels'
                }
                for item in data.get('photos', [])[:per_page]
            ]

    _cache_set(cache_key, images)
    return jsonify({'success': True, 'images': images, 'source': 'live' if images else 'empty'})

@services_bp.route('/maps/route', methods=['POST'])
def get_route():
    data = request.json or {}
    origin = data.get('origin')
    destination = data.get('destination')
    mode = data.get('mode', 'driving')

    if not origin or not destination:
        return jsonify({'success': False, 'error': 'origin and destination required'}), 400

    if Config.GOOGLE_MAPS_KEY:
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {'origin': origin, 'destination': destination, 'mode': mode, 'key': Config.GOOGLE_MAPS_KEY}
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            return jsonify({'success': True, 'route': data, 'provider': 'google'})

    map_url = f"https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}&travelmode={mode}"
    return jsonify({'success': True, 'route': None, 'provider': 'link', 'url': map_url})

@services_bp.route('/maps/nearby', methods=['POST'])
def get_nearby():
    data = request.json or {}
    location = data.get('location')
    keyword = data.get('keyword', 'tourist attraction')
    radius = int(data.get('radius', 5000))

    if not location:
        return jsonify({'success': False, 'error': 'location required'}), 400

    if Config.GOOGLE_MAPS_KEY:
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            'location': location,
            'radius': radius,
            'keyword': keyword,
            'key': Config.GOOGLE_MAPS_KEY
        }
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            results = [
                {
                    'name': item.get('name'),
                    'rating': item.get('rating'),
                    'address': item.get('vicinity'),
                    'location': item.get('geometry', {}).get('location', {})
                }
                for item in data.get('results', [])[:10]
            ]
            return jsonify({'success': True, 'places': results, 'provider': 'google'})

    return jsonify({'success': True, 'places': [], 'provider': 'empty'})

@services_bp.route('/deals/search', methods=['POST'])
def search_deals():
    data = request.json or {}
    query = (data.get('query') or '').strip()
    deal_type = (data.get('type') or 'flights').strip().lower()

    cache_key = f"deals:{deal_type}:{query}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return jsonify({'success': True, 'type': deal_type, 'query': query, 'results': cached, 'source': 'cache'})

    results = []
    if deal_type == 'flights':
        results = [
            {'provider': 'DemoAir', 'from': 'Chennai (MAA)', 'to': query or 'Madurai (IXM)', 'price': 4599, 'stops': 0, 'duration': '1h 10m'},
            {'provider': 'DemoAir', 'from': 'Chennai (MAA)', 'to': query or 'Coimbatore (CJB)', 'price': 3899, 'stops': 0, 'duration': '1h 05m'},
        ]
    elif deal_type == 'hotels':
        results = [
            {'name': 'Demo Hotel Central', 'city': query or 'Chennai', 'rating': 4.4, 'price_per_night': 2599, 'distance_km': 1.8, 'contact': '+91-90000-00001'},
            {'name': 'Demo Boutique Stay', 'city': query or 'Chennai', 'rating': 4.2, 'price_per_night': 1999, 'distance_km': 3.1, 'contact': '+91-90000-00002'},
        ]
    else:
        results = [
            {'title': 'Demo Activity Pass', 'city': query or 'Chennai', 'price': 799, 'rating': 4.6, 'duration': '2 hours'},
            {'title': 'Demo Heritage Walk', 'city': query or 'Madurai', 'price': 599, 'rating': 4.5, 'duration': '90 mins'},
        ]

    _cache_set(cache_key, results)
    return jsonify({'success': True, 'type': deal_type, 'query': query, 'results': results, 'source': 'mock'})
