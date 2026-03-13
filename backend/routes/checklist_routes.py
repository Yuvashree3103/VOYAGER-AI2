from flask import Blueprint, request, jsonify
from datetime import datetime

checklist_bp = Blueprint('checklist', __name__)

# REAL location-specific requirements
LOCATION_REQUIREMENTS = {
    'Marina Beach': {
        'essentials': ['Sunscreen', 'Water bottle', 'Hat/Cap', 'Sunglasses'],
        'recommended': ['Beach mat', 'Snacks', 'Camera', 'Extra clothes'],
        'restrictions': ['No alcohol', 'No littering'],
        'best_time': 'Evening 4-7 PM',
        'facilities': ['Changing rooms', 'Restrooms', 'Food stalls']
    },
    'Kapaleeshwarar Temple': {
        'essentials': ['Remove footwear', 'Modest clothing', 'Remove leather items'],
        'recommended': ['Offerings (flowers, coconut)', 'Camera (outside only)'],
        'restrictions': ['No photography inside', 'No non-Hindus in sanctum'],
        'best_time': 'Morning 6-8 AM',
        'facilities': ['Shoe stand (₹5)', 'Prasadam counter']
    },
    'Mahabalipuram': {
        'essentials': ['Water bottle', 'Hat/Cap', 'Comfortable shoes', 'Sunscreen'],
        'recommended': ['Camera', 'Snacks', 'Guide book', 'Swimwear (for beach)'],
        'restrictions': ['No touching sculptures'],
        'best_time': 'Morning 7-11 AM',
        'facilities': ['Parking (₹50)', 'Restrooms', 'Restaurants']
    },
    'Express Avenue Mall': {
        'essentials': ['Shopping bag', 'Credit/Debit card', 'Valid ID (for movies)'],
        'recommended': ['Comfortable shoes', 'Water bottle'],
        'restrictions': ['No outside food'],
        'best_time': 'Evening 6-9 PM',
        'facilities': ['Parking (free 2 hrs)', 'ATM', 'Food court']
    },
    'Guindy National Park': {
        'essentials': ['Water bottle', 'Insect repellent', 'Comfortable walking shoes'],
        'recommended': ['Binoculars', 'Camera', 'Snacks', 'Hat'],
        'restrictions': ['No littering', 'No feeding animals', 'No loud music'],
        'best_time': 'Morning 7-10 AM',
        'facilities': ['Parking', 'Restrooms', 'Drinking water']
    },
    'VGP Universal Kingdom': {
        'essentials': ['Swimwear', 'Towel', 'Change of clothes', 'Waterproof phone case'],
        'recommended': ['Snacks', 'Sunscreen', 'Flip flops'],
        'restrictions': ['No outside food', 'No alcohol'],
        'best_time': 'Morning 10 AM',
        'facilities': ['Locker rental', 'Changing rooms', 'Food court']
    }
}

@checklist_bp.route('/location-checklist', methods=['POST'])
def location_checklist():
    """Get REAL location-specific checklist"""
    try:
        data = request.json
        location = data.get('location', 'Marina Beach')
        travel_type = data.get('travel_type', 'Solo')
        duration = data.get('duration', 1)
        season = data.get('season', 'Winter')
        
        # Get location-specific requirements
        requirements = LOCATION_REQUIREMENTS.get(location, LOCATION_REQUIREMENTS['Marina Beach'])
        
        # Base checklist
        checklist = {
            'essentials': [],
            'recommended': [],
            'documents': [],
            'weather_based': [],
            'travel_type_specific': []
        }
        
        # Add location essentials
        for item in requirements['essentials']:
            checklist['essentials'].append({'item': item, 'checked': False})
        
        for item in requirements['recommended']:
            checklist['recommended'].append({'item': item, 'checked': False})
        
        # Universal essentials
        universal = [
            'Smartphone with charger',
            'Power bank',
            'ID proof (Aadhar/Passport/Driving license)',
            'Prescription medicines',
            'First aid kit',
            'Face masks',
            'Hand sanitizer'
        ]
        
        for item in universal:
            checklist['essentials'].append({'item': item, 'checked': False})
        
        # Documents
        documents = [
            'Hotel booking confirmation',
            'Transport tickets',
            'Travel insurance',
            'Emergency contacts list'
        ]
        
        for item in documents:
            checklist['documents'].append({'item': item, 'checked': False})
        
        # Weather-based items [citation:10]
        if season == 'Summer' or season == 'Hot':
            checklist['weather_based'] = [
                {'item': 'Sunscreen SPF 50+', 'checked': False},
                {'item': 'Sun hat / Cap', 'checked': False},
                {'item': 'Sunglasses', 'checked': False},
                {'item': 'Light cotton clothes', 'checked': False},
                {'item': 'Electrolyte powder', 'checked': False}
            ]
        elif season == 'Monsoon':
            checklist['weather_based'] = [
                {'item': 'Umbrella', 'checked': False},
                {'item': 'Raincoat', 'checked': False},
                {'item': 'Waterproof phone cover', 'checked': False},
                {'item': 'Extra pair of socks', 'checked': False},
                {'item': 'Plastic bags for wet clothes', 'checked': False}
            ]
        else:  # Winter
            checklist['weather_based'] = [
                {'item': 'Light jacket', 'checked': False},
                {'item': 'Comfortable walking shoes', 'checked': False},
                {'item': 'Lip balm', 'checked': False},
                {'item': 'Moisturizer', 'checked': False}
            ]
        
        # Travel type specific
        if travel_type == 'Family':
            checklist['travel_type_specific'] = [
                {'item': 'Snacks for kids', 'checked': False},
                {'item': 'Travel games', 'checked': False},
                {'item': 'Baby wipes', 'checked': False},
                {'item': 'Extra clothes for children', 'checked': False}
            ]
        elif travel_type == 'Couple':
            checklist['travel_type_specific'] = [
                {'item': 'Camera', 'checked': False},
                {'item': 'Selfie stick', 'checked': False},
                {'item': 'Portable charger', 'checked': False}
            ]
        elif travel_type == 'Friends':
            checklist['travel_type_specific'] = [
                {'item': 'Portable speaker', 'checked': False},
                {'item': 'Playing cards', 'checked': False},
                {'item': 'Camera', 'checked': False},
                {'item': 'Power bank', 'checked': False}
            ]
        
        # Duration-based items
        if duration > 3:
            checklist['essentials'].append({'item': 'Laundry bag', 'checked': False})
            checklist['essentials'].append({'item': 'Travel-sized detergent', 'checked': False})
        
        return jsonify({
            'success': True,
            'location': location,
            'checklist': checklist,
            'location_info': {
                'best_time': requirements['best_time'],
                'restrictions': requirements['restrictions'],
                'facilities': requirements['facilities']
            },
            'total_items': sum(len(v) for v in checklist.values())
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500