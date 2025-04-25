from flask import Flask
from .config.index import Config
from .extensions import db, jwt
from dotenv import load_dotenv

load_dotenv()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from .routes.authRoute import auth as authRoute
    from .routes.healthProgramRoute import health as healthProgramRoute
    
    app.register_blueprint(authRoute)
    app.register_blueprint(healthProgramRoute)
    
    with app.app_context():
        db.create_all()
    
    return app