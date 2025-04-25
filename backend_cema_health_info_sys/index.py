from flask import Flask, jsonify, request, redirect
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
load_dotenv()
app = Flask(__name__)

jwtSecret = os.getenv("JWT_SECRET_KEY")
app.config["JWT_SECRET_KEY"] = jwtSecret
jwt = JWTManager(app)

@app.route('/api/v1/login', methods=['POST'])
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

@app.route('/api/v1/healthProgram', methods=['Post', 'options'])
@jwt_required()    
def heathProgram():
    data = request.get_json()
    if data is None:
        return jsonify({"message":'No data received'}), 400
    return jsonify({"message":'Hello, World!'})

if __name__ == '__main__':
    app.run(debug=True)
