from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_processor import data_processor

planner_bp = Blueprint('planner_routes', __name__)

@planner_bp.route('/generate-complete-plan', methods=['POST'])
def generate_complete_plan():
    """Generate complete trip plan with itinerary, budget, and packing"""
    try:
        data = request.json
        
        # Extract user inputs
        trip_name = data.get('tripName', 'My Chennai Trip')
        location = data.get('location', 'Chennai')
        start_date = data.get('startDate')
        end_date = data.get('endDate')
        budget_level = data.get('budgetLevel', 'mid')  # budget, mid, high
        travelers = int(data.get('travelers', 2))
        interests = data.get('interests', [])
        season = data.get('season', 'winter')
        
        # Calculate days
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        days = (end - start).days + 1
        
        # Get attractions based on location and interests
        location_attractions = data_processor.get_attractions_by_location(location)
        interest_attractions = data_processor.get_attractions_by_interests(interests)
        
        # Combine and deduplicate
        all_attractions = []
        seen = set()
        
        for attr in interest_attractions + location_attractions:
            if attr['POI'] not in seen:
                all_attractions.append(attr)
                seen.add(attr['POI'])
        
        # If no attractions found, use all attractions
        if not all_attractions and data_processor.df is not None:
            all_attractions = data_processor.df.head(10).to_dict('records')
        
        # Generate daily itinerary
        itinerary = []
        attractions_per_day = max(2, min(4, len(all_attractions) // days))
        
        for day in range(1, days + 1):
            start_idx = (day - 1) * attractions_per_day
            end_idx = min(start_idx + attractions_per_day, len(all_attractions))
            day_attractions = all_attractions[start_idx:end_idx]
            
            if not day_attractions:
                day_attractions = all_attractions[:attractions_per_day]
            
            day_items = data_processor.generate_daily_itinerary(
                day_attractions, day, start_date, travelers
            )
            
            # Calculate daily cost
            daily_cost = sum(
                item['entry_fee'] * travelers 
                for item in day_items 
                if item['entry_fee'] > 0
            )
            
            itinerary.append({
                'day': day,
                'date': (start + timedelta(days=day-1)).strftime('%Y-%m-%d'),
                'theme': f'Day {day} in {location.title()}',
                'items': day_items,
                'daily_cost': daily_cost
            })
        
        # Calculate budget
        budget = data_processor.calculate_budget(
            all_attractions, days, travelers, budget_level
        )
        
        # Generate packing list
        packing_list = data_processor.generate_packing_list(
            all_attractions, days, season
        )
        
        # Get special finds and recommendations
        special_finds = []
        for attr in all_attractions[:5]:
            interests_list = data_processor.get_interests_for_attraction(attr)
            if interests_list:
                special_finds.append({
                    'name': attr['POI'],
                    'category': attr.get('category', ''),
                    'description': attr.get('description', '')[:100],
                    'interests': interests_list,
                    'best_time': attr.get('best_time', 'Anytime')
                })
        
        return jsonify({
            'success': True,
            'plan': {
                'trip_name': trip_name,
                'location': location,
                'start_date': start_date,
                'end_date': end_date,
                'days': days,
                'travelers': travelers,
                'budget_level': budget_level,
                'itinerary': itinerary,
                'budget': budget,
                'packing_list': packing_list,
                'special_finds': special_finds,
                'total_attractions': len(all_attractions),
                'recommendations': [
                    f"Best time to visit: {all_attractions[0].get('best_time', 'Anytime')}" if all_attractions else "",
                    f"Top rated: {all_attractions[0].get('POI', '')}" if all_attractions else "",
                    f"Hidden gem: {all_attractions[-1].get('POI', '')}" if len(all_attractions) > 1 else ""
                ]
            }
        })
        
    except Exception as e:
        print(f"❌ Error in generate_complete_plan: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@planner_bp.route('/get-attractions', methods=['POST'])
def get_attractions():
    """Get attractions based on filters"""
    try:
        data = request.json
        location = data.get('location', '')
        interests = data.get('interests', [])
        
        attractions = []
        if location:
            attractions.extend(data_processor.get_attractions_by_location(location))
        if interests:
            attractions.extend(data_processor.get_attractions_by_interests(interests))
        
        # Deduplicate
        seen = set()
        unique_attractions = []
        for attr in attractions:
            if attr['POI'] not in seen:
                unique_attractions.append(attr)
                seen.add(attr['POI'])
        
        return jsonify({
            'success': True,
            'attractions': unique_attractions[:20],
            'count': len(unique_attractions)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500