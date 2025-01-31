#!/bin/bash

# Exécuter la création des tables
echo "Création des tables..."
python create_table.py

# Démarrer le serveur Uvicorn
echo "Démarrage du serveur Uvicorn..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
