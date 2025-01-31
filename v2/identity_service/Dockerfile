# Utiliser une image Python légère
FROM python:3.9-slim

# Installer les dépendances système nécessaires en une seule commande pour réduire les couches
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement requirements.txt pour optimiser le cache Docker
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code après l’installation des dépendances
COPY . ./

# Définir le chemin des modules Python
ENV PYTHONPATH=/app




# Exposer le port de l'application
EXPOSE 8001

# Lancer FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
