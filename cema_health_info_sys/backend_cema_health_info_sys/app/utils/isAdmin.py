from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from ..models import User
def isAdmin(current_user):
    user = User.query.filter_by(id=current_user).first()
    if user is None:
        print("User not found")
        return False
    if user.is_admin == False:
        print("User is not admin")
        return False
    if user.is_admin == True:
        return True
   
    