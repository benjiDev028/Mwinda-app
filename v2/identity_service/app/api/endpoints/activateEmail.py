from fastapi import APIRouter, Depends, HTTPException
from app.services.user_code_service import  send_reset_code_to_user , verify_code
from app.services.user_service import get_user_by_email ,  activate_user_email 
from app.db.schemas.user import NotificationRequest , Generatecode
from app.db.session import connect_to_db , close_db_connection
from app.db.session import get_db
import asyncpg

# Dépendance pour obtenir la session de base de données
async def get_db():
    db = await connect_to_db()
    try:
        yield db
    finally:
        await close_db_connection(db)


router = APIRouter(prefix="/identity", tags=["ActivateEmail"])


@router.post("/activate-email-step1")
async def activate_email(
    user: Generatecode, db: asyncpg.Connection = Depends(get_db)
):
    """
    Endpoint pour Generer le code et l'envoyer à l'utilisateur
    """
    db_user = await get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email Invalid")
    return await send_reset_code_to_user(db, user.email)
@router.post("/activate-email-step2")
async def activate_email(
    user: NotificationRequest, db: asyncpg.Connection = Depends(get_db)
):
    """
    EndPoint pour verifier le code de l'utilisateur
    """
    db_user = await get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email Invalid")
    return await verify_code(db, user.email, user.code)
@router.put("/activate-email-step3")
async def activate_email(
    user: Generatecode, db: asyncpg.Connection = Depends(get_db)
):
    """
    Endpoint pour Activer l'email
    """
    db_user = await get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email Invalid")
    return await activate_user_email(db, user.email)