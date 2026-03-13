import pandas as pd
import os
from datetime import datetime, timedelta

class ChennaiDataProcessor:
    def __init__(self, csv_path=None):
        if csv_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            preferred = os.path.join(base_dir, 'data', 'tamilnadu_attractions.csv')
            fallback = os.path.join(base_dir, 'data', 'chennai_attractions_complete.csv')
            csv_path = preferred if os.path.exists(preferred) else fallback
        
        self.csv_path = csv_path
        self.df = None
    
    def load_data(self):
        """Load attractions dataset"""
        try:
            print(f"📂 Attempting to load dataset from: {self.csv_path}")
            
            if os.path.exists(self.csv_path):
                self.df = pd.read_csv(self.csv_path)
                print(f"✅ Loaded {len(self.df)} attractions from dataset")
                
                # Convert interest columns to boolean if they're strings
                interest_columns = ['Shows and Concerts', 'Scenic', 'Local Experiences', 
                                   'Religious', 'History and Culture', 'Museum', 
                                   'Food and Drinks', 'Adventure', 'Shopping']
                
                for col in interest_columns:
                    if col in self.df.columns:
                        self.df[col] = self.df[col].astype(bool)
                
                return True
            else:
                print(f"❌ Dataset not found at: {self.csv_path}")
                print(f"Current working directory: {os.getcwd()}")
                return False
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
            return False
    
    def get_attractions_by_interests(self, interests):
        """Filter attractions based on user interests"""
        if self.df is None:
            self.load_data()
        if self.df is None:
            return []
        
        filtered_df = self.df.copy()
        
        # If no interests selected, return all
        if not interests:
            return filtered_df.to_dict('records')
        
        # Filter based on interests
        interest_mask = pd.Series([False] * len(filtered_df))
        
        for interest in interests:
            if interest in filtered_df.columns:
                interest_mask |= filtered_df[interest] == True
        
        filtered_df = filtered_df[interest_mask]
        
        # Sort by popularity score
        if 'popularity_score' in filtered_df.columns:
            filtered_df = filtered_df.sort_values('popularity_score', ascending=False)
        
        return filtered_df.to_dict('records')
    
    def get_attractions_by_location(self, location_keyword):
        """Filter attractions based on location keyword"""
        if self.df is None:
            self.load_data()
        if self.df is None:
            return []
        
        location_keyword = location_keyword.lower()
        filtered_df = self.df[
            self.df['POI'].str.lower().str.contains(location_keyword, na=False) |
            self.df['category'].str.lower().str.contains(location_keyword, na=False) |
            self.df['type'].str.lower().str.contains(location_keyword, na=False)
        ]
        
        return filtered_df.to_dict('records')
    
    def generate_daily_itinerary(self, attractions, day_num, start_date, travelers=1):
        """Generate a day plan from attractions"""
        items = []
        
        # Time slots for the day
        time_slots = [
            "9:00 AM – 11:00 AM",
            "11:30 AM – 1:30 PM",
            "2:30 PM – 4:30 PM",
            "5:00 PM – 7:00 PM",
            "7:30 PM – 9:00 PM"
        ]
        
        # Icon mapping
        icon_map = {
            'Beach': '🏖️',
            'Temple': '🛕',
            'Church': '⛪',
            'Heritage': '🏛️',
            'Museum': '🏺',
            'Shopping': '🛍️',
            'Food': '🍛',
            'Nature': '🌿',
            'Adventure': '🎢',
            'Scenic': '🌅',
            'Religious': '🕉️',
            'History': '📜',
            'Culture': '🎭'
        }
        
        for i, attraction in enumerate(attractions[:min(len(attractions), 5)]):
            if i < len(time_slots):
                # Get category for icon
                category = attraction.get('category', 'General')
                icon = icon_map.get(category, '📍')
                
                # Get cost
                entry_fee = attraction.get('entry_fee', 0)
                if entry_fee == 0 or pd.isna(entry_fee):
                    cost_str = "Free"
                else:
                    cost_str = f"₹{entry_fee}"
                
                # Get duration
                duration = attraction.get('avg_duration_mins', 120)
                duration_hours = duration / 60
                
                # Get best time
                best_time = attraction.get('best_time', 'Anytime')
                
                items.append({
                    'time': time_slots[i],
                    'title': attraction['POI'],
                    'description': attraction.get('description', f'Visit {attraction["POI"]}'),
                    'address': attraction.get('address', 'Chennai'),
                    'category': category,
                    'type': attraction.get('type', 'Attraction'),
                    'cost': cost_str,
                    'entry_fee': float(entry_fee) if entry_fee != 0 else 0,
                    'duration': duration_hours,
                    'best_time': best_time,
                    'icon': icon,
                    'tips': self.get_tips_for_category(category),
                    'interests': self.get_interests_for_attraction(attraction)
                })
        
        return items
    
    def get_tips_for_category(self, category):
        """Get tips based on category"""
        tips = {
            'Beach': 'Visit during sunset for best views. Carry sunscreen and water.',
            'Temple': 'Dress modestly. Remove footwear before entering. Photography may be restricted.',
            'Church': 'Maintain silence. Dress respectfully.',
            'Museum': 'Check photography policy. Allow 2-3 hours for full visit.',
            'Shopping': 'Bargain at street markets. Carry small change.',
            'Food': 'Try local specialties. Ask for less spicy if needed.',
            'Nature': 'Carry insect repellent. Best visited in morning.',
            'Heritage': 'Hire a guide for better historical context.',
            'Adventure': 'Wear comfortable clothes. Follow safety instructions.'
        }
        return tips.get(category, 'Check opening hours before visit.')
    
    def get_interests_for_attraction(self, attraction):
        """Get list of interests satisfied by this attraction"""
        interests = []
        interest_cols = ['Shows and Concerts', 'Scenic', 'Local Experiences', 'Religious',
                        'History and Culture', 'Museum', 'Food and Drinks', 'Adventure', 'Shopping']
        
        for col in interest_cols:
            if col in attraction and attraction[col]:
                interests.append(col)
        
        return interests
    
    def calculate_budget(self, attractions, days, travelers, budget_level='mid'):
        """Calculate total budget based on selected level"""
        
        # Budget multipliers by level
        multipliers = {
            'budget': 0.7,
            'mid': 1.0,
            'high': 1.5
        }
        multiplier = multipliers.get(budget_level, 1.0)
        
        # Accommodation costs per day
        hotel_costs = {
            'budget': 1500,
            'mid': 3000,
            'high': 6000
        }
        hotel_cost = hotel_costs.get(budget_level, 3000) * days * travelers
        
        # Food costs per person per day
        food_costs = {
            'budget': 400,
            'mid': 800,
            'high': 1500
        }
        food_cost = food_costs.get(budget_level, 800) * days * travelers
        
        # Transport costs per person per day
        transport_costs = {
            'budget': 200,
            'mid': 500,
            'high': 1000
        }
        transport_cost = transport_costs.get(budget_level, 500) * days * travelers
        
        # Attractions costs
        attractions_cost = sum(a.get('entry_fee', 0) for a in attractions) * travelers
        
        # Apply multiplier
        total = (hotel_cost + food_cost + transport_cost + attractions_cost) * multiplier
        
        return {
            'hotel': int(hotel_cost * multiplier),
            'food': int(food_cost * multiplier),
            'transport': int(transport_cost * multiplier),
            'attractions': int(attractions_cost * multiplier),
            'total': int(total),
            'per_person': int(total / travelers),
            'per_day': int(total / days)
        }
    
    def generate_packing_list(self, attractions, days, season='winter'):
        """Generate packing list based on attractions and season"""
        
        packing_items = set()
        
        # Base essentials for all trips
        base_items = [
            '🪪 Valid ID (Aadhar/Passport)',
            '📱 Smartphone with charger',
            '🔋 Power bank',
            '💧 Reusable water bottle',
            '🧴 Hand sanitizer',
            '😷 Face masks',
            '💰 Cash (₹1000-2000)',
            '💳 Debit/Credit card',
            '💊 Basic medicines (pain reliever, antacids)'
        ]
        
        for item in base_items:
            packing_items.add(item)
        
        # Category-specific items
        for attraction in attractions:
            category = attraction.get('category', '')
            
            if 'Beach' in category:
                packing_items.update([
                    '🧴 Sunscreen SPF 50+',
                    '🕶️ Sunglasses',
                    '👒 Hat or cap',
                    '🩴 Flip-flops',
                    '🌊 Extra clothes (for getting wet)'
                ])
            
            if 'Temple' in category or 'Religious' in category:
                packing_items.update([
                    '👔 Modest clothing (shoulders/knees covered)',
                    '🧦 Extra socks (for removing shoes)',
                    '💰 Small change for offerings'
                ])
            
            if 'Shopping' in category:
                packing_items.update([
                    '🛍️ Reusable shopping bag',
                    '📝 Shopping list',
                    '💳 Multiple payment options'
                ])
            
            if 'Nature' in category:
                packing_items.update([
                    '🧴 Insect repellent',
                    '👟 Comfortable walking shoes',
                    '📷 Camera/binoculars'
                ])
            
            if 'Food' in category:
                packing_items.update([
                    '💊 Digestive enzymes',
                    '🧻 Wet wipes',
                    '🍬 Mints'
                ])
        
        # Season-specific items
        if season.lower() in ['summer', 'hot']:
            packing_items.update([
                '🧴 Extra sunscreen',
                '👕 Light cotton clothes',
                '🧢 Cap/hat',
                '💧 Electrolyte powder'
            ])
        elif season.lower() in ['monsoon', 'rainy']:
            packing_items.update([
                '☔ Umbrella',
                '🧥 Light raincoat',
                '📱 Waterproof phone cover'
            ])
        else:  # winter
            packing_items.update([
                '🧥 Light jacket',
                '🧣 Scarf'
            ])
        
        # Duration-specific items
        if days > 3:
            packing_items.update([
                '🧺 Laundry bag',
                '🧴 Travel-sized detergent'
            ])
        
        return list(packing_items)[:15]  # Return top 15 items

data_processor = ChennaiDataProcessor()
