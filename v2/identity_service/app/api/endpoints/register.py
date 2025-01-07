from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import EmailStr
from asyncpg import Connection
from app.db.session import connect_to_db, close_db_connection
from app.db.schemas.user import UserCreate
from app.services.user_service import register_user
import asyncpg
import logging

# Configuration du logger
logger = logging.getLogger("register_endpoint")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

# Dépendance pour obtenir la session de base de données
async def get_db():
    db = await connect_to_db()
    try:
        yield db
    finally:
        await close_db_connection(db)

router = APIRouter(prefix="/identity", tags=["Register"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_endpoint(user: UserCreate, db: asyncpg.Connection = Depends(get_db)):
    """
    Inscrire un nouvel utilisateur.
    """
    try:
        logger.info(f"Attempting to register user with email: {user.email}")
        new_user = await register_user(db, user)
        logger.info(f"User registered successfully with email: {new_user.email}")
        return new_user

    except ValueError as e:
        logger.warning(f"Validation error during registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail={"error": "VALIDATION_ERROR", "message": str(e)}
        )
    except HTTPException as http_err:
        logger.error(f"HTTP exception: {http_err.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during user registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred during registration. Please try again later."
            }
        )
