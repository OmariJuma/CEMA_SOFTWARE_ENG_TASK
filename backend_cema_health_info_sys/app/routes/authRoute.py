from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

from app.config.index import Config
from ..extensions import db
from ..models import User
import uuid
from ..config.index import Config
import hashlib
from ..utils import isAdmin
from ..models import HealthProgram, User

auth = Blueprint('auth', __name__)

@auth.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    if data is None:
        return jsonify({"message":'No data received'}), 400
    email = data.get('email')
    password = data.get('password')
    salted_password= password + Config.SALT
    password = hashlib.sha256(salted_password.encode()).hexdigest()
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message":"User not found"}), 404
    
    if user.password != password:
        return jsonify({"message":"Invalid email or password"}), 401
    
    if user.is_admin == True:
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        return jsonify({"access_token": access_token, "id": user.id}), 200
    else:
        return jsonify({"message":"You are not an admin"}), 401
    
    
@auth.route('/api/v1/signup', methods=['POST'])
def signUp():
    data = request.get_json()
    if data is None:
        return jsonify({"message":'No data received'}), 400
    email = data.get('email')
    password = data.get('password')
    isAdmin = data.get('isAdmin',False)
    phone = data.get('phone')
    address = data.get('address')
    name = data.get('name')
    
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
        db_password = password + salt
        password = hashlib.sha256(db_password.encode()).hexdigest()
                
        newUser= User(
            id=str(uuid.uuid4()),
            email=email,
            password=password,
            is_admin=isAdmin,
            phone=phone,
            address=address,
            name=name
        )
        db.session.add(newUser)
        db.session.commit()
        return jsonify({"message":'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message":'Error creating user'}), 500
    
@auth.route('/api/v1/users', methods=['GET'])
@jwt_required()
def getUsers():
    current_user = get_jwt_identity()
    if isAdmin(current_user) == False:
        return jsonify({"message": "User not found or You are not an admin"}), 401
        
    users = User.query.all()
    if users is None:
        return jsonify({"message":"No users found"}), 404
    
    userList = []
    for user in users:
        userList.append({
            "id":user.id,
            "email":user.email,
            "is_admin":user.is_admin,
            "phone":user.phone,
            "address":user.address,
            "created_at":user.created_at,
            "name":user.name,
        })
    
    return jsonify(userList), 200

@auth.route('/api/v1/users/<user_id>', methods=['POST'])
@jwt_required()
def get_user_profile(user_id):
    current_user = get_jwt_identity()
    if isAdmin(current_user) == False:
        return jsonify({"message": "User not found or You are not an admin"}), 401
        
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({"message":"User not found"}), 404
    
    userProfile = {
        "id":user.id,
        "name":user.name,
        "email":user.email,
        "is_admin":user.is_admin,
        "phone":user.phone,
        "address":user.address,
        "created_at":user.created_at,
        "health_programs":[]
    }
    programs = user.health_program
    if programs is not None:
        for program in programs:
            userProfile["health_programs"].append({
                "id":program.id,
                "program_name":program.program_name,
                "program_description":program.program_description
            })
    return jsonify(userProfile), 200
