import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()
class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DB_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    SALT=os.getenv('SALT')
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS').split(',')