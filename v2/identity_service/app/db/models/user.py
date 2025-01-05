from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey,Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    password_salt = Column(String, nullable=False)
    date_birth = Column(String, nullable=True)
    is_email_verified = Column(Boolean, default=False)
    role = Column(String, default="client")
    points = Column(Integer, default=0)
    created_at = Column(DateTime, default=DateTime.datetime.utcnow)
    updated_at = Column(DateTime, default=DateTime.datetime.utcnow)


