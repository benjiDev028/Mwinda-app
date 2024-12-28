from fastapi import APIRouter, Depends, HTTPException
from app.services.user_service import update_user_password , get_user_by_email, reset_password_request
from app.services.user_code_service import send_reset_code_to_user , verify_code
from app.db.schemas.password import PasswordUpdate , ResetPasswordRequest , CodeResetPasswordRequest , UpdatePasswordRequest
from app.db.session import connect_to_db , close_db_connection
from app.core.security import verify_password , get_password_hash
from app.db.session import get_db
import asyncpg

# Dépendance pour obtenir la session de base de données
async def get_db():
    db = await connect_to_db()
    try:
        yield db
    finally:
        await close_db_connection(db)


router = APIRouter(prefix="/identity", tags=["Password"])
"""
Mettre a jour un mot de passe parametres : (Email , old_mdp , new_mdp)
"""

@router.put("/update-password")
async def update_password_endpoint(
    user: PasswordUpdate, db: asyncpg.Connection = Depends(get_db)
):
    """
    Endpoint pour mettre à jour  le mot de passe.
    """
    db_user = await get_user_by_email(db, email=user.email)
    #verifie s'il l'email existe
    if not db_user or not verify_password(user.old_password, db_user["password_hash"], db_user["password_salt"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    #Hacher le mot de passe recu en paramettre
    new_hashed_password, salt = get_password_hash(user.new_password)
    return await update_user_password(db, user_id=db_user["id"], new_password=new_hashed_password, salt=salt)

@router.put("/reset-password-step1")
async def reset_password_endpoint(
    user: ResetPasswordRequest, db: asyncpg.Connection = Depends(get_db)
):
    """
    EndPoint pour Envoyer le code via mail
    """
    db_user = await get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email Invalid")
    
    return await send_reset_code_to_user(db, user.email)

@router.put("/reset-password-step2")
async def reset_password_endpoint(
    user: CodeResetPasswordRequest, db: asyncpg.Connection = Depends(get_db)
):
    """
    EndPoint pour Verifier le code 
    """
    db_user = await get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email Invalid")
    return await verify_code(db, user.email, user.code)


@router.put("/reset-password-step3")
async def reset_password_endpoint(
    user: UpdatePasswordRequest, db: asyncpg.Connection = Depends(get_db)
):
    """
    EndPoint pour Reset le nouveau passé 
    """
    db_user = await get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email Invalid")
    return await reset_password_request(db, user)



  