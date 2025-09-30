from flask import Flask, jsonify, session
from flask_cors import CORS
from .routes import register_routes
from .utils.election_scheduler import start_scheduler

def create_app():
    app = Flask(__name__)

    # --- Flask Config ---
    app.secret_key = "secret_key"  # TODO: load from env/secret manager
    app.config.update(
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=False,
        SESSION_COOKIE_HTTPONLY=False,
        SESSION_COOKIE_NAME="session",
    )

    start_scheduler()

    # --- CORS Config ---
    CORS(
        app,
        resources={r"/*": {"origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000"
        ]}},
        supports_credentials=True,
        allow_headers=["Content-Type"]
    )

    # --- Session Check Endpoint ---
    @app.route("/me", methods=["GET"])
    def me():
        from .models.user_model import get_user_by_reg_no, get_user_role

        if "reg_no" in session:
            user_data = get_user_by_reg_no(session["reg_no"])
            if user_data:
                user_role = get_user_role(session["reg_no"]) or "user"  # Default to 'user' if no role found
                return jsonify({
                    "user": {
                        "reg_no": user_data[0],
                        "name": user_data[2],
                        "role": user_role
                    }
                }), 200

        return jsonify({"user": None}), 200
    
    register_routes(app)

    return app
