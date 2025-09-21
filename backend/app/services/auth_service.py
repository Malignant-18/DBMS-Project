from ..models.user_model import add_user, get_user_by_reg_no, verify_password

def register_user(reg_no, password, name):
    if get_user_by_reg_no(reg_no):
        return False, "EXISTING REG NUMBER"
    add_user(reg_no, password, name)
    return True, "registered"

def authenticate_user(reg_no, password):
    user = get_user_by_reg_no(reg_no)
    if not user or not verify_password(user, password):
        return False, "INVALID REGISTER NUMBER OR PASSWORD"
    return True, user
