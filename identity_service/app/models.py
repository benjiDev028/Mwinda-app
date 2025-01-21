from sqlalchemy import Column, String, Integer, DateTime, UUID
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    password_salt = Column(String)
    date_birth = Column(DateTime)
    code_confirmation = Column(Integer, default=0)
    points = Column(Integer, default=0)
