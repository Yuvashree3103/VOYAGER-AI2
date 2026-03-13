from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
from config import Config
import sqlite3
import os

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# Database setup
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Auth database initialized")

init_db()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            current_user = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # Validate input
        if not username or not email or not password:
            return jsonify({'message': 'Missing required fields'}), 400
        
        if len(password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters'}), 400
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Save to database
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        
        try:
            c.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                     (username, email, hashed_password))
            conn.commit()
            user_id = c.lastrowid
            
            # Generate token
            token = jwt.encode({
                'user_id': user_id,
                'username': username,
                'exp': datetime.utcnow() + timedelta(days=7)
            }, Config.SECRET_KEY, algorithm='HS256')
            
            return jsonify({
                'message': 'User created successfully',
                'token': token,
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': email
                }
            }), 201
            
        except sqlite3.IntegrityError as e:
            if 'username' in str(e):
                return jsonify({'message': 'Username already exists'}), 400
            elif 'email' in str(e):
                return jsonify({'message': 'Email already exists'}), 400
            else:
                return jsonify({'message': 'Database error'}), 400
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Missing username or password'}), 400
        
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        
        # Find user by username or email
        c.execute('SELECT * FROM users WHERE username = ? OR email = ?', (username, username))
        user = c.fetchone()
        conn.close()
        
        if user and bcrypt.check_password_hash(user[3], password):
            # Generate token
            token = jwt.encode({
                'user_id': user[0],
                'username': user[1],
                'exp': datetime.utcnow() + timedelta(days=7)
            }, Config.SECRET_KEY, algorithm='HS256')
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2]
                }
            })
        
        return jsonify({'message': 'Invalid credentials'}), 401
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', (current_user,))
        user = c.fetchone()
        conn.close()
        
        if user:
            return jsonify({
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'created_at': user[3]
            })
        
        return jsonify({'message': 'User not found'}), 404
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    """Verify if token is valid"""
    return jsonify({'valid': True, 'user_id': current_user})