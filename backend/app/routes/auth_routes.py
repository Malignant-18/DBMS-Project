from flask import Blueprint, request, jsonify, session
from ..services.auth_service import register_user, authenticate_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return "", 200
    data = request.get_json()
    reg_no = data["reg_no"]
    password = data["password"]
    name = data["name"]

    success, msg = register_user(reg_no, password, name)
    status = 200 if success else 409
    return jsonify(msg=msg), status

@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 200
        
    data = request.get_json()
    reg_no = data["reg_no"]
    password = data["password"]

    success, result = authenticate_user(reg_no, password)
    
    if not success:
        return jsonify(msg=result), 401

    session['reg_no'] = reg_no
    
    # Also return user data directly with the login response
    from ..models.user_model import get_user_by_reg_no
    user_data = get_user_by_reg_no(reg_no)
    
    if user_data:
        user_info = {
            "reg_no": user_data[0],
            "name": user_data[2],
            "role": "student"
        }
        return jsonify(msg="logged in", user=user_info), 200
    else:
        return jsonify(msg="logged in"), 200

@auth_bp.route("/logout", methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        return "", 200
    session.clear()
    return jsonify(msg="Logged out successfully"), 200
