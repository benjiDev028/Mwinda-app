from datetime import datetime
from uuid import uuid4
import asyncpg
import aio_pika
import random
from fastapi import HTTPException
from app.core.security import get_password_hash
from app.db.schemas.user import UserCreate, UserResponse
from app.db.schemas.password import ResetPasswordRequest , UpdatePasswordRequest
from asyncpg import Connection
import uuid
import json



async def register_user(db: asyncpg.Connection, user: UserCreate) ->UserResponse:
    """
    Enregistre un nouvel utilisateur dans la base de données.
    """
    # Vérification si l'email existe déjà
    existing_user = await db.fetchrow("SELECT id FROM users WHERE email = $1", user.email)
    if existing_user:
        raise ValueError("Email is already registered.")
    
    # Hachage du mot de passe
    hashed_password, salt_password = get_password_hash(user.password)

    # Insertion dans la base de données
    query = """
    INSERT INTO users (id, first_name, last_name, email, password_hash, password_salt, date_birth, is_email_verified, points)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, first_name, last_name, email,date_birth, is_email_verified, points
    """
    new_user = await db.fetchrow(
        query,
        uuid.uuid4(),
        user.first_name,
        user.last_name,
        user.email,
        hashed_password,
        salt_password,
        user.date_birth,
        False,
        0,
    )

    if not new_user:
        raise ValueError("User could not be created.")

    return UserResponse(**dict(new_user))


async def activate_user_email(db: asyncpg.Connection, email: str):
    
    try:
        query = "UPDATE users SET is_email_verified = TRUE WHERE email = $1"
        await db.execute(query, email)
        return {'message : Email verifié'}

    except Exception as e:
        # Log l'erreur ou lever une exception adaptée
        raise RuntimeError(f"Erreur lors de la mise à jour du mot de passe : {e}")

async def get_user(db: asyncpg.Connection, user_id: str):
    query = "SELECT * FROM users WHERE id = $1"
    return await db.fetchrow(query, user_id)

async def get_user_by_email(db: asyncpg.Connection, email: str):
    query = "SELECT * FROM users WHERE email = $1"
    return await db.fetchrow(query, email)

async def update_user_password(db: asyncpg.Connection, user_id: str, new_password: str , salt:str):
    try:
        # Mise à jour et récupération de l'utilisateur en une seule requête
        query = """
            UPDATE users
            SET password_hash = $1,
            password_salt = $2

            WHERE id = $3
            RETURNING id, points
        """
        user = await db.fetchrow(query, new_password,salt, user_id)
         
        # Préparer la réponse
        user_response = { 
            'id': str(user['id']), 
            'points': user['points'] 
        }
        return user_response

    except Exception as e:
        # Log l'erreur ou lever une exception adaptée
        raise RuntimeError(f"Erreur lors de la mise à jour du mot de passe : {e}")





async def reset_password_request(db: asyncpg.Connection, user: UpdatePasswordRequest):
    # Vérifiez si l'utilisateur existe
    user_record = await db.fetchrow("SELECT * FROM users WHERE email = $1", user.email)
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")
    hashed_password, salt_password = get_password_hash(user.new_password)
    return await update_user_password(db, user_id=user_record["id"], new_password=hashed_password, salt=salt_password)