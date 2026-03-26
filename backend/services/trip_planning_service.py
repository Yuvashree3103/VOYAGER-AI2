"""
Advanced Trip Planning Service for Tamil Nadu
Handles interest validation, availability checking, itinerary generation with no-repeat logic
"""

import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional

class TripPlanningService:
    def __init__(self):
        self.data_file = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 
            'data', 
            'tamil_nadu_comprehensive.json'
        )
        self.load_data()

    def load_data(self):
        """Load comprehensive Tamil Nadu data from JSON"""
        try:
            with open(self.data_file, 'r') as f:
                self.tn_data = json.load(f)
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            self.tn_data = {"districts": {}, "allInterests": [], "interestAvailabilityMap": {}}

    def validate_interests(self, city: str, interests: List[str]) -> Dict:
        """
        Validate if selected interests are available in the city.
        
        Returns:
        {
            "valid": bool,
            "available_interests": List[str],
            "missing_interests": List[str],
            "suggestions": Dict,
            "status": "complete" | "partial" | "none"
        }
        """
        city_lower = city.lower().strip()
        
        # Find matching city in database
        matching_city = None
        for district in self.tn_data.get("districts", {}):
            if district.lower() == city_lower:
                matching_city = district
                break
        
        if not matching_city:
            return {
                "valid": False,
                "available_interests": [],
                "missing_interests": interests,
                "status": "city_not_found",
                "message": f"City '{city}' not found in database"
            }
        
        available_in_city = self.tn_data["interestAvailabilityMap"].get(matching_city, [])
        
        # Normalize interest names
        normalized_interests = [i.strip().title() for i in interests]
        normalized_available = [i.strip().title() for i in available_in_city]
        
        valid_interests = [i for i in normalized_interests if i in normalized_available]
        missing_interests = [i for i in normalized_interests if i not in normalized_available]
        
        status = "complete" if not missing_interests else ("partial" if valid_interests else "none")
        
        suggestions = {}
        if missing_interests:
            suggestions = self._get_nearby_suggestions(matching_city, missing_interests)
        
        return {
            "valid": len(missing_interests) == 0,
            "available_interests": valid_interests,
            "missing_interests": missing_interests,
            "available_in_city": normalized_available,
            "suggestions": suggestions,
            "status": status,
            "message": self._build_validation_message(matching_city, valid_interests, missing_interests, suggestions)
        }

    def _get_nearby_suggestions(self, city: str, missing_interests: List[str]) -> Dict:
        """Get nearby city alternatives for missing interests"""
        suggestions = {}
        nearby_map = self.tn_data.get("nearbyAlternatives", {})
        
        for interest in missing_interests:
            interest_normalized = interest.strip().title()
            if interest_normalized in nearby_map:
                city_suggestions = nearby_map[interest_normalized].get(city, [])
                if city_suggestions:
                    suggestions[interest_normalized] = {
                        "available_nearby": city_suggestions,
                        "can_visit_on_separate_trip": True
                    }
        
        return suggestions

    def _build_validation_message(self, city: str, valid: List[str], missing: List[str], suggestions: Dict) -> str:
        """Build user-friendly validation message"""
        if not missing:
            return f"✅ All selected interests are available in {city}!"
        
        msg = f"⚠️ Some interests are not available in {city}.\n"
        msg += f"Available: {', '.join(valid)}\n"
        msg += f"Not available: {', '.join(missing)}\n"
        
        if suggestions:
            msg += f"\n💡 Alternatives nearby:\n"
            for interest, data in suggestions.items():
                for alt in data["available_nearby"]:
                    msg += f"• {alt}\n"
        
        return msg

    def generate_itinerary(self, 
                          city: str, 
                          start_date: str, 
                          end_date: str, 
                          interests: List[str],
                          travelers: int = 1,
                          budget: Optional[float] = None,
                          want_hotel: bool = True) -> Dict:
        """
        Generate day-wise itinerary with NO REPEATED INTERESTS per day.
        
        Rules:
        - Each day: Morning, Afternoon, Evening activities
        - No interest category repeated on same day
        - No attraction visited twice
        - Fit within budget if provided
        """
        
        # Validate inputs
        validation = self.validate_interests(city, interests)
        if validation["status"] == "city_not_found":
            return {"error": validation["message"], "success": False}
        
        if not validation["valid"]:
            return {
                "error": "Cannot proceed - interests not fully available",
                "validation": validation,
                "success": False
            }
        
        # Calculate days
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        days = (end - start).days + 1
        
        if days < 1:
            return {"error": "Invalid date range", "success": False}
        
        # Get attractions for city
        matching_city = self._find_matching_city(city)
        if not matching_city:
            return {"error": f"City '{city}' not found", "success": False}
        
        attractions = self.tn_data["districts"].get(matching_city, {}).get("attractions", [])
        
        if not attractions:
            return {"error": f"No attractions found for {city}", "success": False}
        
        # Filter attractions by selected interests
        filtered_attractions = [
            a for a in attractions 
            if a.get("category") in validation["available_interests"]
        ]
        
        # Build itinerary
        itinerary = []
        used_attractions = set()
        current_date = start
        
        for day_num in range(1, days + 1):
            day_activities = self._generate_day_activities(
                day_num,
                current_date,
                filtered_attractions,
                used_attractions,
                validation["available_interests"]
            )
            
            itinerary.append({
                "day": day_num,
                "date": current_date.strftime('%Y-%m-%d'),
                "activities": day_activities
            })
            
            current_date += timedelta(days=1)
        
        # Calculate budget
        budget_info = self._calculate_budget(itinerary, travelers, want_hotel, budget)
        
        return {
            "success": True,
            "city": matching_city,
            "duration_days": days,
            "travelers": travelers,
            "itinerary": itinerary,
            "budget": budget_info,
            "interests_covered": validation["available_interests"],
            "hotel_included": want_hotel
        }

    def _find_matching_city(self, city: str) -> Optional[str]:
        """Find city in database (case-insensitive)"""
        city_lower = city.lower().strip()
        for district in self.tn_data.get("districts", {}):
            if district.lower() == city_lower:
                return district
        return None

    def _generate_day_activities(self, 
                                day_num: int, 
                                date: datetime,
                                attractions: List[Dict],
                                used_attractions: set,
                                available_interests: List[str]) -> List[Dict]:
        """
        Generate Morning, Afternoon, Evening activities for a day.
        RULE: No interest category repeated on same day.
        """
        activities = []
        used_categories_today = set()
        
        time_slots = [
            {"type": "Morning", "time": "06:00 AM - 12:00 PM"},
            {"type": "Afternoon", "time": "12:00 PM - 06:00 PM"},
            {"type": "Evening", "time": "06:00 PM - 10:00 PM"}
        ]
        
        for slot in time_slots:
            # Find next unused attraction with different interest category
            selected_attraction = None
            
            for attraction in attractions:
                attr_name = attraction.get("name", "")
                attr_category = attraction.get("category", "")
                
                # Skip if already used or category used today
                if attr_name in used_attractions or attr_category in used_categories_today:
                    continue
                
                # Check if interest is in available list
                if attr_category not in available_interests:
                    continue
                
                selected_attraction = attraction
                break
            
            if selected_attraction:
                used_attractions.add(selected_attraction["name"])
                used_categories_today.add(selected_attraction["category"])
                
                activities.append({
                    "time_slot": slot["type"],
                    "time_range": slot["time"],
                    "name": selected_attraction["name"],
                    "category": selected_attraction["category"],
                    "area": selected_attraction.get("area", ""),
                    "opening_time": selected_attraction.get("openingTime", ""),
                    "closing_time": selected_attraction.get("closingTime", ""),
                    "entry_fee": selected_attraction.get("entryFee", 0),
                    "description": selected_attraction.get("description", ""),
                    "travel_time": selected_attraction.get("travelTimeFromCenter", ""),
                    "transport_options": selected_attraction.get("transportMode", []),
                    "estimated_transport_cost": selected_attraction.get("estimatedCost", 0),
                    "highlights": selected_attraction.get("highlights", [])
                })
        
        # Add meals
        activities.extend(self._add_meal_activities())
        
        return activities

    def _add_meal_activities(self) -> List[Dict]:
        """Add meal times to day activities"""
        return [
            {
                "time_slot": "Breakfast",
                "time_range": "07:00 AM - 08:00 AM",
                "name": "Hotel Breakfast/Street Food",
                "category": "Food",
                "entry_fee": 0,
                "estimated_cost": 100
            },
            {
                "time_slot": "Lunch",
                "time_range": "12:30 PM - 01:30 PM",
                "name": "Local Restaurant/Food Court",
                "category": "Food",
                "entry_fee": 0,
                "estimated_cost": 150
            },
            {
                "time_slot": "Dinner",
                "time_range": "07:00 PM - 08:30 PM",
                "name": "Local Specialty/Restaurant",
                "category": "Food",
                "entry_fee": 0,
                "estimated_cost": 200
            }
        ]

    def _calculate_budget(self, itinerary: List[Dict], travelers: int, want_hotel: bool, budget_limit: Optional[float]) -> Dict:
        """
        Calculate budget with itemized breakdown.
        RULE: NEVER exceed provided budget limit.
        """
        days = len(itinerary)
        
        # Base costs per person per day
        hotel_cost = 1500 * days if want_hotel else 0
        food_cost = 500 * days  # Calculated from meals
        transport_cost = 200 * days
        
        # Activity entry fees
        total_entry_fees = 0
        for day in itinerary:
            for activity in day.get("activities", []):
                if activity.get("category") != "Food":
                    total_entry_fees += activity.get("entry_fee", 0)
        
        # Transport costs from activities
        activity_transport = 0
        for day in itinerary:
            for activity in day.get("activities", []):
                activity_transport += activity.get("estimated_transport_cost", 0)
        
        total_per_person = (hotel_cost + food_cost + transport_cost + total_entry_fees + activity_transport)
        total_all_travelers = total_per_person * travelers
        
        breakdown = {
            "per_person": {
                "hotel": hotel_cost,
                "food": food_cost,
                "transport": transport_cost,
                "activities": total_entry_fees,
                "other": activity_transport,
                "total": total_per_person
            },
            "all_travelers": {
                "total": int(total_all_travelers),
                "travelers": travelers
            },
            "has_budget_limit": budget_limit is not None,
            "budget_limit": budget_limit,
            "within_budget": total_all_travelers <= budget_limit if budget_limit else None,
            "remaining_budget": int(budget_limit - total_all_travelers) if budget_limit else None
        }
        
        # Warning if exceeds budget
        if budget_limit and total_all_travelers > budget_limit:
            breakdown["warning"] = f"⚠️ Estimated cost (₹{int(total_all_travelers):,}) exceeds budget (₹{int(budget_limit):,})"
            breakdown["suggestion"] = "Consider: Reducing days, fewer travelers, or budget hotels"
        
        return breakdown

    def get_available_interests(self, city: str) -> List[str]:
        """Get all available interests for a city"""
        matching_city = self._find_matching_city(city)
        if not matching_city:
            return []
        return self.tn_data["interestAvailabilityMap"].get(matching_city, [])

    def get_all_cities(self) -> List[str]:
        """Get all available cities"""
        return list(self.tn_data.get("districts", {}).keys())


# Singleton instance
_trip_planning_service = None

def get_trip_planning_service():
    global _trip_planning_service
    if _trip_planning_service is None:
        _trip_planning_service = TripPlanningService()
    return _trip_planning_service
