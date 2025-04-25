from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

from app.config.index import Config
from ..extensions import db
from ..models import User
import uuid
import os
from ..config.index import Config
import hashlib
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
    
@auth.route('/api/v1/signup', methods=['POST'])
def signUp():
    data = request.get_json()
    if data is None:
        return jsonify({"message":'No data received'}), 400
    email = data.get('email')
    password = data.get('password')
    isAdmin = data.get('isAdmin',False)
    
    if email == '' or password == '':
        return jsonify({"message":'Email and password are required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message":'User already exists'}), 400
    if len(password) < 6:
        return jsonify({"message":'Password must be at least 6 characters long'}), 400
    if len(email) < 6:
        return jsonify({"message":'Email must be at least 6 characters long'}), 400
    if '@' not in email:
        return jsonify({"message":'Email must be valid'}), 400
    if '.' not in email:
        return jsonify({"message":'Email must be valid'}), 400
    if email.count('@') > 1:
        return jsonify({"message":'Email must be valid'}), 400
    if email.count('.') > 1:
        return jsonify({"message":'Email must be valid'}), 400
    if isAdmin == "True":
        isAdmin = True
    elif isAdmin == "False":
        isAdmin = False
    try:
        salt = Config.SALT
        print(salt)
        db_password = password + salt
        password = hashlib.sha256(db_password.encode()).hexdigest()
        print(password)
        
        newUser= User(
            id=str(uuid.uuid4()),
            email=email,
            password=password,
            is_admin=isAdmin
        )
        db.session.add(newUser)
        db.session.commit()
        return jsonify({"message":'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message":'Error creating user'}), 500
    
    