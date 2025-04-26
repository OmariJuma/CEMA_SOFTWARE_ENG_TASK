from flask import Flask
from .config.index import Config
from .extensions import db, jwt
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    CORS(app, resources={r"/api/*":{
        "origins":Config.ALLOWED_ORIGINS,
        "methods":["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers":["Content-Type", "Authorization"],
    }})
    # Register blueprints
    from .routes.authRoute import auth as authRoute
    from .routes.healthProgramRoute import health as healthProgramRoute
    
    app.register_blueprint(authRoute)
    app.register_blueprint(healthProgramRoute)
    
    with app.app_context():
        db.create_all()
    
    return app