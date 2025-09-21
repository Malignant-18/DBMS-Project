from .auth_routes import auth_bp
from .club_routes import club_bp
from .user_routes import user_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(club_bp, url_prefix='/club')
    app.register_blueprint(user_bp, url_prefix='/user')
    # Later, you can register vote_bp or other blueprints here
