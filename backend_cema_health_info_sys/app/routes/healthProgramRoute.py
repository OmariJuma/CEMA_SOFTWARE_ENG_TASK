
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import  HealthProgram, User
from ..extensions import db

health = Blueprint('health', __name__)

@health.route('/api/v1/healthProgram', methods=['POST', 'OPTIONS'])
@jwt_required()
def health_program():
    data = request.get_json()
    if data is None:
        return jsonify({"message": 'No data received'}), 400

    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"message": 'User not found'}), 404

    program_name = data.get('program_name')
    program_description = data.get('program_description')

    if not program_name or not program_description:
        return jsonify({"message": 'Program name and description are required'}), 400

    new_program = HealthProgram(
        user_id=user.id,
        program_name=program_name,
        program_description=program_description
    )

    db.session.add(new_program)
    db.session.commit()

    return jsonify({"message": 'Health program created successfully'}), 201