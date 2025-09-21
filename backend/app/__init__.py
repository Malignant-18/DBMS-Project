from flask import Flask
from flask_cors import CORS
from .routes import register_routes

def create_app():
    app = Flask(__name__)
    app.secret_key = "secret_key"
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False

    # Enable CORS
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}},
         supports_credentials=True, allow_headers=["Content-Type"])

    # ✅ Fixed route definition
    @app.route("/me", methods=["GET"])
    def hello():
        return {"message": "Hello from backend!"}, 200

    # Register all blueprints/routes
    register_routes(app)

    return app
