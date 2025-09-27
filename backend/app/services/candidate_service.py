from ..models import candidate_model

def increement_vote(candidate_id):
    candidate_model.increase_vote(candidate_id)