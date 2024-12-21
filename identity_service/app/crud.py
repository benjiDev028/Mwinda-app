from datetime import datetime
from uuid import uuid4
import asyncpg
from .schemas import UserCreate
import random
from fastapi import HTTPException

async def generate_and_store_code(db, email: str):
    """
    Génère un code aléatoire et le stocke dans la table user_codes.
    """
    code = random.randint(10000, 99999)  # Générer un code à 5 chiffres
    query = """
        INSERT INTO user_codes (email, code)
        VALUES ($1, $2)
        ON CONFLICT (email) DO UPDATE 
        SET code = EXCLUDED.code, created_at = CURRENT_TIMESTAMP
    """
    await db.execute(query, email, code)
    # Simuler une notification au microservice (remplacez cela par RabbitMQ ou HTTPX si nécessaire)
    print(f"Code {code} envoyé à {email}")

async def activate_email_code(db, email: str, code: int):
    """
    Vérifie le code de confirmation et active l'email.
    """
    query = "SELECT code FROM user_codes WHERE email = $1"
    stored_code = await db.fetchval(query, email)

    if not stored_code or stored_code != code:
        raise HTTPException(status_code=400, detail="Code invalide ou expiré.")

    # Supprimer le code une fois validé
    delete_query = "DELETE FROM user_codes WHERE email = $1"
    await db.execute(delete_query, email)


async def get_user(db: asyncpg.Connection, user_id: str):
    query = "SELECT * FROM users WHERE id = $1"
    return await db.fetchrow(query, user_id)

async def get_user_by_email(db: asyncpg.Connection, email: str):
    query = "SELECT * FROM users WHERE email = $1"
    return await db.fetchrow(query, email)

async def create_user(db: asyncpg.Connection, user: UserCreate , salt):
    query = """
    INSERT INTO users (id, first_name, last_name, email, password_hash, password_salt, date_birth, points , is_email_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    """
    user_id = str(uuid4())
    hashed_password = user.password  
    await db.execute(query, user_id, user.first_name, user.last_name, user.email, hashed_password, salt, user.date_birth, 0, False)
    return await get_user(db, user_id)

async def update_user_password(db: asyncpg.Connection, user_id: str, new_password: str , salt):
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


async def activate_user_email(db: asyncpg.Connection, user_id: str, code: int):
    query = "UPDATE users SET code_confirmation = 0 WHERE id = $1 AND code_confirmation = $2 RETURNING *"
    await db.execute(query, user_id, code)
    return await get_user(db, user_id)


#CRUD Pour la Verification d'email 
async def get_code_by_email(db: asyncpg.Connection, email: str):
    query = "SELECT * FROM user_codes WHERE email = $1"
    return await db.fetchrow(query, email)

async def create_user_code(db: asyncpg.Connection, email: str, code: int):
    query = "INSERT INTO user_codes (email, code) VALUES ($1, $2)"
    await db.execute(query, email, code)

async def update_user_code(db: asyncpg.Connection, email: str, code: int):
    query = "UPDATE user_codes SET code = $1, created_at = NOW()  WHERE email = $2"
    await db.execute(query, code, email)

async def delete_user_code(db: asyncpg.Connection, email: str):
    query = "DELETE FROM user_codes WHERE email = $1"
    await db.execute(query, email)

async def activate_user_email(db: asyncpg.Connection, email: str):
    query = "UPDATE users SET is_email_verified = TRUE WHERE email = $1"
    await db.execute(query, email)

