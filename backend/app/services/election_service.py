from ..models.election_model import create_election , get_all_elections, get_elections_by_status , get_election_by_id , delete_election , get_elections_by_club , update_election_status
from ..models.member_model import get_member_role

def create_election_service(club_id, position_id, reg_no, start_time, end_time):
    
    site_role = get_user_role(reg_no)
    if site_role == "admin":
        return create_election(club_id, position_id, reg_no, start_time, end_time)

    # Otherwise, check their club role
    user_role = get_member_role(reg_no, club_id)
    if not user_role:
        return {"error": "User not found in this club"}, 404
    if user_role != "Head":
        return {"error": "Unauthorized"}, 403

    return create_election(club_id, position_id, reg_no, start_time, end_time)

def fetch_all_elections():
    return get_all_elections()

def fetch_elections_by_status(status):
    return get_elections_by_status(status)

def get_single_election(election_id ):
    election = get_election_by_id(election_id)
    if not election:
        return {"error": "Election not found"}, 404
    return election

def get_club_elections(club_id):
    return get_elections_by_club(club_id)

def delete_election_service(election_id, reg_no, club_id):
    user_role = get_member_role(reg_no, club_id)
    if not user_role:
        return {"error": "User not found"}, 404 
    if user_role not in ("Admin", "Head"):
        return {"error": "Unauthorized"}, 403
    return delete_election(election_id)

def update_election_status_service(election_id, new_status, reg_no, club_id):
    user_role = get_member_role(reg_no, club_id)
    if not user_role:
        return {"error": "User not found"}, 404 
    if user_role not in ("Admin", "Head"):
        return {"error": "Unauthorized"}, 403
    return update_election_status(election_id, new_status)
