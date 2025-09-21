from flask import Blueprint, jsonify
from ..services.club_service import fetch_clubs

club_bp = Blueprint("club", __name__)

@club_bp.route("/club/all", methods=["GET"])
def get_all():
    clubs = fetch_clubs()
    return jsonify(clubs), 200
