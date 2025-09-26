from ..models import votes_model

def add_voting_record(reg_no,election_id):
    return votes_model.add_vote_record(reg_no,election_id)

def check_already_voted(reg_no,election_id):
    return votes_model.check_vote(reg_no,election_id)
