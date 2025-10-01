from .auth_routes import auth_bp
from .club_routes import club_bp
from .user_routes import user_bp
from .election_routes import election_bp
from .vote_routes import vote_bp
from .position_routes import position_bp
def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(club_bp, url_prefix='/club')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(election_bp, url_prefix='/election')
    app.register_blueprint(vote_bp, url_prefix='/vote')
    app.register_blueprint(position_bp, url_prefix='/position')
