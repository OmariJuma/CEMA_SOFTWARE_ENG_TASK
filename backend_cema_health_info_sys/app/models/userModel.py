from app.extensions import db
from datetime import datetime

user_programs = db.Table(
    "user_programs",
    db.Column("user_id", db.String, db.ForeignKey("user.id"), primary_key=True),
    db.Column(
        "program_id", db.String, db.ForeignKey("health_program.id"), primary_key=True
    ),
    db.Column("joined_at", db.DateTime, default=datetime.now),
)


class User(db.Model):
    id = db.Column(db.String, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    health_program = db.relationship(
        "HealthProgram",
        secondary=user_programs,
        backref=db.backref("patients", lazy="dynamic"),
    )
