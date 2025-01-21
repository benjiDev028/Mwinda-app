from fastapi import FastAPI
from app.api.endpoints import register, auth , password , activateEmail , gestionUsers
import uvicorn
from starlette.middleware.cors import CORSMiddleware
from app.db.session import connect_to_db, close_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Remplacez "*" par l'URL de votre frontend React Native pour plus de sécurité
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Autorise tous les en-têtes
)



app.include_router(register.router, tags=["Register"])
app.include_router(auth.router, tags=["Auth"])
app.include_router(activateEmail.router , tags=['ActivateEmail'])
app.include_router(password.router, tags=["Password"])
app.include_router(gestionUsers.router , tags=["GestionUsers"])

@app.on_event("startup")
async def startup():
    app.state.db = await connect_to_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db_connection(app.state.db)

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.2.13", port=8001)
