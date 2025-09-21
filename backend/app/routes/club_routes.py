from flask import Blueprint, jsonify,request
from ..services.club_service import fetch_clubs,fetch_single_club

club_bp = Blueprint("club", __name__)

@club_bp.route("/club/all", methods=["GET"])
def get_all():
    clubs = fetch_clubs()
    return jsonify(clubs), 200

@club_bp.route("/club/<int:club_id>", methods=["GET"])
def get_one(club_id):
    club = fetch_single_club(club_id)
    return jsonify(club), 200
