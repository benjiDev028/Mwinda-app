# app/utils/points_checker.py
def has_reached_threshold(current_points: int, reward_threshold: int = 50000) -> bool:
    """
    Vérifie si les points actuels atteignent 80% du seuil de récompense.
    """
    return current_points >= 0.8 * reward_threshold
