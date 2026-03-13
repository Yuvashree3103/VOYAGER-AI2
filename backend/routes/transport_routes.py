from flask import Blueprint, request, jsonify

transport_bp = Blueprint('transport', __name__)

@transport_bp.route('/select-transport', methods=['POST'])
def select_transport():
    """Select best transport mode"""
    try:
        data = request.json
        
        distance = float(data.get('distance', 10))
        budget = float(data.get('budget', 500))
        group_size = int(data.get('group_size', 2))
        traffic = data.get('traffic', 'Medium')
        urgency = data.get('urgency', 'Medium')
        
        transport_options = {
            'Metro': {'speed': 35, 'base_cost': 40, 'per_km': 5, 'capacity': 200, 'eco': 9},
            'Bus': {'speed': 20, 'base_cost': 20, 'per_km': 3, 'capacity': 50, 'eco': 8},
            'Auto': {'speed': 25, 'base_cost': 50, 'per_km': 15, 'capacity': 3, 'eco': 6},
            'Cab': {'speed': 30, 'base_cost': 100, 'per_km': 12, 'capacity': 4, 'eco': 5},
        }
        
        # Simple rule-based selection
        if distance < 2 and group_size <= 2:
            recommended = 'Auto'
        elif distance < 10:
            recommended = 'Bus' if budget < 200 else 'Metro'
        elif group_size > 3 or urgency == 'High':
            recommended = 'Cab'
        else:
            recommended = 'Metro'
        
        # Calculate time and cost
        traffic_multiplier = {'Low': 0.8, 'Medium': 1.0, 'High': 1.5}.get(traffic, 1.0)
        selected = transport_options[recommended]
        
        time = (distance / selected['speed']) * 60 * traffic_multiplier
        cost = selected['base_cost'] + (selected['per_km'] * distance)
        
        # Get all options
        all_options = []
        for mode, details in transport_options.items():
            mode_time = (distance / details['speed']) * 60 * traffic_multiplier
            mode_cost = details['base_cost'] + (details['per_km'] * distance)
            
            all_options.append({
                'mode': mode,
                'time': round(mode_time, 1),
                'cost': round(mode_cost),
                'eco_score': details['eco'],
                'recommended': mode == recommended
            })
        
        # Sort by combination of time and cost
        all_options.sort(key=lambda x: (x['time'] * 0.4 + x['cost'] * 0.6))
        
        return jsonify({
            'success': True,
            'recommended': recommended,
            'time': round(time, 1),
            'cost': round(cost),
            'all_options': all_options
        })
        
    except Exception as e:
        print(f"Error in select_transport: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500