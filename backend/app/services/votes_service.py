from ..models.vote_model import add_vote_record, check_vote
from ..models.election_model import get_election_by_id  
from ..models.member_model import get_member_role
from ..models.candidate_model import increment_vote, get_candidate_by_candidate_id

def add_voting_record_service(reg_no,election_id):
    return add_vote_record(reg_no,election_id)

def check_already_voted(reg_no,election_id):
    return check_vote(reg_no,election_id)

def vote_service(reg_no,election_id,candidate_id):

    #check if election is ongoing
    election = get_election_by_id(election_id)
    if election['status'] != 'ongoing':
        return {"error": "Election is not open for voting"}, 400
    club_id  = election['club_id']

    #check if candidate is valid
    check_candidate = get_candidate_by_candidate_id(candidate_id)
    if not check_candidate:
        return {"error": "Invalid candidate"}, 404
    if check_candidate['election_id'] != election_id:
        return {"error": "Candidate does not belong to this election"}, 400 

    #check if user is a valid member of the club
    user_role_in_club = get_member_role(reg_no , club_id)
    if not user_role_in_club:
        return {"error": "User not found in this club"}, 404
    
    #check if user has already voted in this election
    if not check_already_voted(reg_no,election_id):
        add_voting_record_service(reg_no,election_id)
        increment_vote(candidate_id)
        return {"msg":"vote recorded"},200
    return {"msg":"already voted"},400

    