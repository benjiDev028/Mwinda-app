from app.db.models import User, LoyaltyHistory
from sqlalchemy.orm import Session
import requests
from uuid import UUID



async def add_points(db: Session, user_id: UUID, amount: float, devise :str,  service:str,  id_admin: UUID):
    if not amount:
        raise ValueError("Conversion de devise échouée")
    
    points = await calculate_points(amount)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("Utilisateur introuvable")

    user.points += points
    history = LoyaltyHistory(user_id=user_id, points=points, amount = amount, service=service, id_admin=id_admin)
    db.add(history)
    db.commit()
    db.refresh(user)
    return user

async def calculate_points(amount_cdf):
    if amount_cdf >= 10000 and amount_cdf <= 20000:
        return 500
    elif amount_cdf > 20000 and amount_cdf <= 50000:
        return 1500
    elif amount_cdf > 50000:
        return 5000
    return 0

