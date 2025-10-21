
from ..models import member_model
from ..models.user_model import get_user_role

def request_membership(reg_no, club_id, role="Member"):
    
    # TODO: Check if already requested or approved
    return member_model.add_membership(reg_no, club_id, role)

def get_user_joined_clubs(reg_no):

    return member_model.get_joined_clubs_of_users(reg_no)

def get_user_all_clubs(reg_no):
    
    return member_model.get_all_clubs_of_users(reg_no)

def get_user_headed_clubs(reg_no):
    """
    Returns all clubs where the user is the head.
    """
    return member_model.get_clubs_headed_by_user(reg_no)

def get_club_approved_members(club_id):
    
    return member_model.get_approved_members_of_club(club_id)

def change_membership_status(reg_no, club_id, status):
    
    return member_model.update_membership_status(reg_no, club_id, status)
def get_pending_requests_service():
    return member_model.get_pending_requests()

def upgrade_to_head_service(admin_reg_no, membership_id):
    role = get_user_role(admin_reg_no)    
    
    if not role:
        return {"error": "Admin user not found"}, 404
    if role.lower() != "admin": 
        return {"error": "Unauthorized, only admins can upgrade to head"}, 403

    updated = member_model.update_member_role(membership_id, "Head")
    
    if updated:
        return {"message": "User upgraded to Head successfully"}, 200
    return {"error": "Failed to upgrade user"}, 400
