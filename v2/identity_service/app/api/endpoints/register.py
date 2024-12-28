from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import EmailStr
from asyncpg import Connection
from app.db.session import connect_to_db , close_db_connection
from app.db.schemas.user import UserCreate
from app.services.user_service import register_user
import asyncpg

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
        new_user = await register_user(db, user)
        return new_user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
