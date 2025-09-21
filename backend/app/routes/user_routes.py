from flask import Blueprint, jsonify
from ..services.member_service import get_user_joined_clubs, get_user_all_clubs

user_bp = Blueprint("user", __name__)

@user_bp.route("/users/<reg_no>/clubs", methods=["GET"])
def joined_clubs(reg_no):
    """
    Returns all clubs the user has been approved to join.
    """
    clubs = get_user_joined_clubs(reg_no)
    return jsonify(clubs), 200

@user_bp.route("/users/<reg_no>/memberships", methods=["GET"])
def all_clubs(reg_no):
    """
    Returns all club membership records for the user (approved, pending, rejected).
    """
    memberships = get_user_all_clubs(reg_no)
    return jsonify(memberships), 200
