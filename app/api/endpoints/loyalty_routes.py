from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.schemas import UserResponse, LoyaltyHistoryCreate
from app.services.loyalty_service import add_points
from app.services.loyalty_service import redeem_user_points
from app.db.schemas import RedeemPointsRequest, RedeemPointsResponse
from app.db.models import User
from fastapi import FastAPI, HTTPException, Depends, Request
from starlette.responses import JSONResponse
from uuid import UUID
import logging
from app.services.rabbitmq_publisher import send_threshold_reached_notification
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
REWARD_THRESHOLD = 50000

router = APIRouter()
app = FastAPI()

# Configurer le logger
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
    """
    Ajoute des points à un utilisateur et enregistre l'opération dans l'historique.
    """
    logger.info(f"Requête pour ajouter des points pour le code-barre: {data.code_barre}, référence: {data.reference}")

    try:
        # Recherche de l'utilisateur par code_barre
        code_barre = data.code_barre
        reference = data.reference
        user = db.query(User).filter(User.barcode == code_barre).first()

        if not user:
            logger.warning(f"Utilisateur avec le code-barre {code_barre} introuvable.")
            raise HTTPException(status_code=404, detail=f"Utilisateur avec le code-barre {code_barre} introuvable.")

        # Définir le seuil en fonction de la référence
        if reference == "Studio":
            threshold = 14000
            threshold_percentage = user.pointstudios / threshold
        else:
            threshold = 50000
            threshold_percentage = user.pointevents / threshold

        logger.info(f"Seuil déterminé: {threshold}, Pourcentage atteint: {threshold_percentage * 100:.2f}%")

        # Ajouter les points
        updated_user = await add_points(db, user.id, data.montant, "USD", data.service, data.id_admin, reference)
        logger.info(f"Points ajoutés avec succès pour l'utilisateur {user.id}. Nouveau solde: Studio={updated_user.pointstudios}, Event={updated_user.pointevents}")

        # Vérifier si le seuil est atteint et envoyer une notification
        if threshold_percentage >= 0.8:
            logger.info(f"Le seuil de 80% est atteint pour {reference}. Envoi de la notification.")
            if reference == "Studio":
                send_threshold_reached_notification(user.id, threshold_percentage, updated_user.pointstudios, threshold, reference)

            else:
                send_threshold_reached_notification(user.id, threshold_percentage, updated_user.pointevents, threshold, reference)



        return updated_user

    except HTTPException as http_err:
        logger.warning(f"Erreur HTTP détectée: {http_err.detail}")
        raise http_err

    except ValueError as val_err:
        logger.error(f"Erreur de validation des données: {val_err}")
        raise HTTPException(status_code=400, detail="Données invalides : vérifiez les informations envoyées.")

    except Exception as exc:
        logger.exception(f"Erreur inattendue: {exc}")
        raise HTTPException(status_code=500, detail="Une erreur inattendue est survenue.")


@router.get("/loyalty_points/{user_id}", response_model=UserResponse)
async def get_loyalty_points(user_id: UUID, db: Session = Depends(get_db)):
    """
    Récupère les points totaux d'un utilisateur à partir de la table 'users'.
    """
    logger.info(f"Requête reçue pour récupérer les points de l'utilisateur avec ID: {user_id}")

    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.warning(f"Utilisateur avec l'ID {user_id} introuvable.")
            raise HTTPException(status_code=404, detail=f"Utilisateur avec l'ID {user_id} introuvable.")

        logger.info(f"Utilisateur trouvé: {user_id}. Points Studio: {user.pointstudios}, Points Event: {user.pointevents}")
        return user

    except HTTPException as http_err:
        logger.warning(f"Erreur HTTP détectée: {http_err.detail}")
        raise http_err

    except Exception as exc:
        logger.exception(f"Erreur inattendue lors de la récupération des points: {exc}")
        raise HTTPException(status_code=500, detail="Une erreur inattendue est survenue lors de la récupération des points.")


@router.post("/redeem_points/", response_model=RedeemPointsResponse)
async def redeem_points(request: RedeemPointsRequest, db: Session = Depends(get_db)):
    """
    Échanger les points d'un utilisateur pour une récompense.
    """
    logger.info(f"Requête pour échanger des points. Utilisateur ID: {request.user_id}, Référence: {request.reference}")

    try:
        response = await redeem_user_points(db, request.user_id, request.admin_id, request.service, request.reference)
        logger.info(f"Points échangés avec succès pour l'utilisateur {request.user_id}.")
        return response

    except HTTPException as http_err:
        logger.warning(f"Erreur HTTP détectée: {http_err.detail}")
        raise http_err

    except Exception as exc:
        logger.exception(f"Erreur inattendue lors de l'échange des points: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Une erreur inattendue est survenue lors de l'échange des points.",
        )
