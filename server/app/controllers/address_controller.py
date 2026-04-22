from flask import request, jsonify
from app import db
from app.models.address_model import Address
from flask_jwt_extended import jwt_required, get_jwt_identity

@jwt_required()
def get_user_addresses():
    user_id = get_jwt_identity()
    addresses = Address.query.filter_by(user_id=user_id).all()
    return jsonify([addr.to_dict() for addr in addresses]), 200

@jwt_required()
def add_address():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('address_line'):
        return jsonify({"message": "Address line is required"}), 400
        
    new_address = Address(
        user_id=user_id,
        address_line=data.get('address_line'),
        landmark=data.get('landmark'),
        city=data.get('city'),
        pincode=data.get('pincode'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )
    
    db.session.add(new_address)
    db.session.commit()
    
    return jsonify({"message": "Address added successfully", "address": new_address.to_dict()}), 201

@jwt_required()
def delete_address(address_id):
    user_id = get_jwt_identity()
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    
    if not address:
        return jsonify({"message": "Address not found"}), 404
        
    db.session.delete(address)
    db.session.commit()
    
    return jsonify({"message": "Address deleted successfully"}), 200

@jwt_required()
def update_address(address_id):
    user_id = get_jwt_identity()
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    
    if not address:
        return jsonify({"message": "Address not found"}), 404
        
    data = request.get_json()
    if not data or not data.get('address_line'):
        return jsonify({"message": "Address line is required"}), 400
        
    address.address_line = data.get('address_line')
    address.landmark = data.get('landmark')
    address.city = data.get('city')
    address.pincode = data.get('pincode')
    address.latitude = data.get('latitude')
    address.longitude = data.get('longitude')
    
    db.session.commit()
    return jsonify({"message": "Address updated successfully", "address": address.to_dict()}), 200
