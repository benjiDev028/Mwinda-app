import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.admin_service import (
    get_all_users,
    export_users_data
)
from app.core.security import get_current_admin

# Configuration du logger
logger = logging.getLogger("admin_router")
logger.setLevel(logging.DEBUG)  # Niveau de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

router = APIRouter()


@router.get("/admin/users", summary="Récupérer tous les utilisateurs")
def list_users(
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin),
):
    try:
        users = get_all_users(db)
        if not users:
            logger.warning("Aucun utilisateur trouvé par l'administrateur : %s", current_admin)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aucun utilisateur trouvé. Veuillez réessayer plus tard."
            )
        logger.info("Liste des utilisateurs récupérée par l'administrateur : %s", current_admin)
        return users
    except Exception as e:
        logger.error("Erreur lors de la récupération des utilisateurs : %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur est survenue lors de la récupération des utilisateurs."
        )


@router.get("/admin/export", summary="Exporter les données utilisateur en CSV")
def export_users(
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin),
):
    try:
        file_path = export_users_data(db)
        if not file_path:
            logger.warning("Export échoué pour l'administrateur : %s", current_admin)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Impossible d'exporter les données utilisateur."
            )
        logger.info("Export des données utilisateur réussi par l'administrateur : %s", current_admin)
        return {"message": "Export réussi", "file_path": file_path}
    except Exception as e:
        logger.error("Erreur lors de l'export des données utilisateur : %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur est survenue lors de l'export des données utilisateur."
        )
