from flask import Blueprint, jsonify, request
from ..services.votes_service import add_voting_record,check_already_voted
from ..services.candidate_service import increement_vote

vote_bp = Blueprint("votes", __name__)

@vote_bp.route('/<reg_no>/<int:election_id>/<int:candidate_id>/votes',methods=["POST","OPTIONS"])
def recording_vote(reg_no,election_id,candidate_id):
    if request.method == "OPTIONS":
        return "", 200
    if (not check_already_voted(reg_no,election_id)):
        add_voting_record(reg_no,election_id)
        increement_vote(candidate_id)
        return jsonify({"msg":"vote recorded"})
    return jsonify({"msg":"already voted"})
