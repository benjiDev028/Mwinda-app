from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
#Schemas pour Verfication Email
class NotificationRequest(BaseModel):
    email: str
    code: int
class Generatecode(BaseModel):
    email: str
 

#Schemas pour le User
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    date_birth: datetime

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str

class PasswordUpdate(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str
 
class User(UserBase):
    id: UUID
    code_confirmation: int = 0
    points: int = 0

    class Config:
        from_attributes = True  # Utilisé pour remplacer 'orm_mode' dans Pydantic v2
