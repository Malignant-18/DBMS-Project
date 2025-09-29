from flask import Blueprint, jsonify, request
from ..services.election_service import (
    create_election_service,
    fetch_all_elections,
    fetch_elections_by_status,
    get_single_election,
    get_club_elections,
    delete_election_service,
    update_election_status_service,
)
from ..services.candidate_service import register_candidate_service  , get_election_candidates_service

election_bp = Blueprint("election", __name__)


# ---------------- CREATE ---------------- #
@election_bp.route("/create", methods=["POST", "OPTIONS"])
def create_election_handler():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json() or {}
    reg_no = data.get("reg_no")
    club_id = data.get("club_id")
    position_id = data.get("position_id")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    if not all([reg_no, club_id, position_id, start_time, end_time]):
        return jsonify({"error": "Missing required fields"}), 400

    result = create_election_service(club_id, position_id, reg_no, start_time, end_time)
    if isinstance(result, tuple):  # Error case from service
        return jsonify(result[0]), result[1]

    return jsonify({"message": "Election created successfully"}), 201


# ---------------- READ ---------------- #
@election_bp.route("/all", methods=["GET"])
def get_all_elections_handler():
    elections = fetch_all_elections()
    return jsonify(elections), 200


@election_bp.route("/status/<string:status>", methods=["GET"])
def get_elections_by_status_handler(status):
    elections = fetch_elections_by_status(status)
    if not elections:
        return jsonify({"error": "No elections found or invalid status"}), 404
    return jsonify(elections), 200


@election_bp.route("/<int:election_id>", methods=["GET"])
def get_election_by_id_handler(election_id):
    result = get_single_election(election_id)
    if isinstance(result, tuple):  # Error case
        return jsonify(result[0]), result[1]
    return jsonify(result), 200


@election_bp.route("/club/<int:club_id>", methods=["GET"])
def get_club_elections_handler(club_id):
    elections = get_club_elections(club_id)
    if not elections:
        return jsonify({"message": "No elections found for this club"}), 404
    return jsonify(elections), 200


# ---------------- UPDATE ---------------- #
@election_bp.route("/<int:election_id>/status", methods=["PATCH"])
def update_election_status_handler(election_id):
    data = request.get_json() or {}
    new_status = data.get("status")
    reg_no = data.get("reg_no")
    club_id = data.get("club_id")

    if not all([new_status, reg_no, club_id]):
        return jsonify({"error": "Missing required fields"}), 400

    result = update_election_status_service(election_id, new_status, reg_no, club_id)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]

    return jsonify({"message": "Election status updated successfully"}), 200


# ---------------- DELETE ---------------- #
@election_bp.route("/<int:election_id>", methods=["DELETE"])
def delete_election_handler(election_id):
    data = request.get_json() or {}
    reg_no = data.get("reg_no")
    club_id = data.get("club_id")

    if not all([reg_no, club_id]):
        return jsonify({"error": "Missing required fields"}), 400

    result = delete_election_service(election_id, reg_no, club_id)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]

    return jsonify({"message": "Election deleted successfully"}), 200


#----------------CANDIDATE ROUTES----------------#

@election_bp.route("/<int:election_id>/candidates", methods=["POST"])
def register_candidate(election_id):
    data = request.get_json()
    reg_no = data.get("reg_no")
    manifesto = data.get("manifesto")

    if not reg_no:
        return jsonify({"error": "Missing reg_no"}), 400

    result, status = register_candidate_service(election_id, reg_no, manifesto)
    return jsonify(result), status

@election_bp.route("/<int:election_id>/candidates", methods=["GET"])
def get_election_candidates(election_id):
    candidates, status = get_election_candidates_service(election_id)
    return jsonify(candidates), status

