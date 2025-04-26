from app.extensions import db
from datetime import datetime

class HealthProgram(db.Model):
    id = db.Column(db.String, primary_key=True)
    program_name = db.Column(db.String(120), nullable=False)
    program_description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)