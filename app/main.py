from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.database import get_db, Base, engine
from app.api.endpoints.admin import router as admin_router

# Créer l'application FastAPI
app = FastAPI()

# OAuth2 pour l'authentification
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialiser la base de données
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Bienvenue sur le tableau de bord administratif !"}


# Inclure le routeur des fonctionnalités administratives
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
