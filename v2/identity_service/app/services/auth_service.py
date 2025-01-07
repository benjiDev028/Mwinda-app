from app.core.security import  verify_password, create_access_token , create_refresh_token
from app.db.schemas.user import UserCreate
from asyncpg import Connection
import uuid


async def login_user(db: Connection, email: str, password: str) -> str:
    """
    Authentifie un utilisateur et génère un token JWT.
    """
    # Recherche de l'utilisateur par email
    user = await db.fetchrow("SELECT id, email, password_hash,role, password_salt FROM users WHERE email = $1", email)
    if not user or not verify_password(password, user["password_hash"], user['password_salt'] ):
        return "Information Invalide"

    # Création du token JWT
    # Création du token JWT
    token_data = {
        "sub": user["email"],
        "user_id": str(user["id"]),
        "role": user["role"]  # Correctement accéder au rôle de l'utilisateur
    }
    return create_access_token(data=token_data) , create_refresh_token(data= token_data)
