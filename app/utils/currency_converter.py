import requests
from app.core.config import settings
import json
import logging

def convert_to_cdf(amount, from_currency) -> float:
    if from_currency == "CDF":
        return amount

    try:
        response = requests.get(settings.EXCHANGE_RATE_API)
        response.raise_for_status()
        data = response.json()
        taux = data["rates"].get("CDF", 2830)  # Utilise 2830 comme valeur par défaut si CDF n'est pas présent
    except (requests.RequestException, ValueError) as e:
        logging.error(f"Erreur lors de la récupération des données de taux de change: {e}")
        taux = 2830  # Valeur par défaut en cas d'erreur

    converted_amount = amount * taux
    return converted_amount

# Utilisation de l'enregistrement pour afficher des messages d'erreur dans les logs
logging.basicConfig(level=logging.ERROR)
