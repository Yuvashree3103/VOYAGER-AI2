"""
Advanced Trip Planner Routes
Handles complete trip planning with validation, suggestions, and budget-strict itinerary generation
"""

from flask import Blueprint, request, jsonify
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.trip_planning_service import get_trip_planning_service

advanced_planner_bp = Blueprint('advanced_planner', __name__)

@advanced_planner_bp.route('/plan-trip-v2', methods=['POST', 'OPTIONS'])
def plan_trip_v2():
    """
    Advanced trip planning endpoint with full validation and no-repeat interest logic
    
    Request body:
    {
        "city": "Chennai",
        "startDate": "2024-03-20",
        "endDate": "2024-03-25",
        "interests": ["Temple", "Beach"],
        "travelers": 2,
        "budget": 30000,
        "wantHotel": true
    }
    
    Response: Complete itinerary with validation, budget breakdown, day-wise activities
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        service = get_trip_planning_service()
        
        # Extract parameters
        city = data.get('city', '').strip()
        start_date = data.get('startDate', '')
        end_date = data.get('endDate', '')
        interests = data.get('interests', [])
        travelers = int(data.get('travelers', 1))
        budget = data.get('budget')
        want_hotel = data.get('wantHotel', True)
        
        # Convert budget to float if provided
        if budget:
            try:
                budget = float(budget)
            except:
                budget = None
        
        # Validate required fields
        if not city:
            return jsonify({"error": "City is required", "success": False}), 400
        
        if not start_date or not end_date:
            return jsonify({"error": "Start and end dates are required", "success": False}), 400
        
        if not interests or len(interests) == 0:
            return jsonify({"error": "At least one interest must be selected", "success": False}), 400
        
        # Step 1: Validate interests availability
        validation = service.validate_interests(city, interests)
        
        if validation["status"] in ["city_not_found", "none"]:
            return jsonify({
                "success": False,
                "step": "validation_failed",
                "message": validation["message"],
                "validation": validation,
                "available_interests": service.get_available_interests(city) if validation["status"] == "none" else []
            }), 400
        
        if validation["status"] == "partial":
            # Partial match - user can proceed or select alternatives
            return jsonify({
                "success": False,
                "step": "validation_partial",
                "message": "Some interests are not available. Please review suggestions.",
                "validation": validation,
                "available_in_city": validation["available_in_city"],
                "available_interests": service.get_available_interests(city),
                "can_proceed_with_available": True
            }), 200
        
        # If we get here, validation is complete
        print(f"✅ Interest validation passed for {city}")
        
        # Step 2: Generate itinerary
        itinerary_result = service.generate_itinerary(
            city=city,
            start_date=start_date,
            end_date=end_date,
            interests=validation["available_interests"],
            travelers=travelers,
            budget=budget,
            want_hotel=want_hotel
        )
        
        if not itinerary_result.get("success"):
            return jsonify({
                "success": False,
                "error": itinerary_result.get("error", "Failed to generate itinerary")
            }), 400
        
        # Step 3: Return complete itinerary
        return jsonify({
            "success": True,
            "step": "itinerary_generated",
            "trip": itinerary_result,
            "summary": {
                "city": itinerary_result["city"],
                "duration": f"{itinerary_result['duration_days']} days",
                "travelers": travelers,
                "interests": itinerary_result["interests_covered"],
                "hotel_included": itinerary_result["hotel_included"],
                "estimated_total": f"₹{itinerary_result['budget']['all_travelers']['total']:,}",
                "budget_status": itinerary_result["budget"]["within_budget"] if itinerary_result["budget"]["has_budget_limit"] else "No limit",
                "warning": itinerary_result["budget"].get("warning")
            }
        }), 200
    
    except Exception as e:
        print(f"❌ Error in plan_trip_v2: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@advanced_planner_bp.route('/validate-interests', methods=['POST', 'OPTIONS'])
def validate_interests():
    """
    Validate if selected interests are available in the chosen city
    
    Request body:
    {
        "city": "Chennai",
        "interests": ["Temple", "Beach", "Waterfall"]
    }
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        service = get_trip_planning_service()
        
        city = data.get('city', '').strip()
        interests = data.get('interests', [])
        
        if not city:
            return jsonify({"error": "City is required"}), 400
        
        if not interests:
            return jsonify({"error": "Interests array is required"}), 400
        
        validation = service.validate_interests(city, interests)
        
        return jsonify({
            "success": True,
            "validation": validation,
            "available_in_city": service.get_available_interests(city)
        }), 200
    
    except Exception as e:
        print(f"❌ Error in validate_interests: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_planner_bp.route('/cities', methods=['GET'])
def get_cities():
    """Get all available cities for trip planning"""
    try:
        service = get_trip_planning_service()
        cities = service.get_all_cities()
        
        return jsonify({
            "success": True,
            "cities": cities,
            "count": len(cities)
        }), 200
    
    except Exception as e:
        print(f"❌ Error in get_cities: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_planner_bp.route('/interests/<city>', methods=['GET'])
def get_interests(city):
    """Get available interests for a specific city"""
    try:
        service = get_trip_planning_service()
        interests = service.get_available_interests(city)
        
        if not interests:
            return jsonify({
                "success": False,
                "error": f"City '{city}' not found",
                "available_cities": service.get_all_cities()
            }), 404
        
        return jsonify({
            "success": True,
            "city": city,
            "interests": interests,
            "count": len(interests)
        }), 200
    
    except Exception as e:
        print(f"❌ Error in get_interests: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_planner_bp.route('/budget-estimate', methods=['POST', 'OPTIONS'])
def budget_estimate():
    """
    Get quick budget estimate before generating full itinerary
    
    Request body:
    {
        "duration_days": 3,
        "travelers": 2,
        "want_hotel": true
    }
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        days = int(data.get('duration_days', 1))
        travelers = int(data.get('travelers', 1))
        want_hotel = data.get('want_hotel', True)
        
        # Simple estimation
        hotel = 1500 * days if want_hotel else 0
        food = 500 * days
        transport = 200 * days
        activities = 300 * days
        
        per_person = hotel + food + transport + activities
        total = per_person * travelers
        
        return jsonify({
            "success": True,
            "estimate": {
                "per_person": {
                    "hotel": hotel,
                    "food": food,
                    "transport": transport,
                    "activities": activities,
                    "total": per_person
                },
                "all_travelers": {
                    "total": total,
                    "travelers": travelers
                },
                "breakdown_text": f"Estimated ₹{total:,} for {travelers} traveler(s) for {days} day(s)"
            }
        }), 200
    
    except Exception as e:
        print(f"❌ Error in budget_estimate: {e}")
        return jsonify({"error": str(e)}), 500
