from .auth_routes import auth_bp
from .club_routes import club_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(club_bp)
    # Later, you can register vote_bp or other blueprints here
