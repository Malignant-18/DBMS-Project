from flask import Blueprint, jsonify, request
from ..services.member_service import get_user_joined_clubs, get_user_all_clubs, get_user_headed_clubs

user_bp = Blueprint("user", __name__)

@user_bp.route("/<reg_no>/clubs", methods=["GET", "OPTIONS"])
def joined_clubs(reg_no):
    """
    Returns all clubs the user has been approved to join.
    """
    if request.method == "OPTIONS":
        return "", 200
    clubs = get_user_joined_clubs(reg_no)
    return jsonify(clubs), 200

@user_bp.route("/<reg_no>/memberships", methods=["GET", "OPTIONS"])
def all_clubs(reg_no):
    """
    Returns all club membership records for the user (approved, pending, rejected).
    """
    if request.method == "OPTIONS":
        return "", 200
    memberships = get_user_all_clubs(reg_no)
    return jsonify(memberships), 200

@user_bp.route("/<reg_no>/headed-clubs", methods=["GET", "OPTIONS"])
def headed_clubs(reg_no):
    """
    Returns all clubs where the user is the head.
    """
    if request.method == "OPTIONS":
        return "", 200
    clubs = get_user_headed_clubs(reg_no)
    return jsonify(clubs), 200
