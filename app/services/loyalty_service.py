from app.db.models import User, LoyaltyHistory
from sqlalchemy.orm import Session
import requests
from fastapi import APIRouter, Depends, HTTPException
from app.db.models import User, LoyaltyHistory
from app.db.schemas import RedeemPointsResponse

from uuid import UUID




async def add_points(db: Session, user_id: UUID, amount: float, devise :str,  service:str,  id_admin: UUID , reference :str):
    if not amount:
        raise ValueError("La   devise n'est pas bonne")
    user = db.query(User).filter(User.id == user_id).first()        
    points = await calculate_points(amount)
    if not user:
        raise ValueError("Utilisateur introuvable")
    
    if user.pointstudios < 14000 or user.Pointevents <50000:
        if reference=="Studio" :
            user.pointstudios+=points
        else :
            user.pointevents+=points

    history = LoyaltyHistory(user_id=user_id, points=points, amount = amount, service=service, id_admin=id_admin, reference = reference)
    db.add(history)
    db.commit()
    db.refresh(user)
    return user

async def calculate_points(amount_cdf):
    return amount_cdf*100

async def redeem_user_points(db: Session, user_id: UUID, admin_id: UUID, service: str, reference: str) -> RedeemPointsResponse:
    """
    Échange les points de l'utilisateur et enregistre l'opération dans la table loyalty_history.
    """
    # Récupérer l'utilisateur
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    # Vérifier les points d'événement et de studio
    points_used = 0
    if reference == "Event":
        if user.pointevents is None or user.pointevents < 40000:
            raise HTTPException(status_code=400, detail="L'utilisateur n'a pas assez de points à échanger pour un événement")
        points_used = 40000
    elif reference == "Studio":
        if user.pointstudios is None or user.pointstudios < 5000:
            raise HTTPException(status_code=400, detail="L'utilisateur n'a pas assez de points à échanger pour un studio")
        points_used = 5000
    else:
        raise HTTPException(status_code=400, detail="Référence inconnue")

    try:
        # Réinitialiser les points de l'utilisateur
        if reference == "Studio":
            user.pointstudios -= points_used
        else:
            user.pointevents -= points_used
        db.add(user)

        # Ajouter une entrée dans loyalty_history
        loyalty_history = LoyaltyHistory(
            user_id=user_id,
            id_admin=admin_id,
            points=-1 * points_used,
            service=service,
            reference=reference,
            amount=0
        )
        db.add(loyalty_history)
        db.commit()

        # Retourner la réponse
        return RedeemPointsResponse(
            message="Points échangés avec succès",
            user_id=user_id,
            reference=reference,
            points_used=points_used
        )
    except Exception as e:
        db.rollback()
        raise e
