from flask import Blueprint, jsonify, request
from ..services.club_service import fetch_clubs, fetch_single_club
from ..services.member_service import (
    request_membership,
    get_club_approved_members,
    change_membership_status,
    change_membership_role,
)

club_bp = Blueprint("club", __name__)


@club_bp.route("/clubs", methods=["GET"])
def get_all_clubs():
    clubs = fetch_clubs()
    return jsonify(clubs), 200


@club_bp.route("/clubs/<int:club_id>", methods=["GET"])
def get_club(club_id):
    club = fetch_single_club(club_id)
    if club:
        return jsonify(club), 200
    return jsonify(msg="Club not found"), 404


@club_bp.route("/clubs/<int:club_id>/join", methods=["POST", "OPTIONS"])
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

@club_bp.route("/clubs/<int:club_id>/members", methods=["GET"])
def get_club_members(club_id):
    status = request.args.get("status", "approved")

    if status != "approved":
        return jsonify(msg="Only 'approved' members are supported currently"), 400

    members = get_club_approved_members(club_id)
    return jsonify(members), 200

@club_bp.route("/clubs/<int:club_id>/members/<reg_no>/status", methods=["PATCH"])
def update_member_status(club_id, reg_no):
    data = request.get_json()
    status = data.get("status")

    if not status:
        return jsonify(msg="Missing status"), 400

    updated = change_membership_status(reg_no, club_id, status)
    if updated:
        return jsonify(msg="Membership status updated"), 200
    else:
        return jsonify(msg="Failed to update membership status"), 400

@club_bp.route("/clubs/<int:club_id>/members/<reg_no>/role", methods=["PATCH"])
def update_member_role(club_id, reg_no):
    data = request.get_json()
    role = data.get("role")
    membership_id = data.get("membership_id")

    if not role or not membership_id:
        return jsonify(msg="Missing role or membership ID"), 400

    updated = change_membership_role(membership_id, role)
    if updated:
        return jsonify(msg="Membership role updated"), 200
    else:
        return jsonify(msg="Failed to update role"), 400
