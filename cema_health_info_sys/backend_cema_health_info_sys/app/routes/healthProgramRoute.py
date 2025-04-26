import uuid
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import HealthProgram, User
from ..extensions import db
from ..utils import isAdmin

health = Blueprint("health", __name__)


@health.route("/api/v1/healthProgram", methods=["POST"])
@jwt_required()
def health_program():
    current_user = get_jwt_identity()
    if isAdmin(current_user) == False:
        return jsonify({"message": "User not found or You are not an admin"}), 401
    data = request.get_json()
    if data is None:
        return jsonify({"message": "No data received"}), 400

    program_name = data.get("program_name")
    program_description = data.get("program_description")

    if not program_name or not program_description:
        return jsonify({"message": "Program name and description are required"}), 400

    new_program = HealthProgram(
        id=str(uuid.uuid4()),
        program_name=program_name,
        program_description=program_description,
    )

    db.session.add(new_program)
    db.session.commit()

    return jsonify({"message": "Health program created successfully"}), 201


@health.route("/api/v1/healthProgram", methods=["GET"])
@jwt_required()
def get_health_programs():
    if isAdmin(get_jwt_identity()) == False:
        return jsonify({"message": "User not found or You are not an admin"}), 401

    programs = HealthProgram.query.all()
    if not programs:
        return jsonify({"message": "No health programs found"}), 404

    program_list = []
    for program in programs:
        program_list.append(
            {
                "id": program.id,
                "program_name": program.program_name,
                "program_description": program.program_description,
            }
        )

    return jsonify(program_list), 200


@health.route("/api/v1/healthProgram/<program_id>/patients", methods=["POST"])
@jwt_required()
def add_patient_to_program(program_id):
    if isAdmin(get_jwt_identity()) == False:
        return jsonify({"message": "User not found or You are not an admin"}), 401
    data = request.get_json()
    if data is None:
        return jsonify({"message": "No data received"}), 400

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    program = HealthProgram.query.get(program_id)
    if not program:
        return jsonify({"message": "Health program not found"}), 404

    user.health_program.append(program)
    db.session.commit()

    return jsonify({"message": "User added to health program successfully"}), 200

@health.route("/api/v1/healthProgram/<program_id>/patients", methods=["GET"])
@jwt_required()
def get_patients_in_program(program_id):
    if isAdmin(get_jwt_identity()) == False:
        return jsonify({"message": "User not found or You are not an admin"}), 401

    program = HealthProgram.query.get(program_id)
    if not program:
        return jsonify({"message": "Health program not found"}), 404

    patients = program.patients.all()
    if not patients:
        return jsonify({"message": "No patients found in this health program"}), 404

    patient_list = []
    for patient in patients:
        patient_list.append(
            {
                "id": patient.id,
                "email": patient.email,
                "is_admin": patient.is_admin,
            }
        )

    return jsonify(patient_list), 200
