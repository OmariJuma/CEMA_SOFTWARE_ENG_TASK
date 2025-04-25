from app.extensions import db
from datetime import datetime

class User(db.Model):
    id= db.Column(db.String, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    health_program = db.relationship('HealthProgram', backref='user', lazy=True)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    

