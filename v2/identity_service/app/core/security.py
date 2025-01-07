from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

# Configuration du secret JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuration bcrypt pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str, salt: str) -> bool:
    """
    Vérifie si le mot de passe en clair correspond au mot de passe haché en utilisant le "salt".
    """
    salted_password = (plain_password + salt).encode('utf-8')
    return pwd_context.verify(salted_password, hashed_password)

def get_password_hash(password: str) -> (str, str):
    """
    Génère un "salt" et hache le mot de passe en utilisant bcrypt avec le "salt".
    """
    salt = bcrypt.gensalt().decode()
    salted_password = (password + salt).encode('utf-8')
    hashed_password = pwd_context.hash(salted_password)
    return hashed_password, salt

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Crée un token JWT avec une date d'expiration.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Crée un refresh token sous forme de JWT.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(days=7))
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """
    Décode un token JWT et retourne les données.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
