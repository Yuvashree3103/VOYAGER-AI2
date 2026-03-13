from flask import Blueprint, request, jsonify
import sys
import os
import pandas as pd
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

trip_planner_bp = Blueprint('trip_planner', __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TN_DATASET_PATH = os.path.join(BASE_DIR, 'data', 'tamilnadu_attractions.csv')
CHENNAI_DATASET_PATH = os.path.join(BASE_DIR, 'data', 'chennai_attractions_complete.csv')
DATASET_PATH = TN_DATASET_PATH if os.path.exists(TN_DATASET_PATH) else CHENNAI_DATASET_PATH
_cached_attractions_df = None
_location_attractions_cache = {}
_location_attractions_cache_ttl_s = 900

def load_attractions():
    """Load attractions from your dataset"""
    try:
        if os.path.exists(DATASET_PATH):
            df = pd.read_csv(DATASET_PATH)
            print(f"✅ Loaded {len(df)} attractions from: {DATASET_PATH}")
            return df
        else:
            print(f"❌ Dataset not found at: {DATASET_PATH}")
            print("📁 Please ensure the file exists at this location")
            return None
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return None

def get_attractions_df():
    global _cached_attractions_df
    if _cached_attractions_df is None:
        _cached_attractions_df = load_attractions()
    return _cached_attractions_df

def _now_ts():
    return datetime.utcnow().timestamp()

def _get_cached_location_attractions(location_key):
    cached = _location_attractions_cache.get(location_key)
    if not cached:
        return None
    ts, attractions = cached
    if _now_ts() - ts > _location_attractions_cache_ttl_s:
        _location_attractions_cache.pop(location_key, None)
        return None
    return attractions

def _set_cached_location_attractions(location_key, attractions):
    _location_attractions_cache[location_key] = (_now_ts(), attractions)

def _normalize_interest(name):
    return str(name or '').strip().title()

def detect_missing_interests(attractions, selected_interests, location):
    if not selected_interests:
        return [], []
    available = set()
    for attr in attractions:
        category = str(attr.get('category', '')).title()
        if category:
            available.add(category)
        for key in ['Shows and Concerts', 'Scenic', 'Local Experiences', 'Religious', 'History and Culture', 'Museum', 'Food and Drinks', 'Adventure', 'Shopping']:
            if attr.get(key):
                available.add(key)

    missing = []
    alternatives = []
    location_key = (location or '').lower()
    for interest in selected_interests:
        normalized = _normalize_interest(interest)
        if normalized not in available:
            missing.append(normalized)
            city_alts = CITY_INTEREST_SUGGESTIONS.get(location_key, {}).get(normalized, [])
            mapped = INTEREST_ALTERNATIVES.get(normalized, [])
            alternatives.append({
                'interest': normalized,
                'city_suggestions': city_alts,
                'category_alternatives': mapped
            })
    return missing, alternatives

def optimize_attractions_for_budget(attractions, strict_budget):
    if not strict_budget:
        return attractions
    free = [a for a in attractions if int(a.get('entry_fee', 0) or 0) == 0]
    paid = [a for a in attractions if int(a.get('entry_fee', 0) or 0) > 0]
    free_sorted = sorted(free, key=lambda x: x.get('popularity_score', 0), reverse=True)
    paid_sorted = sorted(paid, key=lambda x: x.get('entry_fee', 0))
    optimized = (free_sorted + paid_sorted)[:max(12, len(attractions))]
    return optimized or attractions

def build_budget_guidance(attractions, strict_budget):
    if not strict_budget:
        return {}
    free_attractions = [a for a in attractions if int(a.get('entry_fee', 0) or 0) == 0][:8]
    cheaper_alternatives = []
    for attr in attractions:
        entry_fee = int(attr.get('entry_fee', 0) or 0)
        if entry_fee > 200:
            cheaper_alternatives.append({
                'name': attr.get('POI'),
                'category': attr.get('category'),
                'entry_fee': entry_fee,
                'cheaper_pick': free_attractions[0].get('POI') if free_attractions else None
            })
        if len(cheaper_alternatives) >= 6:
            break
    transport_tips = [
        'Use metro/bus for longer hops, auto for short distances',
        'Cluster nearby attractions to reduce travel cost',
        'Start early to avoid peak-time cab fares'
    ]
    return {
        'free_attractions': free_attractions,
        'cheaper_alternatives': cheaper_alternatives,
        'transport_tips': transport_tips
    }

def _budget_base(days, travelers, budget_level):
    multipliers = {'budget': 0.7, 'mid': 1.0, 'high': 1.5}
    multiplier = multipliers.get(budget_level, 1.0)
    hotel_rates = {'budget': 1500, 'mid': 3000, 'high': 6000}
    food_rates = {'budget': 400, 'mid': 800, 'high': 1500}
    transport_rates = {'budget': 200, 'mid': 500, 'high': 1000}
    rooms = max(1, (max(1, travelers) + 1) // 2)
    hotel_cost = hotel_rates.get(budget_level, 3000) * days * rooms
    food_cost = food_rates.get(budget_level, 800) * days * travelers
    transport_cost = transport_rates.get(budget_level, 500) * days * travelers
    base_total = (hotel_cost + food_cost + transport_cost) * multiplier
    return {
        'hotel': int(hotel_cost * multiplier),
        'food': int(food_cost * multiplier),
        'transport': int(transport_cost * multiplier),
        'base_total': int(base_total)
    }

def trim_attractions_for_budget(attractions, strict_budget, days, travelers, budget_level):
    if not strict_budget:
        return attractions
    base = _budget_base(days, travelers, budget_level)
    remaining = strict_budget - base['base_total']
    free = [a for a in attractions if int(a.get('entry_fee', 0) or 0) == 0]
    paid = sorted([a for a in attractions if int(a.get('entry_fee', 0) or 0) > 0], key=lambda x: x.get('entry_fee', 0))
    selected = []
    for attr in free:
        selected.append(attr)
    for attr in paid:
        fee = int(attr.get('entry_fee', 0) or 0) * max(1, travelers)
        if remaining - fee < 0:
            continue
        remaining -= fee
        selected.append(attr)
    return selected or free or attractions

# LOCATION MAPPING for better filtering
LOCATION_KEYWORDS = {
    'chennai': ['chennai', 'marina', 'mylapore', 't nagar', 'egmore', 'guindy', 'adyar', 'nungambakkam', 'vadapalani'],
    'mahabalipuram': ['mahabalipuram', 'shore temple', 'pancha rathas', 'arjuna', 'krishna butterball', 'mamallapuram'],
    'kanchipuram': ['kanchipuram', 'kailasanathar', 'ekambareswarar', 'varadharaja'],
    'vellore': ['vellore', 'vellore fort'],
    'madurai': ['madurai', 'meenakshi', 'nayakkar palace', 'alagar kovil'],
    'thanjavur': ['thanjavur', 'brihadeeswara', 'big temple', 'thanjavur palace'],
    'trichy': ['trichy', 'tiruchirappalli', 'srirangam', 'rockfort'],
    'kodaikanal': ['kodaikanal', 'kodai', 'pillar rocks', 'kodai lake'],
    'ooty': ['ooty', 'udhagamandalam', 'nilgiris', 'doddabetta', 'botanical garden'],
    'coimbatore': ['coimbatore', 'isha', 'adiyogi', 'marudhamalai'],
    'rameswaram': ['rameswaram', 'ramanathaswamy', 'dhanushkodi'],
    'kanyakumari': ['kanyakumari', 'vivekananda rock', 'thiruvalluvar statue'],
    'tiruvannamalai': ['tiruvannamalai', 'arunachaleswarar', 'girivalam'],
    'chidambaram': ['chidambaram', 'nataraja'],
    'kumbakonam': ['kumbakonam', 'mahamaham']
}

INTEREST_ALTERNATIVES = {
    'Wildlife': ['Nature', 'Scenic', 'Local Experiences'],
    'Adventure': ['Scenic', 'Nature'],
    'Nightlife': ['Food and Drinks', 'Local Experiences'],
    'Shopping': ['Local Experiences', 'Food and Drinks'],
    'Photography': ['Scenic', 'History and Culture']
}

CITY_INTEREST_SUGGESTIONS = {
    'chennai': {
        'Wildlife': ['Guindy National Park', 'Arignar Anna Zoological Park (Vandalur)', 'Crocodile Bank'],
        'Heritage': ['Fort St George', 'Government Museum Chennai'],
        'Beach': ['Marina Beach', 'Besant Nagar Beach'],
    },
    'madurai': {
        'Wildlife': ['Athisayam Park (family-friendly)', 'Samanar Hills (nature walk)'],
        'Heritage': ['Thirumalai Nayakkar Palace', 'Gandhi Memorial Museum'],
    },
    'coimbatore': {
        'Wildlife': ['Marudhamalai Foothills', 'Valparai (day trip)'],
        'Heritage': ['Gass Forest Museum', 'Gedee Car Museum'],
    }
}

@trip_planner_bp.route('/plan-trip', methods=['POST', 'OPTIONS'])
def plan_trip():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        location = data.get('location', '').lower().strip()
        print(f"📍 Planning trip for: {location}")
        
        # Extract other inputs
        trip_name = data.get('tripName', 'My Tamil Nadu Trip')
        start_date = data.get('startDate')
        end_date = data.get('endDate')
        strict_budget = data.get('budget', None)
        if strict_budget is None:
            strict_budget = data.get('budgetAmount', None)
        if strict_budget is None:
            strict_budget = data.get('budget_limit', None)

        budget_level = data.get('budgetLevel', 'mid')
        travelers = int(data.get('travelers', 2))
        selected_interests = data.get('interests', [])
        
        # Calculate days
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        days = (end - start).days + 1
        
        # Get season
        month = datetime.now().month
        if 3 <= month <= 5:
            season = 'summer'
        elif 6 <= month <= 9:
            season = 'monsoon'
        else:
            season = 'winter'
        
        try:
            strict_budget = int(strict_budget) if strict_budget is not None and str(strict_budget).strip() != '' else None
        except Exception:
            strict_budget = None

        if strict_budget is not None and strict_budget > 0 and days > 0 and travelers > 0:
            per_day_pp = strict_budget / (days * travelers)
            if per_day_pp < 800:
                budget_level = 'budget'
            elif per_day_pp < 1800:
                budget_level = 'mid'
            else:
                budget_level = 'high'

        filtered_attractions = _get_cached_location_attractions(location) or []
        
        attractions_df = get_attractions_df()
        if attractions_df is not None and not filtered_attractions:
            # Method 1: Direct POI matching
            for _, row in attractions_df.iterrows():
                poi = str(row.get('POI', '')).lower()
                category = str(row.get('category', '')).lower()
                poi_type = str(row.get('type', '')).lower()
                description = str(row.get('description', '')).lower()
                city = str(row.get('city', '')).lower()
                
                # Check if location matches any field
                match = False
                
                # Direct match in POI name
                if location in poi:
                    match = True
                
                # Match in category
                if location in category:
                    match = True
                
                # Match in type
                if location in poi_type:
                    match = True
                
                # Match in description
                if location in description:
                    match = True

                if city and location in city:
                    match = True
                
                # Check location keywords
                for key, keywords in LOCATION_KEYWORDS.items():
                    if key in location or location in key:
                        for keyword in keywords:
                            if keyword in poi or keyword in description:
                                match = True
                                break
                            if city and keyword in city:
                                match = True
                                break
                
                if match:
                    filtered_attractions.append(row.to_dict())
        
        # If no matches found, use default attractions
        if not filtered_attractions:
            print(f"⚠️ No exact matches for '{location}', using default attractions")
            filtered_attractions = get_default_attractions_for_location(location)
        else:
            _set_cached_location_attractions(location, filtered_attractions)
        
        print(f"✅ Found {len(filtered_attractions)} attractions for {location}")
        
        # Sort by popularity
        filtered_attractions.sort(key=lambda x: x.get('popularity_score', 0), reverse=True)
        filtered_attractions = filtered_attractions[:60]
        
        # Filter by interests if selected
        if selected_interests and filtered_attractions:
            interest_filtered = []
            for attr in filtered_attractions:
                for interest in selected_interests:
                    if interest in attr and attr.get(interest, 0) > 3:
                        interest_filtered.append(attr)
                        break
            if interest_filtered:
                filtered_attractions = interest_filtered

        missing_interests, interest_alternatives = detect_missing_interests(filtered_attractions, selected_interests, location)

        estimated_budget = calculate_budget(days, travelers, budget_level, filtered_attractions, None)
        budget_warning = bool(strict_budget and estimated_budget['total'] > strict_budget)
        budget_guidance = build_budget_guidance(filtered_attractions, strict_budget)

        optimized_attractions = trim_attractions_for_budget(filtered_attractions, strict_budget, days, travelers, budget_level)
        optimized_attractions = optimize_attractions_for_budget(optimized_attractions, strict_budget) if budget_warning else optimized_attractions
        original_itinerary = generate_location_itinerary(filtered_attractions, days, start_date, location, travelers, strict_budget)
        itinerary = generate_location_itinerary(optimized_attractions, days, start_date, location, travelers, strict_budget)
        
        # Calculate budget
        budget = calculate_budget(days, travelers, budget_level, optimized_attractions, strict_budget)
        
        # Generate packing list
        packing_list = generate_packing_list(season, days, filtered_attractions)
        
        # Create expense template
        expense_template = create_expense_template(budget, days, travelers)
        
        return jsonify({
            'success': True,
            'plan': {
                'trip_name': trip_name,
                'location': location.title(),
                'start_date': start_date,
                'end_date': end_date,
                'days': days,
                'travelers': travelers,
                'budget_level': budget_level,
                'strict_budget': strict_budget,
                'itinerary': itinerary,
                'budget': budget,
                'expense_template': expense_template,
                'packing_list': packing_list,
                'total_attractions': len(filtered_attractions),
                'missing_interests': missing_interests,
                'interest_alternatives': interest_alternatives,
                'budget_warning': budget_warning,
                'estimated_budget': estimated_budget,
                'budget_guidance': budget_guidance,
                'original_itinerary': original_itinerary if budget_warning else None
            }
        })
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

def get_default_attractions_for_location(location):
    """Get default attractions based on location"""
    location = location.lower()
    
    if 'madurai' in location:
        return [
            {
                'POI': 'Meenakshi Amman Temple',
                'category': 'Temple',
                'description': 'Iconic Dravidian temple with towering gopurams and vibrant carvings',
                'entry_fee': 0,
                'avg_duration_mins': 180,
                'best_time': 'Morning 6-9 AM',
                'popularity_score': 9.8,
                'icon': '🛕'
            },
            {
                'POI': 'Thirumalai Nayakkar Palace',
                'category': 'Heritage',
                'description': '17th-century Indo-Saracenic palace with grand arches and pillars',
                'entry_fee': 50,
                'avg_duration_mins': 90,
                'best_time': 'Evening',
                'popularity_score': 9.2,
                'icon': '🏛️'
            },
            {
                'POI': 'Gandhi Memorial Museum',
                'category': 'Museum',
                'description': 'Museum showcasing Gandhian artifacts and the freedom movement',
                'entry_fee': 0,
                'avg_duration_mins': 75,
                'best_time': 'Morning',
                'popularity_score': 8.9,
                'icon': '🏺'
            },
            {
                'POI': 'Vaigai River Sunset Walk',
                'category': 'Scenic',
                'description': 'Relaxing riverside walk with local snacks and sunset views',
                'entry_fee': 0,
                'avg_duration_mins': 60,
                'best_time': 'Evening',
                'popularity_score': 8.5,
                'icon': '🌅'
            }
        ]

    if 'chennai' in location:
        return [
            {
                'POI': 'Marina Beach',
                'category': 'Beach',
                'description': 'One of India’s longest urban beaches — best at sunrise and evening',
                'entry_fee': 0,
                'avg_duration_mins': 120,
                'best_time': 'Evening',
                'popularity_score': 9.6,
                'icon': '🏖️'
            },
            {
                'POI': 'Kapaleeshwarar Temple (Mylapore)',
                'category': 'Temple',
                'description': 'Historic temple in Mylapore with classic Dravidian architecture',
                'entry_fee': 0,
                'avg_duration_mins': 120,
                'best_time': 'Morning',
                'popularity_score': 9.3,
                'icon': '🛕'
            },
            {
                'POI': 'Fort St. George',
                'category': 'Heritage',
                'description': 'Historic fort with museum and colonial-era buildings',
                'entry_fee': 25,
                'avg_duration_mins': 90,
                'best_time': 'Morning',
                'popularity_score': 8.7,
                'icon': '🏛️'
            },
            {
                'POI': 'Government Museum (Egmore)',
                'category': 'Museum',
                'description': 'Museum with archaeology, art, and natural history collections',
                'entry_fee': 15,
                'avg_duration_mins': 120,
                'best_time': 'Afternoon',
                'popularity_score': 8.6,
                'icon': '🏺'
            }
        ]

    # Mahabalipuram specific
    if 'mahabalipuram' in location:
        return [
            {
                'POI': 'Shore Temple',
                'category': 'Heritage',
                'description': 'UNESCO World Heritage site, 8th century temple',
                'entry_fee': 40,
                'avg_duration_mins': 120,
                'best_time': 'Morning 6-9 AM',
                'popularity_score': 9.5,
                'icon': '🛕'
            },
            {
                'POI': 'Pancha Rathas',
                'category': 'Heritage',
                'description': 'Five monolithic rock-cut temples',
                'entry_fee': 0,
                'avg_duration_mins': 90,
                'best_time': 'Morning',
                'popularity_score': 9.2,
                'icon': '🗿'
            },
            {
                'POI': 'Arjuna\'s Penance',
                'category': 'Heritage',
                'description': 'Massive rock relief sculpture',
                'entry_fee': 0,
                'avg_duration_mins': 60,
                'best_time': 'Morning',
                'popularity_score': 9.0,
                'icon': '⛰️'
            },
            {
                'POI': 'Mahabalipuram Beach',
                'category': 'Beach',
                'description': 'Scenic beach with Shore Temple view',
                'entry_fee': 0,
                'avg_duration_mins': 120,
                'best_time': 'Evening',
                'popularity_score': 8.8,
                'icon': '🏖️'
            }
        ]
    
    # T Nagar specific
    elif 't nagar' in location or 'tnagar' in location or 'shopping' in location:
        return [
            {
                'POI': 'Pondy Bazaar',
                'category': 'Shopping',
                'description': 'Street shopping paradise',
                'entry_fee': 0,
                'avg_duration_mins': 180,
                'best_time': 'Evening',
                'popularity_score': 8.5,
                'icon': '🛍️'
            },
            {
                'POI': 'Ranganathan Street',
                'category': 'Shopping',
                'description': 'Famous shopping street',
                'entry_fee': 0,
                'avg_duration_mins': 180,
                'best_time': 'Evening',
                'popularity_score': 9.0,
                'icon': '🛒'
            },
            {
                'POI': 'Murugan Idli Shop',
                'category': 'Food',
                'description': 'Famous South Indian breakfast',
                'entry_fee': 0,
                'avg_duration_mins': 60,
                'best_time': 'Morning',
                'popularity_score': 9.0,
                'icon': '🍛'
            }
        ]
    
    # Marina/Beach specific
    elif 'marina' in location or 'beach' in location:
        return [
            {
                'POI': 'Marina Beach',
                'category': 'Beach',
                'description': 'World\'s second-longest urban beach',
                'entry_fee': 0,
                'avg_duration_mins': 120,
                'best_time': 'Evening 4-7 PM',
                'popularity_score': 9.8,
                'icon': '🏖️'
            },
            {
                'POI': 'Vivekananda House',
                'category': 'Heritage',
                'description': 'Memorial of Swami Vivekananda',
                'entry_fee': 20,
                'avg_duration_mins': 60,
                'best_time': 'Morning',
                'popularity_score': 8.0,
                'icon': '🏛️'
            },
            {
                'POI': 'Chennai Lighthouse',
                'category': 'Scenic',
                'description': 'Iconic lighthouse with city views',
                'entry_fee': 20,
                'avg_duration_mins': 30,
                'best_time': 'Evening',
                'popularity_score': 8.0,
                'icon': '🗼'
            }
        ]
    
    # Mylapore/Temple specific
    elif 'mylapore' in location or 'temple' in location:
        return [
            {
                'POI': 'Kapaleeshwarar Temple',
                'category': 'Temple',
                'description': 'Ancient Shiva temple',
                'entry_fee': 0,
                'avg_duration_mins': 60,
                'best_time': 'Morning 6-8 AM',
                'popularity_score': 9.5,
                'icon': '🛕'
            },
            {
                'POI': 'Santhome Basilica',
                'category': 'Church',
                'description': 'Built over tomb of St. Thomas',
                'entry_fee': 0,
                'avg_duration_mins': 45,
                'best_time': 'Morning',
                'popularity_score': 9.0,
                'icon': '⛪'
            }
        ]
    
    # Default
    else:
        return [
            {
                'POI': f'{location.title()} Exploration',
                'category': 'Sightseeing',
                'description': f'Explore the charm of {location.title()}',
                'entry_fee': 0,
                'avg_duration_mins': 120,
                'best_time': 'Morning',
                'popularity_score': 8.0,
                'icon': '📍'
            }
        ]

def generate_location_itinerary(attractions, days, start_date, location, travelers, strict_budget):
    """Generate day-wise itinerary based on location"""
    itinerary = []
    start = datetime.strptime(start_date, '%Y-%m-%d')

    city_key = (location or '').lower()
    meal_templates = {
        'madurai': {
            'breakfast': [
                {'title': 'Breakfast at Murugan Idli Shop', 'place': 'West Masi St', 'cost_pp': 120, 'icon': '☕'},
                {'title': 'Breakfast at Sree Sabarees', 'place': 'KK Nagar', 'cost_pp': 150, 'icon': '☕'},
            ],
            'lunch': [
                {'title': 'Lunch at Amma Mess', 'place': 'Vilakuthoon', 'cost_pp': 180, 'icon': '🍽️'},
                {'title': 'Lunch at Jigarthanda Kadai', 'place': 'Vilakuthoon', 'cost_pp': 180, 'icon': '🍽️'},
            ],
        },
        'chennai': {
            'breakfast': [
                {'title': 'Breakfast at Saravana Bhavan', 'place': 'T Nagar', 'cost_pp': 130, 'icon': '☕'},
                {'title': 'Breakfast at Murugan Idli Shop', 'place': 'Adyar', 'cost_pp': 120, 'icon': '☕'},
            ],
            'lunch': [
                {'title': 'Lunch at Buhari', 'place': 'Mount Road', 'cost_pp': 250, 'icon': '🍽️'},
                {'title': 'Lunch at Rayar’s Mess', 'place': 'Mylapore', 'cost_pp': 180, 'icon': '🍽️'},
            ],
        },
    }
    meals = meal_templates.get(city_key, None)
    
    # Icon mapping
    icon_map = {
        'Beach': '🏖️', 'Temple': '🛕', 'Church': '⛪', 'Heritage': '🏛️',
        'Museum': '🏺', 'Shopping': '🛍️', 'Food': '🍛', 'Nature': '🌿',
        'Adventure': '🎢', 'Scenic': '🌅', 'Religious': '🕉️', 'Mall': '🏬'
    }
    
    # Distribute attractions across days
    attractions_per_day = max(2, len(attractions) // max(1, days))
    
    for day in range(1, days + 1):
        start_idx = (day - 1) * attractions_per_day
        end_idx = min(start_idx + attractions_per_day, len(attractions))
        day_attractions = attractions[start_idx:end_idx]
        
        if not day_attractions:
            day_attractions = attractions[:2]
        
        items = []
        total_cost = 0
        total_duration = 0
        
        time_slots = ["08:00 AM", "09:30 AM", "01:00 PM", "03:00 PM", "05:30 PM"]

        def add_meal(meal_item, time_value):
            nonlocal total_cost, total_duration
            total_cost += int(meal_item.get('cost_pp', 0)) * max(1, travelers)
            total_duration += 1.0
            items.append({
                'time': time_value,
                'title': meal_item.get('title', 'Meal'),
                'description': 'Start your day with authentic cuisine.' if 'Breakfast' in meal_item.get('title', '') else 'Local favorite meal spot.',
                'category': 'Food',
                'cost': f"₹{meal_item.get('cost_pp', 0)}",
                'entry_fee': int(meal_item.get('cost_pp', 0)),
                'duration': 1.0,
                'best_time': 'Anytime',
                'icon': meal_item.get('icon', '🍛'),
                'place': meal_item.get('place', ''),
                'reachability': 'Reachable via: Bus / Auto',
                'distance_km': 1.0,
                'action': 'Check Availability'
            })
        
        if meals:
            add_meal(meals['breakfast'][(day - 1) % len(meals['breakfast'])], time_slots[0])

        slot_idx = 1
        for attr in day_attractions[:3]:
            if slot_idx < len(time_slots) - 1:
                category = attr.get('category', '')
                icon = icon_map.get(category, '📍')
                
                entry_fee = attr.get('entry_fee', 0)
                cost_str = 'Free' if entry_fee == 0 else f"₹{entry_fee}"
                
                duration = attr.get('avg_duration_mins', 120) / 60
                
                items.append({
                    'time': time_slots[slot_idx],
                    'title': attr.get('POI', 'Attraction'),
                    'description': attr.get('description', '')[:100],
                    'category': category,
                    'cost': cost_str,
                    'entry_fee': entry_fee,
                    'duration': round(duration, 1),
                    'best_time': attr.get('best_time', 'Anytime'),
                    'icon': icon,
                    'place': location.title(),
                    'reachability': 'Reachable via: Bus / Auto',
                    'distance_km': round(0.5 + (slot_idx * 0.7), 1),
                    'action': 'Map',
                    'latitude': attr.get('latitude') or attr.get('lat'),
                    'longitude': attr.get('longitude') or attr.get('lng'),
                    'map_url': f"https://www.google.com/maps/search/?api=1&query={(attr.get('latitude') or attr.get('lat'))},{(attr.get('longitude') or attr.get('lng'))}" if (attr.get('latitude') or attr.get('lat')) and (attr.get('longitude') or attr.get('lng')) else None
                })
                
                total_cost += int(entry_fee) * max(1, travelers)
                total_duration += duration
                slot_idx += 1

        if meals and slot_idx < len(time_slots):
            add_meal(meals['lunch'][(day - 1) % len(meals['lunch'])], time_slots[slot_idx])
            slot_idx += 1

        if slot_idx < len(time_slots) and len(day_attractions) > 3:
            attr = day_attractions[3]
            category = attr.get('category', '')
            icon = icon_map.get(category, '📍')
            entry_fee = attr.get('entry_fee', 0)
            cost_str = 'Free' if entry_fee == 0 else f"₹{entry_fee}"
            duration = attr.get('avg_duration_mins', 120) / 60
            items.append({
                'time': time_slots[min(slot_idx, len(time_slots) - 1)],
                'title': attr.get('POI', 'Attraction'),
                'description': attr.get('description', '')[:100],
                'category': category,
                'cost': cost_str,
                'entry_fee': entry_fee,
                'duration': round(duration, 1),
                'best_time': attr.get('best_time', 'Anytime'),
                'icon': icon,
                'place': location.title(),
                'reachability': 'Reachable via: Bus / Auto',
                'distance_km': round(1.2 + (slot_idx * 0.6), 1),
                'action': 'Map',
                'latitude': attr.get('latitude') or attr.get('lat'),
                'longitude': attr.get('longitude') or attr.get('lng'),
                'map_url': f"https://www.google.com/maps/search/?api=1&query={(attr.get('latitude') or attr.get('lat'))},{(attr.get('longitude') or attr.get('lng'))}" if (attr.get('latitude') or attr.get('lat')) and (attr.get('longitude') or attr.get('lng')) else None
            })
            total_cost += int(entry_fee) * max(1, travelers)
            total_duration += duration
        
        # Determine theme based on location and attractions
        if 'mahabalipuram' in location.lower():
            theme = f'Mahabalipuram Heritage - Day {day}'
        elif 't nagar' in location.lower() or 'shopping' in location.lower():
            theme = f'T Nagar Shopping - Day {day}'
        elif 'marina' in location.lower() or 'beach' in location.lower():
            theme = f'Marina Beach - Day {day}'
        elif 'mylapore' in location.lower() or 'temple' in location.lower():
            theme = f'Mylapore Temple Tour - Day {day}'
        else:
            theme = f'{location.title()} Exploration - Day {day}'
        
        itinerary.append({
            'day': day,
            'date': (start + timedelta(days=day-1)).strftime('%Y-%m-%d'),
            'theme': theme,
            'items': items,
            'total_cost': int(total_cost),
            'total_duration_hours': round(total_duration, 1)
        })
    
    return itinerary

def calculate_budget(days, travelers, budget_level, attractions, strict_budget):
    """Calculate budget including attraction costs"""
    multipliers = {'budget': 0.7, 'mid': 1.0, 'high': 1.5}
    multiplier = multipliers.get(budget_level, 1.0)
    
    # Hotel costs per day
    hotel_rates = {'budget': 1500, 'mid': 3000, 'high': 6000}
    rooms = max(1, (max(1, travelers) + 1) // 2)
    hotel_cost = hotel_rates.get(budget_level, 3000) * days * rooms
    
    # Food costs per person per day
    food_rates = {'budget': 400, 'mid': 800, 'high': 1500}
    food_cost = food_rates.get(budget_level, 800) * days * travelers
    
    # Transport costs
    transport_rates = {'budget': 200, 'mid': 500, 'high': 1000}
    transport_cost = transport_rates.get(budget_level, 500) * days * travelers
    
    # Attractions cost (from actual attractions)
    attractions_cost = sum(int(attr.get('entry_fee', 0) or 0) for attr in attractions[:40]) * max(1, travelers)
    
    # Apply multiplier
    total = (hotel_cost + food_cost + transport_cost + attractions_cost) * multiplier
    if strict_budget is not None and isinstance(strict_budget, int) and strict_budget > 0 and total > strict_budget:
        scale = strict_budget / total
        hotel_cost = hotel_cost * scale
        food_cost = food_cost * scale
        transport_cost = transport_cost * scale
        attractions_cost = attractions_cost * scale
        total = strict_budget
    
    return {
        'hotel': int(hotel_cost * multiplier),
        'food': int(food_cost * multiplier),
        'transport': int(transport_cost * multiplier),
        'attractions': int(attractions_cost * multiplier),
        'total': int(total),
        'per_person': int(total / max(1, travelers)),
        'per_day': int(total / max(1, days))
    }

def generate_packing_list(season, days, attractions):
    """Generate packing list based on attractions"""
    items = [
        '🪪 Valid ID (Aadhar/Passport)',
        '📱 Smartphone with charger',
        '🔋 Power bank',
        '💧 Water bottle',
        '🧴 Hand sanitizer',
        '💰 Cash (₹1000-2000)',
        '💳 Debit/Credit card',
        '💊 Basic medicines'
    ]
    
    # Add items based on attraction types
    for attr in attractions:
        category = attr.get('category', '').lower()
        if 'beach' in category:
            items.extend(['🧴 Sunscreen', '🕶️ Sunglasses', '👒 Hat', '🩴 Flip-flops'])
        if 'temple' in category or 'religious' in category:
            items.extend(['👔 Modest clothing', '🧦 Extra socks'])
        if 'shopping' in category:
            items.extend(['🛍️ Shopping bag'])
    
    # Season-specific
    if season == 'summer':
        items.extend(['🧴 Extra sunscreen', '👕 Light clothes', '🧢 Cap'])
    elif season == 'monsoon':
        items.extend(['☔ Umbrella', '🧥 Raincoat'])
    else:
        items.extend(['🧥 Light jacket', '🧣 Scarf'])
    
    # Remove duplicates while preserving order
    seen = set()
    unique_items = []
    for item in items:
        if item not in seen:
            unique_items.append(item)
            seen.add(item)
    
    return unique_items[:12]

def create_expense_template(budget, days, travelers):
    """Create expense tracking template"""
    return {
        'total_budget': budget['total'],
        'remaining': budget['total'],
        'categories': {
            'hotel': {
                'allocated': budget['hotel'],
                'spent': 0,
                'remaining': budget['hotel'],
                'items': []
            },
            'food': {
                'allocated': budget['food'],
                'spent': 0,
                'remaining': budget['food'],
                'items': []
            },
            'transport': {
                'allocated': budget['transport'],
                'spent': 0,
                'remaining': budget['transport'],
                'items': []
            },
            'attractions': {
                'allocated': budget['attractions'],
                'spent': 0,
                'remaining': budget['attractions'],
                'items': []
            }
        }
    }
