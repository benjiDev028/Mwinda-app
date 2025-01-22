from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from app.core.config import Settings  # Assurez-vous d'avoir ces variables définies

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # URL du point de récupération du token

def get_current_admin(token: str = Depends(oauth2_scheme)):
    """
    Vérifie si l'utilisateur est un administrateur à partir du token JWT.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les informations d'identification.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Décoder le token JWT
        payload = jwt.decode(token, Settings.SECRET_KEY, algorithms=[Settings.ALGORITHM])

        # Extraire les informations utilisateur
        role: str = payload.get("role")
        if role is None or role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès réservé aux administrateurs.",
            )
        
        # Retourner les données utilisateur pertinentes (ici, seulement le rôle pour l'exemple)
        return {"role": role, "user_id": payload.get("user_id"), "email": payload.get("sub")}
    
    except JWTError:
        raise credentials_exception
