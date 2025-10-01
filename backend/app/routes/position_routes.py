from flask import Blueprint, jsonify, request

position_bp = Blueprint("position", __name__)

@position_bp.route("/all", methods=["GET", "OPTIONS"])
def get_all_positions():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        from ..models.position_model import get_all_positions
        positions = get_all_positions()
        return jsonify(positions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500