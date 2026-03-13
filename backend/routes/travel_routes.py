from flask import Blueprint, jsonify, request
from models.travel_models import Agency, Guide, TourPackage, Food, TravelFeature, Destination, db

travel_bp = Blueprint('travel', __name__)

CAROUSEL_IMAGES = [
    {"id": "meenakshi", "label": "Madurai — Meenakshi Amman Temple", "url": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Meenakshi_Amman_Temple_gopuram.jpg"},
    {"id": "marina", "label": "Chennai — Marina Beach", "url": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Marina_Beach_4.jpg"},
    {"id": "kapaleeswarar", "label": "Chennai — Kapaleeshwarar Temple", "url": "https://upload.wikimedia.org/wikipedia/commons/5/59/Kapaleeswarar_Temple_Chennai.jpg"},
    {"id": "mahabalipuram", "label": "Mahabalipuram — Shore Temple", "url": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Shore_Temple%2C_Mahabalipuram.jpg"},
    {"id": "thanjavur", "label": "Thanjavur — Brihadeeswarar Temple", "url": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Brihadeeswarar_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg"},
    {"id": "kanyakumari", "label": "Kanyakumari — Sunrise", "url": "https://upload.wikimedia.org/wikipedia/commons/8/82/Kanyakumari_sunrise.jpg"},
    {"id": "ooty", "label": "Ooty — Ooty Lake", "url": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Ooty_lake.jpg"},
    {"id": "kodaikanal", "label": "Kodaikanal — Lake", "url": "https://upload.wikimedia.org/wikipedia/commons/8/86/Kodaikanal_Lake.jpg"},
    {"id": "rameswaram", "label": "Rameswaram — Ramanathaswamy Temple", "url": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Ramanathaswamy_Temple.jpg"},
    {"id": "dhanushkodi", "label": "Dhanushkodi — Beach", "url": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Dhanushkodi_beach.jpg"},
    {"id": "hogenakkal", "label": "Hogenakkal Falls", "url": "https://upload.wikimedia.org/wikipedia/commons/6/68/Hogenakkal_Falls.jpg"},
    {"id": "courtallam", "label": "Courtallam Falls", "url": "https://upload.wikimedia.org/wikipedia/commons/2/26/Courtallam_Falls.jpg"},
    {"id": "yercaud", "label": "Yercaud — Lake", "url": "https://upload.wikimedia.org/wikipedia/commons/1/11/Yercaud_Lake.jpg"},
    {"id": "yelagiri", "label": "Yelagiri — Hills", "url": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Yelagiri_hills.jpg"},
    {"id": "chidambaram", "label": "Chidambaram — Nataraja Temple", "url": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Chidambaram_Nataraja_Temple.jpg"},
    {"id": "trichy", "label": "Tiruchirappalli — Rockfort", "url": "https://upload.wikimedia.org/wikipedia/commons/7/78/Rockfort_Temple%2C_Trichy.jpg"},
    {"id": "velankanni", "label": "Velankanni — Basilica", "url": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Velankanni_church.jpg"},
    {"id": "coimbatore", "label": "Coimbatore — Adiyogi", "url": "https://upload.wikimedia.org/wikipedia/commons/7/72/Adiyogi_Shiva_Coimbatore.jpg"},
    {"id": "kumbakonam", "label": "Kumbakonam — Temple Town", "url": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Kumbakonam_temple.jpg"},
    {"id": "tiruvannamalai", "label": "Tiruvannamalai — Arunachaleswarar Temple", "url": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Arunachaleswarar_Temple.jpg"},
    {"id": "pondicherry", "label": "Pondicherry — Promenade", "url": "https://upload.wikimedia.org/wikipedia/commons/5/57/Pondicherry_Promenade.jpg"},
    {"id": "mudumalai", "label": "Mudumalai National Park", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Mudumalai_National_Park.jpg"},
    {"id": "vedanthangal", "label": "Vedanthangal Bird Sanctuary", "url": "https://upload.wikimedia.org/wikipedia/commons/3/38/Vedanthangal_bird_sanctuary.jpg"},
    {"id": "gulf-of-mannar", "label": "Gulf of Mannar", "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Gulf_of_Mannar.jpg"},
    {"id": "pichavaram", "label": "Pichavaram Mangroves", "url": "https://upload.wikimedia.org/wikipedia/commons/3/33/Pichavaram_mangroves.jpg"},
    {"id": "doddabetta", "label": "Ooty — Doddabetta Peak", "url": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Doddabetta_peak.jpg"},
    {"id": "coonoor", "label": "Coonoor — Tea Estates", "url": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Coonoor_tea_estate.jpg"},
    {"id": "kolli-hills", "label": "Kolli Hills", "url": "https://upload.wikimedia.org/wikipedia/commons/3/36/Kolli_hills.jpg"},
    {"id": "pamban", "label": "Rameswaram — Pamban Bridge", "url": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Pamban_Bridge.jpg"},
]

@travel_bp.route('/catalog', methods=['GET'])
def get_catalog():
    agencies = Agency.query.all()
    guides = Guide.query.all()
    packages = TourPackage.query.all()
    foods = Food.query.all()
    destinations = Destination.query.all()
    features = TravelFeature.query.all()
    return jsonify({
        'agencies': [a.to_dict() for a in agencies],
        'guides': [g.to_dict() for g in guides],
        'packages': [p.to_dict() for p in packages],
        'foods': [f.to_dict() for f in foods],
        'destinations': [d.to_dict() for d in destinations],
        'features': [f.to_dict() for f in features],
        'carousel_images': CAROUSEL_IMAGES
    })

@travel_bp.route('/agencies', methods=['GET'])
def get_agencies():
    agencies = Agency.query.all()
    return jsonify([a.to_dict() for a in agencies])

@travel_bp.route('/agencies/<int:agency_id>', methods=['GET'])
def get_agency(agency_id):
    agency = Agency.query.get_or_404(agency_id)
    return jsonify(agency.to_dict())

@travel_bp.route('/guides', methods=['GET'])
def get_guides():
    guides = Guide.query.all()
    return jsonify([g.to_dict() for g in guides])

@travel_bp.route('/packages', methods=['GET'])
def get_packages():
    packages = TourPackage.query.all()
    return jsonify([p.to_dict() for p in packages])

@travel_bp.route('/foods', methods=['GET'])
def get_foods():
    location = request.args.get('location')
    if location:
        foods = Food.query.filter_by(location=location).all()
    else:
        foods = Food.query.all()
    return jsonify([f.to_dict() for f in foods])

@travel_bp.route('/destinations', methods=['GET'])
def get_destinations():
    category = request.args.get('category')
    if category:
        destinations = Destination.query.filter_by(category=category).all()
    else:
        destinations = Destination.query.all()
    return jsonify([d.to_dict() for d in destinations])

@travel_bp.route('/features', methods=['GET'])
def get_features():
    features = TravelFeature.query.all()
    return jsonify([f.to_dict() for f in features])

@travel_bp.route('/carousel-images', methods=['GET'])
def get_carousel_images():
    return jsonify(CAROUSEL_IMAGES)

from models.ml_service import ml_service

# ML Related routes
@travel_bp.route('/predict-budget', methods=['POST'])
def predict_budget():
    data = request.json
    days = data.get('days', 3)
    persons = data.get('persons', 2)
    comfort = data.get('comfort', 2) # 1: Budget, 2: Standard, 3: Luxury
    
    predicted = ml_service.predict_budget(days, persons, comfort)
    return jsonify({
        'predicted_budget': round(predicted, -2),
        'currency': 'INR'
    })

@travel_bp.route('/recommend-itinerary', methods=['POST'])
def recommend_itinerary():
    data = request.json
    history = data.get('history', 5)
    pref = data.get('preference', 0.5)
    season = data.get('season', 1) # 1: Winter, 2: Summer, 3: Monsoon
    
    recommendation = ml_service.recommend_itinerary(history, pref, season)
    return jsonify({
        'recommendation': recommendation,
        'destinations': ['Madurai', 'Thanjavur', 'Trichy'] if recommendation == "Cultural Heritage Tour" else ['Ooty', 'Kodaikanal', 'Coonoor']
    })
