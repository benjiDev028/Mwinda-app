FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers dans l'image
COPY . /app

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Définir le PYTHONPATH pour les imports relatifs
ENV PYTHONPATH=/app

# Exposer le port de l'application
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
