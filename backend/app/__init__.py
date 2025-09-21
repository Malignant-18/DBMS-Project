from flask import Flask
from flask_cors import CORS
from .routes import register_routes

def create_app():
    app = Flask(__name__)
    app.secret_key = "secret_key"
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False
    app.config["SESSION_COOKIE_HTTPONLY"] = False  # Allow JavaScript access for debugging
    app.config["SESSION_COOKIE_NAME"] = "session"

    # Enable CORS
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]}},
         supports_credentials=True, allow_headers=["Content-Type"])

    # Session check endpoint
    @app.route("/me", methods=["GET"])
    def me():
        from flask import session, jsonify
        from .models.user_model import get_user_by_reg_no
        
        if 'reg_no' in session:
            reg_no = session['reg_no']
            user_data = get_user_by_reg_no(reg_no)
            
            if user_data:
                user_response = {
                    "user": {
                        "reg_no": user_data[0],  # reg_no is first column
                        "name": user_data[2],    # name is third column
                        "role": "student"        # default role
                    }
                }
                return jsonify(user_response), 200
        
        return jsonify({"user": None}), 200

    # Register all blueprints/routes
    register_routes(app)

    return app
