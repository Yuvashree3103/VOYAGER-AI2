from database import db
from models.travel_models import Agency, Guide, TourPackage, Food, TravelFeature, Destination

def seed_if_empty(app=None):
    if app is None:
        from app import create_app
        app = create_app()
    with app.app_context():
        db.create_all()

        if Agency.query.first() or Guide.query.first() or TourPackage.query.first() or Food.query.first() or TravelFeature.query.first() or Destination.query.first():
            return False

        agencies = [
            Agency(name='Tamil Nadu Explorer Travels', image_url='https://upload.wikimedia.org/wikipedia/commons/9/9b/Marina_Beach_4.jpg', location='Chennai', tour_types='Temple tours,Beach tours,Heritage walks', starting_price=12000, rating=4.8),
            Agency(name='Heritage South India Tours', image_url='https://upload.wikimedia.org/wikipedia/commons/5/5b/Brihadeeswarar_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg', location='Thanjavur', tour_types='Heritage tours,Temple circuits,Museum trails', starting_price=14500, rating=4.7),
            Agency(name='Coastal Tamil Travels', image_url='https://upload.wikimedia.org/wikipedia/commons/7/7b/Shore_Temple%2C_Mahabalipuram.jpg', location='Mahabalipuram', tour_types='Coastal drives,Beach stays,Photography tours', starting_price=9800, rating=4.6),
            Agency(name='Hill Station Escapes', image_url='https://upload.wikimedia.org/wikipedia/commons/6/6e/Ooty_lake.jpg', location='Ooty', tour_types='Hill station tours,Tea estate visits,Easy treks', starting_price=16500, rating=4.7),
            Agency(name='Temple Trails TN', image_url='https://upload.wikimedia.org/wikipedia/commons/7/7c/Ramanathaswamy_Temple.jpg', location='Rameswaram', tour_types='Pilgrimage tours,Temple circuits,Senior-friendly pacing', starting_price=11000, rating=4.8),
            Agency(name='Kanyakumari Sunrise Tours', image_url='https://upload.wikimedia.org/wikipedia/commons/8/82/Kanyakumari_sunrise.jpg', location='Kanyakumari', tour_types='Sunrise tours,Coastal heritage,Weekend getaways', starting_price=9000, rating=4.6),
            Agency(name='Western Ghats Nature Trips', image_url='https://upload.wikimedia.org/wikipedia/commons/8/86/Kodaikanal_Lake.jpg', location='Kodaikanal', tour_types='Nature retreats,Waterfalls,Photography', starting_price=15500, rating=4.7),
            Agency(name='Kanchipuram Silk & Heritage', image_url='https://upload.wikimedia.org/wikipedia/commons/5/59/Kapaleeswarar_Temple_Chennai.jpg', location='Kanchipuram', tour_types='Heritage shopping,Temple visits,Handloom routes', starting_price=8500, rating=4.6),
        ]

        guides = [
            Guide(name='Meena K.', photo_url='https://upload.wikimedia.org/wikipedia/commons/9/9f/Meenakshi_Amman_Temple_gopuram.jpg', languages='Tamil,English,Hindi', service_areas='Madurai,Rameswaram', daily_fee=1500, rating=4.9),
            Guide(name='Arun S.', photo_url='https://upload.wikimedia.org/wikipedia/commons/9/9b/Marina_Beach_4.jpg', languages='Tamil,English', service_areas='Chennai,Mahabalipuram', daily_fee=1800, rating=4.7),
            Guide(name='Nisha P.', photo_url='https://upload.wikimedia.org/wikipedia/commons/1/1c/Coonoor_tea_estate.jpg', languages='Tamil,English,Malayalam', service_areas='Ooty,Coonoor,Kotagiri', daily_fee=2200, rating=4.8),
            Guide(name='Ravi M.', photo_url='https://upload.wikimedia.org/wikipedia/commons/0/0b/Thanjavur_Brihadeeswarar_Temple.jpg', languages='Tamil,English,Hindi', service_areas='Thanjavur,Kumbakonam,Trichy', daily_fee=1700, rating=4.6),
            Guide(name='Divya S.', photo_url='https://upload.wikimedia.org/wikipedia/commons/2/2c/Pamban_Bridge.jpg', languages='Tamil,English,Kannada', service_areas='Rameswaram,Dhanushkodi', daily_fee=2000, rating=4.7),
            Guide(name='Karthik R.', photo_url='https://upload.wikimedia.org/wikipedia/commons/8/82/Kanyakumari_sunrise.jpg', languages='Tamil,English', service_areas='Kanyakumari,Nagercoil', daily_fee=1600, rating=4.6),
            Guide(name='Priya V.', photo_url='https://upload.wikimedia.org/wikipedia/commons/8/86/Kodaikanal_Lake.jpg', languages='Tamil,English,Telugu', service_areas='Kodaikanal,Palani', daily_fee=1900, rating=4.7),
            Guide(name='Suresh K.', photo_url='https://upload.wikimedia.org/wikipedia/commons/7/7b/Shore_Temple%2C_Mahabalipuram.jpg', languages='Tamil,English', service_areas='Kanchipuram,Vellore', daily_fee=1750, rating=4.5),
        ]

        packages = [
            TourPackage(title='Temple Circuit – Madurai & Rameswaram', image_url='https://upload.wikimedia.org/wikipedia/commons/7/7c/Ramanathaswamy_Temple.jpg', duration='3 Days', locations='Madurai,Rameswaram,Dhanushkodi', price_per_person=14999, rating=4.8),
            TourPackage(title='Chennai to Mahabalipuram Coastal Tour', image_url='https://upload.wikimedia.org/wikipedia/commons/7/7b/Shore_Temple%2C_Mahabalipuram.jpg', duration='2 Days', locations='Chennai,Mahabalipuram', price_per_person=8999, rating=4.6),
            TourPackage(title='Ooty Hill Station Escape', image_url='https://upload.wikimedia.org/wikipedia/commons/6/6e/Ooty_lake.jpg', duration='3 Days', locations='Ooty,Coonoor', price_per_person=17999, rating=4.7),
            TourPackage(title='Kodaikanal Nature Retreat', image_url='https://upload.wikimedia.org/wikipedia/commons/8/86/Kodaikanal_Lake.jpg', duration='3 Days', locations='Kodaikanal', price_per_person=16999, rating=4.6),
            TourPackage(title='Kanyakumari Sunrise Special', image_url='https://upload.wikimedia.org/wikipedia/commons/8/82/Kanyakumari_sunrise.jpg', duration='2 Days', locations='Kanyakumari,Vivekananda Rock', price_per_person=9999, rating=4.5),
            TourPackage(title='Thanjavur Heritage Tour', image_url='https://upload.wikimedia.org/wikipedia/commons/5/5b/Brihadeeswarar_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg', duration='3 Days', locations='Thanjavur,Kumbakonam', price_per_person=13500, rating=4.8),
            TourPackage(title='Kanchipuram Silk & Temples Day Trip', image_url='https://upload.wikimedia.org/wikipedia/commons/2/2e/Arunachaleswarar_Temple.jpg', duration='1 Day', locations='Kanchipuram', price_per_person=3999, rating=4.4),
            TourPackage(title='Coimbatore Spiritual + Nature', image_url='https://upload.wikimedia.org/wikipedia/commons/7/72/Adiyogi_Shiva_Coimbatore.jpg', duration='2 Days', locations='Coimbatore,Isha Yoga Center,Marudhamalai', price_per_person=7999, rating=4.5),
            TourPackage(title='Courtallam Waterfalls Weekend', image_url='https://upload.wikimedia.org/wikipedia/commons/2/26/Courtallam_Falls.jpg', duration='2 Days', locations='Tenkasi,Courtallam', price_per_person=6999, rating=4.4),
            TourPackage(title='Trichy & Srirangam Heritage', image_url='https://upload.wikimedia.org/wikipedia/commons/7/78/Rockfort_Temple%2C_Trichy.jpg', duration='2 Days', locations='Trichy,Srirangam', price_per_person=7499, rating=4.6),
            TourPackage(title='Pichavaram Mangroves + Chidambaram', image_url='https://upload.wikimedia.org/wikipedia/commons/3/33/Pichavaram_mangroves.jpg', duration='2 Days', locations='Chidambaram,Pichavaram', price_per_person=8999, rating=4.5),
        ]

        foods = [
            Food(name='Filter Coffee', image_url='https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1200&auto=format&fit=crop', location='Chennai', price_range='₹15–₹120', rating=4.9, description='Iconic filter coffee with a crispy dosa or idli combo.'),
            Food(name='Idli & Sambar', image_url='https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1200&auto=format&fit=crop', location='Chennai', price_range='₹30–₹150', rating=4.8, description='Classic breakfast—best enjoyed early morning at busy tiffin spots.'),
            Food(name='Sundal', image_url='https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1200&auto=format&fit=crop', location='Chennai', price_range='₹20–₹50', rating=4.7, description='Spiced chickpea snack sold near beaches and evening promenades.'),
            Food(name='Kanchipuram Silk Sarees', image_url='https://upload.wikimedia.org/wikipedia/commons/5/5d/Kanchipuram_Silk_Saree.jpg', location='Chennai', price_range='₹2000–₹25000', rating=4.8, description='Famous handloom sarees—check zari quality and origin tags.'),

            Food(name='Jigarthanda', image_url='https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop', location='Madurai', price_range='₹40–₹120', rating=4.8, description='Signature cold dessert drink—perfect after temple walks.'),
            Food(name='Bun Parotta', image_url='https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop', location='Madurai', price_range='₹30–₹80', rating=4.7, description='Soft layered parotta—pair with spicy salna and kurma.'),
            Food(name='Meenakshi Temple Street Snacks', image_url='https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop', location='Madurai', price_range='₹20–₹150', rating=4.6, description='Evening snack trails around temple streets and markets.'),
            Food(name='Banana Leaf Meals', image_url='https://images.unsplash.com/photo-1604908177522-402df02f6b7e?q=80&w=1200&auto=format&fit=crop', location='Madurai', price_range='₹120–₹350', rating=4.7, description='Traditional thali-style meal with local sides and sweets.'),

            Food(name='Ooty Homemade Chocolates', image_url='https://images.unsplash.com/photo-1511381939415-c1cbe9a5c7b3?q=80&w=1200&auto=format&fit=crop', location='Ooty', price_range='₹150–₹600', rating=4.6, description='Popular souvenir—buy from reputed stores for freshness.'),
            Food(name='Nilgiri Tea', image_url='https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=1200&auto=format&fit=crop', location='Ooty', price_range='₹200–₹1200', rating=4.7, description='Tea estates and tasting sessions with scenic viewpoints.'),
            Food(name='Varkey', image_url='https://images.unsplash.com/photo-1548943487-a2e4ad159a6a?q=80&w=1200&auto=format&fit=crop', location='Ooty', price_range='₹50–₹150', rating=4.5, description='Traditional crunchy snack—best with hot tea.'),
            Food(name='Ooty Spices & Oils', image_url='https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200&auto=format&fit=crop', location='Ooty', price_range='₹120–₹900', rating=4.4, description='Clove, cardamom, eucalyptus oil—check sealed packaging.'),

            Food(name='Kanchipuram Silk Sarees', image_url='https://upload.wikimedia.org/wikipedia/commons/5/5d/Kanchipuram_Silk_Saree.jpg', location='Kanchipuram', price_range='₹3000–₹30000', rating=4.9, description='Handloom silk with rich borders—ask for GI-certified pieces.'),
            Food(name='Temple Town Snacks', image_url='https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop', location='Kanchipuram', price_range='₹20–₹200', rating=4.5, description='Light snacks after temple visits—try local sweets and savory.'),
            Food(name='Silk Weaving Workshops', image_url='https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop', location='Kanchipuram', price_range='₹0–₹500', rating=4.4, description='Watch weaving demos; buy directly from cooperatives where possible.'),
            Food(name='Handloom Stoles', image_url='https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop', location='Kanchipuram', price_range='₹300–₹3000', rating=4.3, description='Smaller souvenirs with silk/cotton blends and classic motifs.'),

            Food(name='Tanjore Paintings', image_url='https://upload.wikimedia.org/wikipedia/commons/3/3c/Tanjore_painting.jpg', location='Thanjavur', price_range='₹800–₹20000', rating=4.8, description='Iconic gold-foil paintings—buy from trusted artisans or emporiums.'),
            Food(name='Bronze Icons', image_url='https://upload.wikimedia.org/wikipedia/commons/9/9f/Chola_Bronze.jpg', location='Thanjavur', price_range='₹1500–₹50000', rating=4.6, description='Chola-inspired bronze works—verify authenticity and invoices.'),
            Food(name='Chettinad Cuisine', image_url='https://images.unsplash.com/photo-1604908177522-402df02f6b7e?q=80&w=1200&auto=format&fit=crop', location='Thanjavur', price_range='₹150–₹600', rating=4.7, description='Famous spicy flavors; try vegetarian options too.'),
            Food(name='Thanjavur Art & Craft Souvenirs', image_url='https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop', location='Thanjavur', price_range='₹200–₹8000', rating=4.5, description='Craft markets with paintings, dolls, and traditional decor pieces.'),
        ]

        features = [
            TravelFeature(title='AI Trip Planning', icon='Sparkles', description='Generate day-by-day itineraries for Tamil Nadu based on dates and interests.'),
            TravelFeature(title='Weather Alerts', icon='Cloud', description='Get weather-aware suggestions and quick checks for your destination.'),
            TravelFeature(title='Budget Tracker', icon='Wallet', description='Track daily spending and stay within your planned budget.'),
            TravelFeature(title='Food & Stay Finder', icon='Map', description='Discover food hotspots and stay options aligned with your route.'),
            TravelFeature(title='Safety SOS', icon='Shield', description='Emergency contacts and fast SOS actions with location-first UI.'),
            TravelFeature(title='AI Advisor', icon='MessageCircle', description='Ask anything about Tamil Nadu—routes, tips, local etiquette, and more.'),
            TravelFeature(title='Language Helper', icon='Languages', description='Translate essential phrases for smooth travel conversations.'),
            TravelFeature(title='Smart Packing', icon='Backpack', description='Packing checklist tuned to season, destination and activities.'),
            TravelFeature(title='Group Expense Split', icon='Users', description='Split expenses fairly across friends and family.'),
            TravelFeature(title='Travel Journal', icon='BookOpen', description='Save memories, notes, and photos from your trip.'),
        ]

        destinations = [
            Destination(name='Chennai', image_url='https://upload.wikimedia.org/wikipedia/commons/9/9b/Marina_Beach_4.jpg', description='Beaches, museums, markets, and coastal drives.', category='City'),
            Destination(name='Madurai', image_url='https://upload.wikimedia.org/wikipedia/commons/9/9f/Meenakshi_Amman_Temple_gopuram.jpg', description='Temple city with iconic gopurams and vibrant street food.', category='Temple'),
            Destination(name='Ooty', image_url='https://upload.wikimedia.org/wikipedia/commons/6/6e/Ooty_lake.jpg', description='Nilgiris hill station known for tea estates and cool climate.', category='Hill Station'),
            Destination(name='Thanjavur', image_url='https://upload.wikimedia.org/wikipedia/commons/5/5b/Brihadeeswarar_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg', description='UNESCO temples and classical art heritage.', category='Heritage'),
            Destination(name='Kanyakumari', image_url='https://upload.wikimedia.org/wikipedia/commons/8/82/Kanyakumari_sunrise.jpg', description='Sunrise, sea confluence, and coastal landmarks.', category='Coastal'),
        ]

        db.session.add_all(agencies)
        db.session.add_all(guides)
        db.session.add_all(packages)
        db.session.add_all(foods)
        db.session.add_all(features)
        db.session.add_all(destinations)
        db.session.commit()
        return True

if __name__ == '__main__':
    seeded = seed_if_empty()
    print("✅ Database seeded successfully!" if seeded else "ℹ️ Seed skipped (data already exists).")
