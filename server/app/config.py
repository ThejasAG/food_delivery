import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    # Format: mysql+pymysql://username:password@localhost/db_name
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://testuser:test123@localhost/food_delivery_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-change-this')
    SECRET_KEY = os.getenv('SECRET_KEY', 'another-secret-key-for-flask')
    
    # JWT expiration (optional)
    # JWT_ACCESS_TOKEN_EXPIRES = 3600 # 1 hour
