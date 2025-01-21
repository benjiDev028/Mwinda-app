from datetime import datetime
from pydantic import BaseModel, EmailStr
from uuid import UUID



class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    date_birth: str

class UserResponse(UserBase):
    id: UUID
    points: int

    class Config:
        orm_mode = True

class LoyaltyHistoryCreate(BaseModel):
    code_barre: int
    devise : str
    montant : float
    service : str
    id_admin: UUID
