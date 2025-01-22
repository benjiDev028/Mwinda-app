from sqlalchemy.orm import Session
from app.db.models import User
from app.utils.csv_export import export_to_csv

def get_all_users(db: Session):
    return db.query(User).all()

def export_users_data(db: Session):
    users = db.query(User).all()
    file_path = export_to_csv(users)
    return file_path
