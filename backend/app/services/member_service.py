from ..models import member_model

def request_membership(reg_no, club_id, role="Member"):
    
    # TODO: Check if already requested or approved
    return member_model.add_membership(reg_no, club_id, role)

def get_user_joined_clubs(reg_no):

    return member_model.get_joined_clubs_of_users(reg_no)

def get_user_all_clubs(reg_no):
    
    return member_model.get_all_clubs_of_users(reg_no)

def get_club_approved_members(club_id):
    
    return member_model.get_approved_members_of_club(club_id)

def change_membership_status(reg_no, club_id, status):
    
    return member_model.update_membership_status(reg_no, club_id, status)

def change_membership_role(membership_id, role):
    
    return member_model.update_membership_role(membership_id, role)
