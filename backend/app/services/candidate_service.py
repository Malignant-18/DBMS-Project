from ..models.candidate_model import create_candidate, get_single_candidate, get_candidates_by_election
from ..models.election_model import get_club_id_of_election , get_election_by_id
from ..models.member_model import get_member_role

def  register_candidate_service(election_id, reg_no, manifesto):
    
    #this is to check if user is a valid member of the club
    club_id = get_club_id_of_election(election_id)
    if not club_id:
        return {"error": "Election or Club not found"}, 404
    user_role_in_club = get_member_role(reg_no , club_id)
    if not user_role_in_club:
        return {"error": "User not found in this club"}, 404

    
    # Check if user is already a candidate in this election
    check_candidate = get_single_candidate(election_id , reg_no)
    if check_candidate:
        return {"error": "User is already a candidate in this election"}, 400
    
    #check if election is open for nomination(i.e upcoming)
    election = get_election_by_id(election_id)
    if election['status'] != 'upcoming':
        return {"error": "Election is not open for nominations"}, 400
    
    #Register now broo
    success = create_candidate(election_id, reg_no, manifesto)
    if not success:
        return {"error": "Failed to register candidate"}, 500

    # Return updated list of candidates
    updated_candidates, status_code = get_election_candidates_service(election_id)
    return updated_candidates, status_code


def get_election_candidates_service(election_id):
    candidates = get_candidates_by_election(election_id)
    return candidates, 200