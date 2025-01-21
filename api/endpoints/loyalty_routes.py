from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.schemas import UserResponse, LoyaltyHistoryCreate
from app.services.loyalty_service import add_points
from app.db.models import User 
from app.utils import currency_converter
from fastapi import FastAPI, HTTPException, Depends, Request
from starlette.responses import JSONResponse
from uuid import UUID
import logging
from app.utils.points_checker import has_reached_threshold
from app.services.rabbitmq_publisher import RabbitMQPublisher
from dotenv import load_dotenv
import os

load_dotenv()
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
REWARD_THRESHOLD = os.getenv("REWARD_THRESHOLD")


router = APIRouter() 
app = FastAPI()

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Une erreur interne est survenue. Veuillez réessayer plus tard."},
    )

@router.post("/earn_points", response_model=UserResponse)
async def earn_points(data: LoyaltyHistoryCreate, db: Session = Depends(get_db)):
    try:
        # Conversion de devises
        montant = currency_converter.convert_to_cdf(data.montant, data.devise)
        if not montant:
            raise HTTPException(status_code=400, detail="Erreur lors de la conversion des devises.")
        
        # Recherche de l'utilisateur par code_barre
        code_barre = data.code_barre
        user = db.query(User).filter(User.barcode == code_barre).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"Utilisateur avec le code-barre {code_barre} introuvable.")
        
        # Ajouter les points
        updated_user = await add_points(db, user.id, montant, "CDF", data.service, data.id_admin)
        # Vérifier si l'utilisateur atteint le seuil
        if has_reached_threshold(user.points, REWARD_THRESHOLD):
            publisher = RabbitMQPublisher(RABBITMQ_URL)
            event_message = {
                "user_id": str(updated_user.id),
                "current_points": user.points,
                "reward_threshold": REWARD_THRESHOLD,
                "message": "Le client a atteint 80% du seuil de récompense.",
            }
            publisher.publish(queue="points_threshold_reached", message=event_message)
        return updated_user

    except HTTPException as http_err:
        logger.warning(f"Erreur HTTP détectée : {http_err.detail}")
        raise http_err  # Propager les erreurs HTTP pour les réponses frontend précises

    except ValueError as val_err:
        logger.error(f"Erreur de validation : {val_err}")
        raise HTTPException(status_code=400, detail="Données invalides : vérifiez les informations envoyées.")

    except Exception as exc:
        logger.error(f"Erreur inattendue : {exc}")
        raise HTTPException(status_code=500, detail="Une erreur inattendue est survenue.")
    


@router.get("/loyalty_points/{user_id}", response_model=UserResponse)
async def get_loyalty_points(user_id: UUID, db: Session = Depends(get_db)):
    """
    Récupère les points totaux d'un utilisateur à partir de la table 'users'.
    """
    logger.info(f"Requête reçue pour récupérer les points de l'utilisateur avec ID: {user_id}")

    try:
        # Vérifier si l'utilisateur existe
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.warning(f"Utilisateur avec l'ID {user_id} introuvable.")
            raise HTTPException(status_code=404, detail=f"Utilisateur avec l'ID {user_id} introuvable.")

        # Log des points trouvés
        logger.info(f"Utilisateur trouvé : {user_id}, Points totaux : {user.points}")

        # Retourner les points totaux de l'utilisateur
        return user

    except HTTPException as http_err:
        logger.error(f"Erreur HTTP : {http_err.detail}")
        raise http_err  # Renvoie des erreurs spécifiques au frontend

    except Exception as exc:
        logger.exception("Une erreur inattendue est survenue.")
        raise HTTPException(status_code=500, detail="Une erreur inattendue est survenue lors de la récupération des points.")