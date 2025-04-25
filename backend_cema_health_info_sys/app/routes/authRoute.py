from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

from app.config.index import Config
from ..extensions import db
auth = Blueprint('auth', __name__)

@auth.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    if data is None:
        return jsonify({"message":'No data received'}), 400
    email = data.get('email')
    password = data.get('password')
    
    if email == 'admin@test.com' and password == 'admin':
        # for the identity, I will use half the user id, I get from the database
        access_token = create_access_token(identity=email, expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message":'Invalid credentials'}), 401