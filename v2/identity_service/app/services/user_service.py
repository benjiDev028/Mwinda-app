from datetime import datetime
from uuid import uuid4
import asyncpg
import base64
from typing import List
from PIL import Image
from io import BytesIO
from barcode import Code128
import aio_pika
import random
from fastapi import HTTPException
from app.core.security import get_password_hash
from app.db.schemas.user import UserCreate, UserResponse , UserResponseFind
from app.db.schemas.password import ResetPasswordRequest , UpdatePasswordRequest
from asyncpg import Connection
import uuid
import os
import barcode
from barcode.writer import ImageWriter
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

async def get_user(db: asyncpg.Connection, user_id: uuid):
    query = "SELECT id, first_name, last_name, email, date_birth, is_email_verified, points FROM users WHERE id = $1"
    return await db.fetchrow(query, user_id)



async def get_user_by_email(db: asyncpg.Connection, email: str):
    query = "SELECT id, first_name, last_name, email, date_birth, is_email_verified, points FROM users WHERE email = $1"
    return await db.fetchrow(query, email)

async def get_users_by_birthday(db: asyncpg.Connection, date_birth: datetime) -> List[UserResponse]:
    """
    Récupère tous les utilisateurs ayant une date d'anniversaire spécifique.
    """
    query = """
    SELECT id, first_name, last_name, email, date_birth, is_email_verified, points
    FROM users
    WHERE date_birth = $1
    """
    users = await db.fetch(query, date_birth)

    if not users:
        return []

    # Gestion des valeurs None pour `is_email_verified`
    return [
        UserResponseFind(**{
            **dict(user),
            "is_email_verified": user.get("is_email_verified", False)  # Remplace `None` par `False`
        })
        for user in users
    ]

async def get_users(db: asyncpg.Connection) -> List[UserResponse]:
    """
    Récupère tous les utilisateurs de la base de données.
    """
    query = """
    SELECT id, first_name, last_name, email, date_birth, is_email_verified, points
    FROM users
    """
    users = await db.fetch(query)

    if not users:
        return []

    # Gestion des valeurs None pour `is_email_verified`
    return [
        UserResponseFind(**{
            **dict(user),
            "is_email_verified": user.get("is_email_verified", False)  # Remplace `None` par `False`
        })
        for user in users
    ]
async def get_by_username(db: asyncpg.Connection, first_name: str, last_name:str) -> List[UserResponse]:
    """
    Récupère les utilisateurs ayant un prénom ou un nom qui correspond au nom d'utilisateur donné.
    """
    query = """
    SELECT id, first_name, last_name, email, date_birth, is_email_verified, points
    FROM users
    WHERE first_name= $1 OR last_name= $2
    """
    users = await db.fetch(query, first_name , last_name)

    if not users:
        return []

    # Gestion des valeurs None pour `is_email_verified`
    return [
        UserResponseFind(**{
            **dict(user),
            "is_email_verified": user.get("is_email_verified", False)  # Remplace `None` par `False`
        })
        for user in users
    ]



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


async def generate_barcode(
    id_user: int,
    date_birth: datetime,
    first_name: str,
    last_name: str
):
    """
    Génère un code-barres basé sur les informations utilisateur et retourne
    le numéro de référence (les chiffres sous le code-barres) ainsi que l'image du code-barres encodée en Base64.
    
    Args:
        id_user (int): L'ID de l'utilisateur.
        date_birth (str): Date de naissance (format "YYYY-MM-DD").
        first_name (str): Prénom de l'utilisateur.
        last_name (str): Nom de l'utilisateur.
    
    Returns:
        dict: Un dictionnaire contenant le numéro de référence (les chiffres sous le code-barres)
              et l'image encodée en Base64.
    """
    try:
        

        # Générer le numéro de référence (par exemple : id_user + date_birth + first_name + last_name)
        reference_number = f"{id_user}-{date_birth}-{first_name}-{last_name}"

        # Créer un buffer pour l'image
        buffer = BytesIO()
        writer = ImageWriter()
        code128 = Code128(reference_number, writer=writer)
        code128.write(buffer)
        buffer.seek(0)

        # Encoder l'image du code-barres en Base64
        barcode_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        # Retourner le numéro de référence et l'image en Base64
        return reference_number , barcode_base64

    except ValueError as ve:
        raise ValueError(f"Erreur dans les données : {ve}") from ve
    except Exception as e:
        raise RuntimeError(f"Erreur lors de la génération du code-barres : {e}") from e