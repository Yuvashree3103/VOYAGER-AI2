import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

class XGBoostTripPlanner:
    def __init__(self, model_path='models/xgboost_trip.pkl'):
        self.model_path = model_path
        self.model = None
        self.label_encoders = {}
        self.feature_columns = None
        self.attractions_df = None
        
    def prepare_dataset(self, csv_path='datasets/chennai_attractions_complete.csv'):
        """Load and prepare your dataset for training"""
        print("📊 Loading dataset...")
        
        # Load your dataset
        self.attractions_df = pd.read_csv(csv_path)
        print(f"✅ Loaded {len(self.attractions_df)} attractions")
        
        # Create a copy for feature engineering
        df = self.attractions_df.copy()
        
        # Create interest scores (1-5 scale from your dataset)
        interest_cols = ['Shows and Concerts', 'Scenic', 'Local Experiences', 
                        'Religious', 'History and Culture', 'Museum', 
                        'Food and Drinks', 'Adventure', 'Shopping']
        
        # Convert interest columns to numeric
        for col in interest_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
        # Create target score based on popularity and interests
        df['target_score'] = (
            df['popularity_score'] * 0.4 +  # 40% weight to popularity
            df[interest_cols].sum(axis=1) * 0.3 +  # 30% weight to interests
            np.random.normal(0, 0.5, len(df))  # Add some noise
        )
        
        # Encode categorical features
        categorical_cols = ['category', 'type']
        for col in categorical_cols:
            if col in df.columns:
                self.label_encoders[col] = LabelEncoder()
                df[col + '_encoded'] = self.label_encoders[col].fit_transform(df[col].fillna('Unknown'))
        
        # Feature columns for training
        self.feature_columns = [
            'entry_fee', 'avg_duration_mins', 'popularity_score',
            'Shows and Concerts', 'Scenic', 'Local Experiences',
            'Religious', 'History and Culture', 'Museum',
            'Food and Drinks', 'Adventure', 'Shopping'
        ] + [col + '_encoded' for col in categorical_cols if col + '_encoded' in df.columns]
        
        # Prepare features
        X = df[self.feature_columns].fillna(0)
        y = df['target_score']
        
        return X, y
    
    def train(self):
        """Train XGBoost model"""
        print("🚀 Training XGBoost model...")
        
        X, y = self.prepare_dataset()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Initialize XGBoost model
        self.model = xgb.XGBRegressor(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            objective='reg:squarederror'
        )
        
        # Train model
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=False
        )
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        print(f"📈 Train R²: {train_score:.3f}")
        print(f"📈 Test R²: {test_score:.3f}")
        
        # Feature importance
        importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n🔝 Top 5 Important Features:")
        print(importance.head(5).to_string(index=False))
        
        # Save model
        os.makedirs('models', exist_ok=True)
        joblib.dump({
            'model': self.model,
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns
        }, self.model_path)
        
        print(f"💾 Model saved to {self.model_path}")
        
        return self.model
    
    def load_model(self):
        """Load trained model"""
        if os.path.exists(self.model_path):
            data = joblib.load(self.model_path)
            self.model = data['model']
            self.label_encoders = data['label_encoders']
            self.feature_columns = data['feature_columns']
            print("✅ Model loaded successfully")
            return True
        return False
    
    def recommend_attractions(self, user_interests, budget_level='mid', duration_days=1, top_k=10):
        """Get personalized recommendations using XGBoost"""
        
        if self.model is None:
            if not self.load_model():
                print("⚠️ Model not found. Training new model...")
                self.train()
        
        # Prepare user interest vector
        interest_cols = ['Shows and Concerts', 'Scenic', 'Local Experiences', 
                        'Religious', 'History and Culture', 'Museum', 
                        'Food and Drinks', 'Adventure', 'Shopping']
        
        # Create a copy of attractions
        df = self.attractions_df.copy()
        
        # Convert interest columns to numeric
        for col in interest_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
        # Boost scores based on user interests
        for interest in user_interests:
            if interest in df.columns:
                df[interest] = df[interest] * 1.5  # Boost matching interests
        
        # Encode categorical features
        for col in ['category', 'type']:
            if col in df.columns and col in self.label_encoders:
                df[col + '_encoded'] = self.label_encoders[col].transform(
                    df[col].fillna('Unknown').astype(str)
                )
        
        # Prepare features for prediction
        X_pred = df[self.feature_columns].fillna(0)
        
        # Get predictions
        predictions = self.model.predict(X_pred)
        
        # Add predictions to dataframe
        df['xgboost_score'] = predictions
        
        # Filter by budget if needed
        budget_multipliers = {'budget': 0.5, 'mid': 1.0, 'high': 1.5}
        max_entry_fee = 500 * budget_multipliers.get(budget_level, 1.0) * duration_days
        
        filtered_df = df[df['entry_fee'] <= max_entry_fee]
        
        # Sort by XGBoost score
        recommendations = filtered_df.sort_values('xgboost_score', ascending=False).head(top_k)
        
        return recommendations.to_dict('records')
    
    def generate_itinerary(self, recommendations, days):
        """Generate day-wise itinerary from recommendations"""
        itinerary = []
        attractions_per_day = max(2, min(4, len(recommendations) // days))
        
        for day in range(1, days + 1):
            start_idx = (day - 1) * attractions_per_day
            end_idx = min(start_idx + attractions_per_day, len(recommendations))
            day_attractions = recommendations[start_idx:end_idx]
            
            if not day_attractions:
                break
            
            day_items = []
            total_cost = 0
            total_duration = 0
            
            for i, attr in enumerate(day_attractions):
                # Determine time slot based on best_time
                best_time = attr.get('best_time', 'Morning').lower()
                if 'evening' in best_time:
                    time_slot = f"{5 + i}:00 PM – {7 + i}:00 PM"
                elif 'afternoon' in best_time:
                    time_slot = f"{1 + i}:00 PM – {3 + i}:00 PM"
                else:
                    time_slot = f"{9 + i}:00 AM – {11 + i}:00 AM"
                
                # Icon mapping
                icon_map = {
                    'Beach': '🏖️', 'Temple': '🛕', 'Church': '⛪',
                    'Heritage': '🏛️', 'Museum': '🏺', 'Shopping': '🛍️',
                    'Food': '🍛', 'Nature': '🌿', 'Adventure': '🎢',
                    'Scenic': '🌅', 'Religious': '🕉️'
                }
                icon = icon_map.get(attr.get('category', ''), '📍')
                
                day_items.append({
                    'time': time_slot,
                    'title': attr['POI'],
                    'description': attr.get('description', '')[:100],
                    'address': f"{attr.get('latitude', '')}, {attr.get('longitude', '')}",
                    'category': attr.get('category', ''),
                    'cost': 'Free' if attr['entry_fee'] == 0 else f"₹{attr['entry_fee']}",
                    'entry_fee': attr['entry_fee'],
                    'duration': attr['avg_duration_mins'] / 60,
                    'best_time': attr.get('best_time', 'Anytime'),
                    'icon': icon,
                    'interests': [col for col in interest_cols if attr.get(col, 0) > 3]
                })
                
                total_cost += attr['entry_fee']
                total_duration += attr['avg_duration_mins']
            
            itinerary.append({
                'day': day,
                'theme': self.get_day_theme(day_attractions),
                'items': day_items,
                'total_cost': total_cost,
                'total_duration_hours': total_duration / 60
            })
        
        return itinerary
    
    def get_day_theme(self, attractions):
        """Determine theme of the day based on attractions"""
        categories = [a.get('category', '') for a in attractions]
        if 'Beach' in categories:
            return 'Beach Day'
        elif 'Temple' in categories or 'Religious' in categories:
            return 'Temple Tour'
        elif 'Shopping' in categories:
            return 'Shopping Spree'
        elif 'Museum' in categories or 'Heritage' in categories:
            return 'Heritage & Culture'
        elif 'Nature' in categories:
            return 'Nature Exploration'
        else:
            return 'Chennai Discovery'
    
    def calculate_budget(self, recommendations, days, travelers, budget_level='mid'):
        """Calculate total trip budget"""
        multipliers = {'budget': 0.7, 'mid': 1.0, 'high': 1.5}
        multiplier = multipliers.get(budget_level, 1.0)
        
        # Hotel costs per day
        hotel_costs = {'budget': 1500, 'mid': 3000, 'high': 6000}
        hotel_cost = hotel_costs.get(budget_level, 3000) * days * travelers
        
        # Food costs per person per day
        food_costs = {'budget': 400, 'mid': 800, 'high': 1500}
        food_cost = food_costs.get(budget_level, 800) * days * travelers
        
        # Transport costs
        transport_costs = {'budget': 200, 'mid': 500, 'high': 1000}
        transport_cost = transport_costs.get(budget_level, 500) * days * travelers
        
        # Attractions cost
        attractions_cost = sum(a['entry_fee'] for a in recommendations) * travelers
        
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
    
    def generate_packing_list(self, recommendations, days, season='winter'):
        """Generate smart packing list"""
        packing_items = set()
        
        # Base items
        base_items = [
            '🪪 Valid ID (Aadhar/Passport)',
            '📱 Smartphone with charger',
            '🔋 Power bank',
            '💧 Reusable water bottle',
            '🧴 Hand sanitizer',
            '💰 Cash (₹1000-2000)',
            '💳 Debit/Credit card',
            '💊 Basic medicines'
        ]
        
        for item in base_items:
            packing_items.add(item)
        
        # Category-specific items
        for attr in recommendations:
            category = attr.get('category', '')
            
            if 'Beach' in category:
                packing_items.update(['🧴 Sunscreen', '🕶️ Sunglasses', '👒 Hat', '🩴 Flip-flops'])
            if 'Temple' in category or 'Religious' in category:
                packing_items.update(['👔 Modest clothing', '🧦 Extra socks'])
            if 'Shopping' in category:
                packing_items.update(['🛍️ Shopping bag', '💳 Multiple cards'])
            if 'Nature' in category:
                packing_items.update(['🧴 Insect repellent', '👟 Walking shoes'])
        
        # Season-specific
        if season == 'summer':
            packing_items.update(['🧴 Extra sunscreen', '👕 Light clothes', '🧢 Cap'])
        elif season == 'monsoon':
            packing_items.update(['☔ Umbrella', '🧥 Raincoat'])
        else:
            packing_items.update(['🧥 Light jacket', '🧣 Scarf'])
        
        return list(packing_items)[:12]

# Create global instance
xgboost_planner = XGBoostTripPlanner()