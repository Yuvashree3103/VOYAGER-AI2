from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from database import db
from flask_bcrypt import Bcrypt
from config import Config
import os
from datetime import datetime

# db = SQLAlchemy() # Removed
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # FIXED CORS - Allow localhost on any dev port
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    r"http://localhost:\d+",
                    r"http://127\.0\.0\.1:\d+",
                    r"http://10\.\d+\.\d+\.\d+:\d+",
                    r"http://192\.168\.\d+\.\d+:\d+",
                    r"http://172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+",
                ]
            }
        },
        supports_credentials=True,
    )
    
    db.init_app(app)
    bcrypt.init_app(app)
    
    # Import routes
    from routes.auth_routes import auth_bp
    from routes.ai_routes import ai_bp
    from routes.trip_planner_routes import trip_planner_bp
    from routes.travel_routes import travel_bp
    from routes.services_routes import services_bp
    from routes.emergency_routes import emergency_bp
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(ai_bp, url_prefix='/api', name='ai_assistant')
    app.register_blueprint(trip_planner_bp, url_prefix='/api', name='trip_planner')
    app.register_blueprint(travel_bp, url_prefix='/api')
    app.register_blueprint(services_bp, url_prefix='/api')
    app.register_blueprint(emergency_bp, url_prefix='/api')
    
    with app.app_context():
        db.create_all()
        try:
            from seed_data import seed_if_empty
            seed_if_empty(app)
        except Exception:
            pass

    @app.route('/', methods=['GET'])
    def index():
        best = request.accept_mimetypes.best_match(['text/html', 'application/json'])
        if best == 'text/html' and request.accept_mimetypes[best] > request.accept_mimetypes['application/json']:
            frontend_base = os.getenv('FRONTEND_URL', 'http://localhost:5173').rstrip('/')
            return redirect(f"{frontend_base}/", code=302)
        return jsonify({
            'service': 'Voyager AI Backend',
            'status': 'running',
            'health': '/api/health',
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/<path:path>', methods=['GET'])
    def redirect_non_api_paths(path):
        if path.startswith('api/'):
            return jsonify({'error': 'Not Found'}), 404
        frontend_base = os.getenv('FRONTEND_URL', 'http://localhost:5173').rstrip('/')
        query = request.query_string.decode()
        target_url = f"{frontend_base}/{path}"
        if query:
            target_url = f"{target_url}?{query}"
        return redirect(target_url, code=302)
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'cors': 'enabled'
        })
    
    # Add OPTIONS handler for preflight requests
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Voyager AI Server Starting...")
    print(f"📁 Current directory: {os.getcwd()}")
    app.run(debug=True, host='0.0.0.0', port=5000)
