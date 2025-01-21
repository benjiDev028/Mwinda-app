from fastapi import FastAPI
from app.db.database import Base, engine
from app.api.endpoints.loyalty_routes import router as loyalty_router

# Création des tables dans la base de données
Base.metadata.create_all(bind=engine)

# Initialisation de l'application FastAPI
app = FastAPI(title="Loyalty System API")

# Enregistrement des routes
app.include_router(loyalty_router, prefix="/loyalty", tags=["Loyalty"])
