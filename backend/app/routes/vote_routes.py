from flask import Blueprint, jsonify, request
from ..services.votes_service import vote_service


vote_bp = Blueprint("vote",__name__)

@vote_bp.route('/cast/<int:election_id>',methods=["POST","OPTIONS"])
def recording_vote(election_id):
    if request.method == "OPTIONS":
        return "", 200
    data = request.get_json()
    reg_no = data.get("reg_no")
    candidate_id = data.get("candidate_id")
    if not all([reg_no,candidate_id]):
        return jsonify({"error": "Missing required fields"}), 400
    success , status  = vote_service(reg_no,election_id,candidate_id)
    return jsonify(success),status