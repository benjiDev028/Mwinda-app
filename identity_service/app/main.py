import logging
from fastapi import FastAPI, HTTPException, Depends
from . import crud, schemas, database
import asyncpg
import random
import httpx
import uvicorn
from datetime import datetime, timedelta, timezone
from .auth import get_password_hash, verify_password, create_access_token

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Dépendance pour obtenir la session de base de données
async def get_db():
    db = await database.connect_to_db()
    try:
        logger.info("Connexion à la base de données établie.")
        yield db
    finally:
        await database.close_db_connection(db)
        logger.info("Connexion à la base de données fermée.")

@app.post("/register")
async def register(user: schemas.UserCreate, db: asyncpg.Connection = Depends(get_db)):
    logger.info(f"Tentative d'inscription pour l'email: {user.email}")
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        logger.warning(f"L'email {user.email} est déjà enregistré.")
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password, salt = get_password_hash(user.password)
    user.password = hashed_password
    new_user = await crud.create_user(db=db, user=user, salt=salt)
    logger.info(f"Nouvel utilisateur créé avec l'ID: {new_user['id']}")
    user_response = {
        'id': str(new_user['id']),
        'points': new_user['points']
    }
    return user_response

@app.post("/login")
async def login(user: schemas.UserLogin, db: asyncpg.Connection = Depends(get_db)):
    logger.info(f"Tentative de connexion pour l'email: {user.email}")
    db_user = await crud.get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user["password_hash"], db_user["password_salt"]):
        logger.warning(f"Échec de connexion pour l'email: {user.email}")
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user["email"]})
    logger.info(f"Connexion réussie pour l'email: {user.email}")
    return {"access_token": access_token, "token_type": "bearer", "is_email_verified": db_user["is_email_verified"]}

@app.put("/reset-password")
async def reset_password(password_reset: schemas.PasswordReset, db: asyncpg.Connection = Depends(get_db)):
    logger.info(f"Réinitialisation du mot de passe pour l'email: {password_reset.email}")
    db_user = await crud.get_user_by_email(db, email=password_reset.email)
    if not db_user:
        logger.warning(f"Email non trouvé pour la réinitialisation: {password_reset.email}")
        raise HTTPException(status_code=400, detail="Email not found")
    new_hashed_password, salt = get_password_hash(password_reset.new_password)
    logger.info(f"Mot de passe réinitialisé pour l'utilisateur ID: {db_user['id']}")
    return await crud.update_user_password(db, user_id=db_user["id"], new_password=new_hashed_password, salt=salt)

@app.put("/update-password")
async def update_password(password_update: schemas.PasswordUpdate, db: asyncpg.Connection = Depends(get_db)):
    logger.info(f"Mise à jour du mot de passe pour l'email: {password_update.email}")
    db_user = await crud.get_user_by_email(db, email=password_update.email)
    if not db_user or not verify_password(password_update.old_password, db_user["password_hash"], db_user["password_salt"]):
        logger.warning(f"Échec de la mise à jour du mot de passe pour l'email: {password_update.email}")
        raise HTTPException(status_code=400, detail="Invalid credentials")
    new_hashed_password, salt = get_password_hash(password_update.new_password)
    logger.info(f"Mot de passe mis à jour avec succès pour l'utilisateur ID: {db_user['id']}")
    return await crud.update_user_password(db, user_id=db_user["id"], new_password=new_hashed_password, salt=salt)

@app.get("/generate-code")
async def generate_code(data: schemas.Generatecode, db: asyncpg.Connection = Depends(get_db)):
    email = data.email
    logger.info(f"Génération d'un code pour l'email: {email}")
    code = random.randint(10000, 99999)
    existing_code = await crud.get_code_by_email(db, email)
    if existing_code:
        await crud.update_user_code(db, email=email, code=code)
        logger.info(f"Code mis à jour pour l'email: {email}")
    else:
        await crud.create_user_code(db, email=email, code=code)
        logger.info(f"Nouveau code créé pour l'email: {email}")

    """ async with httpx.AsyncClient() as client:
        notification_payload = {"email": email, "code": code}
        response = await client.post("http://notification-service/send-code", json=notification_payload)
        if response.status_code != 200:
            logger.error(f"Échec de l'envoi de la notification pour l'email: {email}")
            raise HTTPException(status_code=500, detail="Failed to send email notification") """

    logger.info(f"Code généré et notification envoyée avec succès pour l'email: {email}")
    return {"msg": "Code generated and notification sent successfully"}

@app.get("/activate-email")
async def activate_email(data:schemas.NotificationRequest, db: asyncpg.Connection = Depends(get_db)):
    email = data.email
    code = data.code
    logger.info(f"Activation de l'email: {email} avec le code: {code}")
    stored_code = await crud.get_code_by_email(db, email)
    if not stored_code:
        logger.warning(f"Aucun code trouvé pour l'email: {email}")
        raise HTTPException(status_code=400, detail="No code found for this email")

    if stored_code["code"] != code:
        logger.warning(f"Code invalide pour l'email: {email}")
        raise HTTPException(status_code=400, detail="Invalid code")

    created_at = stored_code["created_at"]

    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    if datetime.now() - created_at > timedelta(minutes=5):
        logger.warning(f"Code expiré pour l'email: {email}")
        raise HTTPException(status_code=400, detail="Code expired")

    await crud.activate_user_email(db, email)
    await crud.delete_user_code(db, email)
    logger.info(f"Email activé avec succès: {email}")
    return {"msg": "Email activated successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
