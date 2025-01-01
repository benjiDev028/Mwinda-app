from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import EmailStr
from asyncpg import Connection
from fastapi.encoders import jsonable_encoder
from app.db.session import connect_to_db , close_db_connection
from app.db.schemas.user import UserFindByBirth , UserFindByName , UserFindByEmail , UserFindById
from app.services.user_service import get_users ,  get_by_username , get_user_by_email , get_user , get_users_by_birthday
import asyncpg

# Dépendance pour obtenir la session de base de données
async def get_db():
    db = await connect_to_db()
    try:
        yield db
    finally:
        await close_db_connection(db)

router = APIRouter(prefix="/identity", tags=["GestionUsers"])


@router.get("/get_all_users")
async def get_all_users(db: asyncpg.Connection = Depends(get_db)):
    """
    Recuperer tous les utilisateurs.
    """
    try:
        users = await get_users(db)
        if not users:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Users")
        return jsonable_encoder(users)

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/get_users_by_name")
async def get_users_by_name(username : UserFindByName,db: asyncpg.Connection = Depends(get_db)):
    """
    Recuperer  utilisateurs par nom d'utilisateur.
    """
    try:
         
        users = await get_by_username(db , username.first_name , username.last_name)
        if not users:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Users not found")
        return jsonable_encoder(users)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/get_user_by_mail")
async def get_user_by_mail(user : UserFindByEmail , db: asyncpg.Connection = Depends(get_db), ):
    """
    Recuperer un utilisateur par mail.
    """
    try:
        users = await get_user_by_email(db, user.email)
        if not users:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Users not found")
        return jsonable_encoder(users)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/get_users_by_bith")
async def get_users_by_bith( user: UserFindByBirth ,db: asyncpg.Connection = Depends(get_db)):
    """
    Recuperer utilisateurs par date d'anniversaire.
    """
    try: 
        users = await get_users_by_birthday(db , user.date_birth )
        if not users:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Users not found")
        return jsonable_encoder(users)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/get_user_by_id")
async def get_user_by_id(user: UserFindById, db: asyncpg.Connection = Depends(get_db)):
    """
    Récupérer un utilisateur par id.
    """
    try:
        # Utiliser await pour attendre le résultat de get_user
        print(f'id : {user.id}')
        user_data = await get_user(db, user.id)
        if not user_data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user_data
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

