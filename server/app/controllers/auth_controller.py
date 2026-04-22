from flask import request, jsonify
from app import db
from app.models.user_model import User
from flask_jwt_extended import create_access_token
from datetime import timedelta

def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"message": "Missing required fields"}), 400
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "User already exists"}), 400
    
    new_user = User(
        name=data.get('name'),
        email=data.get('email'),
        password=data.get('password'),
        role=data.get('role', 'customer'),
        address=data.get('address', '')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(
            identity=str(user.id), 
            expires_delta=timedelta(days=1)
        )
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": user.to_dict()
        }), 200
        
    return jsonify({"message": "Invalid email or password"}), 401
