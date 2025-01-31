import time
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from app.db.base import Base
from app.db.session import engine

DATABASE_URL = "postgresql://mwinda:mwinda@postgres:5432/mwindaIdentity"

# Attendre que PostgreSQL soit prêt avant de se connecter
RETRY_COUNT = 10  # Nombre max de tentatives
SLEEP_TIME = 5    # Temps d'attente entre chaque tentative (en secondes)

for i in range(RETRY_COUNT):
    try:
        engine = create_engine(DATABASE_URL)
        conn = engine.connect()
        conn.close()
        print("✅ Connexion à PostgreSQL réussie !")
        break  # Sortir de la boucle si la connexion réussit
    except OperationalError:
        print(f"⏳ PostgreSQL n'est pas prêt... tentative {i+1}/{RETRY_COUNT}")
        time.sleep(SLEEP_TIME)
else:
    print("❌ Impossible de se connecter à PostgreSQL après plusieurs tentatives.")
    exit(1)

# Si la connexion est réussie, créer les tables
print("🔧 Vérification et création des tables...")
Base.metadata.create_all(engine)
print("✅ Tables créées avec succès.")
