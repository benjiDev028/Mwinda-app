from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import EmailStr
from asyncpg import Connection
from app.db.session import connect_to_db , close_db_connection
from app.services.auth_service import  login_user
from app.db.schemas.auth import UserLogin;
import asyncpg

# Dépendance pour obtenir la session de base de données
async def get_db():
    db = await connect_to_db()
    try:
        yield db
    finally:
        await close_db_connection(db)

router = APIRouter(prefix="/identity", tags=["Login"])


@router.post("/login", status_code=status.HTTP_200_OK)
async def login_endpoint(user: UserLogin, db: asyncpg.Connection = Depends(get_db)):
    """
    Connecter un utilisateur existant.
    """
    email = user.email
    password = user.password
    token = await login_user(db, email, password)
    if token=="Information Invalide":
        return "Information Invalide"
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": token, "token_type": "bearer"}
