from flask import Blueprint, jsonify, request
from ..services.club_service import fetch_clubs, fetch_single_club
from ..services.member_service import (
    request_membership,
    get_club_approved_members,
    change_membership_status,
    upgrade_to_head_service
)

club_bp = Blueprint("club", __name__)


@club_bp.route("/all", methods=["GET", "OPTIONS"])
def get_all_clubs():
    if request.method == "OPTIONS":
        return "", 200
    clubs = fetch_clubs()
    return jsonify(clubs), 200


@club_bp.route("/<int:club_id>", methods=["GET", "OPTIONS"])
def get_club(club_id):
    if request.method == "OPTIONS":
        return "", 200
    club = fetch_single_club(club_id)
    if club:    
        return jsonify(club), 200
    return jsonify(msg="Club not found"), 404


@club_bp.route("/<int:club_id>/join", methods=["POST", "OPTIONS"])
def join_club(club_id):
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()
    reg_no = data.get("reg_no")

    if not reg_no:
        return jsonify(msg="Missing registration number"), 400

    joined = request_membership(reg_no, club_id)
    if joined:
        return jsonify(msg="Membership requested"), 200
    else:
        return jsonify(msg="Failed to request membership"), 409

@club_bp.route("/<int:club_id>/members", methods=["GET", "OPTIONS"])
def get_club_members(club_id):
    if request.method == "OPTIONS":
        return "", 200
    status = request.args.get("status", "approved")

    if status != "approved":
        return jsonify(msg="Only 'approved' members are supported currently"), 400

    members = get_club_approved_members(club_id)
    return jsonify(members), 200

@club_bp.route("/<int:club_id>/members/<reg_no>/status", methods=["PATCH", "OPTIONS"])
def update_member_status(club_id, reg_no):
    if request.method == "OPTIONS":
        return "", 200
    data = request.get_json()
    status = data.get("status")

    if not status:
        return jsonify(msg="Missing status"), 400

    updated = change_membership_status(reg_no, club_id, status)
    if updated:
        return jsonify(msg="Membership status updated"), 200
    else:
        return jsonify(msg="Failed to update membership status"), 400
    
@club_bp.route("/memberships/<int:membership_id>/upgrade", methods=["PATCH", "OPTIONS"])
def upgrade_membership_route(membership_id):
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()
    admin_reg_no = data.get("admin")

    if not admin_reg_no:
        return jsonify(error="Missing admin registration number"), 400

    success, status_code = upgrade_to_head_service(admin_reg_no, membership_id)
    return jsonify(success), status_code