from ..models.club_model import get_all_clubs,get_single_club

def fetch_clubs():
    return get_all_clubs()

def fetch_single_club(club_id):
    return get_single_club(club_id)
    
