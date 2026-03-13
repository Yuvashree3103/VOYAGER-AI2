# Location-specific essentials data
ESSENTIALS_BY_CATEGORY = {
    'temple': {
        'name': 'Temple Visit',
        'icon': '🛕',
        'essentials': [
            {'id': 'modest_clothing', 'name': '👔 Modest clothing (shoulders/knees covered)', 'category': 'temple'},
            {'id': 'footwear_bag', 'name': '👟 Bag for shoes (remove before entering)', 'category': 'temple'},
            {'id': 'socks', 'name': '🧦 Extra socks', 'category': 'temple'},
            {'id': 'offerings', 'name': '💰 Offerings (₹10-50 for donation)', 'category': 'temple'},
            {'id': 'head_cover', 'name': '🧣 Head cover (for some temples)', 'category': 'temple'},
            {'id': 'camera_permit', 'name': '📷 Camera (check photography policy)', 'category': 'temple'},
            {'id': 'water_bottle', 'name': '💧 Water bottle', 'category': 'temple', 'universal': True},
            {'id': 'hand_sanitizer', 'name': '🧴 Hand sanitizer', 'category': 'temple', 'universal': True}
        ]
    },
    'beach': {
        'name': 'Beach Visit',
        'icon': '🏖️',
        'essentials': [
            {'id': 'sunscreen', 'name': '🧴 Sunscreen SPF 50+', 'category': 'beach'},
            {'id': 'sunglasses', 'name': '🕶️ Polarized sunglasses', 'category': 'beach'},
            {'id': 'hat', 'name': '👒 Wide-brim hat or cap', 'category': 'beach'},
            {'id': 'flipflops', 'name': '🩴 Flip-flops', 'category': 'beach'},
            {'id': 'towel', 'name': '🧻 Beach towel', 'category': 'beach'},
            {'id': 'change_clothes', 'name': '👕 Extra clothes', 'category': 'beach'},
            {'id': 'waterproof_pouch', 'name': '📱 Waterproof phone pouch', 'category': 'beach'},
            {'id': 'snacks', 'name': '🍫 Light snacks', 'category': 'beach'},
            {'id': 'cash_small', 'name': '💰 Small cash (₹100-200 for vendors)', 'category': 'beach'},
            {'id': 'water_bottle', 'name': '💧 2-liter water bottle', 'category': 'beach', 'universal': True}
        ]
    },
    'shopping_mall': {
        'name': 'Shopping Mall',
        'icon': '🛍️',
        'essentials': [
            {'id': 'shopping_bag', 'name': '🛍️ Reusable shopping bag', 'category': 'mall'},
            {'id': 'payment_cards', 'name': '💳 Multiple payment options (cards/UPI)', 'category': 'mall'},
            {'id': 'payment_apps', 'name': '📱 Phone with payment apps', 'category': 'mall'},
            {'id': 'id_proof', 'name': '🪪 ID proof (for big purchases)', 'category': 'mall'},
            {'id': 'comfortable_shoes', 'name': '👟 Comfortable walking shoes', 'category': 'mall'},
            {'id': 'shopping_list', 'name': '📝 Shopping list', 'category': 'mall'},
            {'id': 'water_bottle', 'name': '💧 Water bottle', 'category': 'mall', 'universal': True},
            {'id': 'hand_sanitizer', 'name': '🧴 Hand sanitizer', 'category': 'mall', 'universal': True}
        ]
    },
    'food_street': {
        'name': 'Food Street',
        'icon': '🍛',
        'essentials': [
            {'id': 'digestive', 'name': '💊 Digestive enzymes', 'category': 'food'},
            {'id': 'wet_wipes', 'name': '🧻 Wet wipes', 'category': 'food'},
            {'id': 'hand_sanitizer', 'name': '🧴 Hand sanitizer', 'category': 'food'},
            {'id': 'small_change', 'name': '💰 Small change (₹100-200)', 'category': 'food'},
            {'id': 'phone_camera', 'name': '📱 Phone for food photos', 'category': 'food'},
            {'id': 'mints', 'name': '🍬 Mints', 'category': 'food'},
            {'id': 'water_bottle', 'name': '💧 Water bottle', 'category': 'food', 'universal': True},
            {'id': 'tissue_paper', 'name': '🧻 Tissue paper', 'category': 'food', 'universal': True}
        ]
    },
    'heritage': {
        'name': 'Heritage Site',
        'icon': '🏛️',
        'essentials': [
            {'id': 'camera', 'name': '📷 Camera/Phone with good battery', 'category': 'heritage'},
            {'id': 'walking_shoes', 'name': '👟 Comfortable walking shoes', 'category': 'heritage'},
            {'id': 'audio_guide', 'name': '🎧 Audio guide compatible earphones', 'category': 'heritage'},
            {'id': 'guidebook', 'name': '📖 Guidebook', 'category': 'heritage'},
            {'id': 'student_id', 'name': '🪪 Student ID (for discounts)', 'category': 'heritage'},
            {'id': 'power_bank', 'name': '🔋 Power bank', 'category': 'heritage', 'universal': True},
            {'id': 'water_bottle', 'name': '💧 Water bottle', 'category': 'heritage', 'universal': True}
        ]
    },
    'museum': {
        'name': 'Museum',
        'icon': '🏺',
        'essentials': [
            {'id': 'camera_check', 'name': '📷 Camera (check policy)', 'category': 'museum'},
            {'id': 'valid_id', 'name': '🪪 Valid ID', 'category': 'museum'},
            {'id': 'earphones', 'name': '🎧 Earphones (for audio guides)', 'category': 'museum'},
            {'id': 'notebook', 'name': '📓 Notebook and pen', 'category': 'museum'},
            {'id': 'reading_glasses', 'name': '🕶️ Reading glasses', 'category': 'museum'},
            {'id': 'water_bottle', 'name': '💧 Water bottle', 'category': 'museum', 'universal': True}
        ]
    },
    'nature': {
        'name': 'Nature Park',
        'icon': '🌿',
        'essentials': [
            {'id': 'insect_repellent', 'name': '🧴 Insect repellent', 'category': 'nature'},
            {'id': 'binoculars', 'name': '📷 Camera/binoculars', 'category': 'nature'},
            {'id': 'comfortable_shoes', 'name': '👟 Comfortable walking shoes', 'category': 'nature'},
            {'id': 'hat', 'name': '🧢 Cap/hat', 'category': 'nature'},
            {'id': 'energy_snacks', 'name': '🍫 Energy snacks', 'category': 'nature'},
            {'id': 'water_bottle', 'name': '💧 Water bottle', 'category': 'nature', 'universal': True},
            {'id': 'sunscreen', 'name': '🧴 Sunscreen', 'category': 'nature', 'universal': True}
        ]
    },
    'universal': {
        'name': 'Universal Essentials',
        'icon': '✅',
        'essentials': [
            {'id': 'valid_id', 'name': '🪪 Valid ID (Aadhar/Passport)', 'category': 'universal'},
            {'id': 'smartphone', 'name': '📱 Smartphone with charger', 'category': 'universal'},
            {'id': 'power_bank', 'name': '🔋 Power bank', 'category': 'universal'},
            {'id': 'water_bottle', 'name': '💧 Water bottle', 'category': 'universal'},
            {'id': 'hand_sanitizer', 'name': '🧴 Hand sanitizer', 'category': 'universal'},
            {'id': 'cash', 'name': '💰 Cash (₹1000-2000)', 'category': 'universal'},
            {'id': 'cards', 'name': '💳 Debit/Credit card', 'category': 'universal'},
            {'id': 'medicines', 'name': '💊 Basic medicines', 'category': 'universal'}
        ]
    }
}

def get_essentials_for_categories(categories):
    """Get combined essentials for multiple categories"""
    all_essentials = []
    seen_ids = set()
    
    # Always add universal essentials
    for item in ESSENTIALS_BY_CATEGORY['universal']['essentials']:
        if item['id'] not in seen_ids:
            all_essentials.append(item.copy())
            seen_ids.add(item['id'])
    
    # Add category-specific essentials
    for category in categories:
        if category in ESSENTIALS_BY_CATEGORY:
            for item in ESSENTIALS_BY_CATEGORY[category]['essentials']:
                if item['id'] not in seen_ids:
                    all_essentials.append(item.copy())
                    seen_ids.add(item['id'])
    
    return all_essentials