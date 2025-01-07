from datetime import datetime
from uuid import uuid4
import asyncpg
import base64
from typing import List
from PIL import Image
from io import BytesIO
from barcode.codex import Code128
import aio_pika
import random
from fastapi import HTTPException
from app.core.security import get_password_hash
from app.db.schemas.user import UserCreate, UserResponse, UserResponseFind
from app.db.schemas.password import ResetPasswordRequest, UpdatePasswordRequest
from asyncpg import Connection
import uuid
import os
import barcode
from barcode.writer import ImageWriter
import json
import logging

# Configuration du logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

async def register_user(db: asyncpg.Connection, user: UserCreate) -> UserResponse:
    try:
        existing_user = await db.fetchrow("SELECT id FROM users WHERE email = $1", user.email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "EMAIL_ALREADY_REGISTERED",
                    "message": "The provided email is already registered. Please use a different email."
                }
            )
        
        hashed_password, salt_password = get_password_hash(user.password)
        
        query = """
        INSERT INTO users (id, first_name, last_name, email, password_hash, password_salt, date_birth, is_email_verified, points)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, first_name, last_name, email, date_birth, is_email_verified, points, role
        """
        new_user = await db.fetchrow(
            query,
            uuid.uuid4(),
            user.first_name,
            user.last_name,
            user.email,
            hashed_password,
            salt_password,
            user.date_birth,
            False,
            0
        )
        
        if not new_user:
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "USER_CREATION_FAILED",
                    "message": "An unexpected error occurred. The user could not be created. Please try again later."
                }
            )
        
        logging.info("User registered successfully: %s", new_user['email'])
        return UserResponse(**dict(new_user))

    except HTTPException as http_error:
        logging.error("HTTP error during user registration: %s", http_error.detail)
        raise
    except Exception as e:
        logging.error("Unexpected error during user registration: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail={
                "error": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please contact support if the problem persists."
            }
        )

async def activate_user_email(db: asyncpg.Connection, email: str):
    try:
        query = "UPDATE users SET is_email_verified = TRUE WHERE email = $1"
        await db.execute(query, email)
        logging.info("Email activated successfully for: %s", email)
        return {"message": "Email verified"}
    except Exception as e:
        logging.error("Error activating email: %s", str(e))
        raise RuntimeError(f"Error activating email: {e}")

async def get_user(db: asyncpg.Connection, user_id: uuid):
    try:
        query = "SELECT id, first_name, last_name, email, date_birth, role, is_email_verified, points FROM users WHERE id = $1"
        user = await db.fetchrow(query, user_id)
        if not user:
            logging.warning("User not found with ID: %s", user_id)
        return user
    except Exception as e:
        logging.error("Error fetching user by ID: %s", str(e))
        raise RuntimeError(f"Error fetching user: {e}")

async def get_userv1_by_email(db: asyncpg.Connection, email: str):
    try:
        query = "SELECT * FROM users WHERE email = $1"
        user = await db.fetchrow(query, email)
        if not user:
            logging.warning("User not found with email: %s", email)
        return user
    except Exception as e:
        logging.error("Error fetching user by email: %s", str(e))
        raise RuntimeError(f"Error fetching user: {e}")

async def get_user_by_email(db: asyncpg.Connection, email: str):
    try:
        query = "SELECT id, first_name, last_name, email, date_birth, is_email_verified, points FROM users WHERE email = $1"
        user = await db.fetchrow(query, email)
        if not user:
            logging.warning("User not found with email: %s", email)
        return user
    except Exception as e:
        logging.error("Error fetching user by email: %s", str(e))
        raise RuntimeError(f"Error fetching user: {e}")

async def get_users_by_birthday(db: asyncpg.Connection, date_birth: str) -> List[UserResponse]:
    try:
        query = """
        SELECT id, first_name, last_name, email, date_birth, is_email_verified, points
        FROM users
        WHERE date_birth = $1
        """
        users = await db.fetch(query, date_birth)
        
        if not users:
            logging.info("No users found with birthday: %s", date_birth)
            return []

        return [
            UserResponseFind(**{
                **dict(user),
                "is_email_verified": user.get("is_email_verified", False)
            })
            for user in users
        ]
    except Exception as e:
        logging.error("Error fetching users by birthday: %s", str(e))
        raise RuntimeError(f"Error fetching users: {e}")

async def get_users(db: asyncpg.Connection) -> List[UserResponse]:
    try:
        query = """
        SELECT id, first_name, last_name, email, date_birth, is_email_verified, points
        FROM users
        """
        users = await db.fetch(query)
        
        if not users:
            logging.info("No users found in the database.")
            return []

        return [
            UserResponseFind(**{
                **dict(user),
                "is_email_verified": user.get("is_email_verified", False)
            })
            for user in users
        ]
    except Exception as e:
        logging.error("Error fetching all users: %s", str(e))
        raise RuntimeError(f"Error fetching users: {e}")

async def get_by_username(db: asyncpg.Connection, first_name: str, last_name: str) -> List[UserResponse]:
    try:
        query = """
        SELECT id, first_name, last_name, email, date_birth, is_email_verified, points
        FROM users
        WHERE first_name ILIKE '%' || $1 || '%' OR last_name ILIKE '%' || $2 || '%'
        """
        users = await db.fetch(query, first_name, last_name)
        
        if not users:
            logging.info("No users found with name: %s %s", first_name, last_name)
            return []

        return [
            UserResponseFind(**{
                **dict(user),
                "is_email_verified": user.get("is_email_verified", False)
            })
            for user in users
        ]
    except Exception as e:
        logging.error("Error fetching users by name: %s", str(e))
        raise RuntimeError(f"Error fetching users: {e}")

async def update_user_password(db: asyncpg.Connection, user_id: str, new_password: str, salt: str):
    try:
        query = """
        UPDATE users
        SET password_hash = $1,
            password_salt = $2
        WHERE id = $3
        RETURNING id, points
        """
        user = await db.fetchrow(query, new_password, salt, user_id)
        
        if not user:
            logging.warning("Password update failed for user ID: %s", user_id)
            raise RuntimeError("Password update failed.")
        
        user_response = {
            'id': str(user['id']),
            'points': user['points']
        }
        logging.info("Password updated successfully for user ID: %s", user_id)
        return user_response
    except Exception as e:
        logging.error("Error updating password for user ID %s: %s", user_id, str(e))
        raise RuntimeError(f"Error updating password: {e}")

async def reset_password_request(db: asyncpg.Connection, user: UpdatePasswordRequest):
    try:
        user_record = await db.fetchrow("SELECT * FROM users WHERE email = $1", user.email)
        if not user_record:
            logging.warning("User not found for password reset: %s", user.email)
            raise HTTPException(status_code=404, detail="User not found")
        
        hashed_password, salt_password = get_password_hash(user.new_password)
        return await update_user_password(db, user_id=user_record["id"], new_password=hashed_password, salt=salt_password)
    except HTTPException as http_error:
        logging.error("HTTP error during password reset request: %s", http_error.detail)
        raise
    except Exception as e:
        logging.error("Unexpected error during password reset request: %s", str(e))
        raise RuntimeError(f"Error during password reset request: {e}")

async def generate_barcode(
    id_user: int,
    date_birth: datetime,
    first_name: str,
    last_name: str
):
    try:
        reference_number = f"{id_user}-{date_birth}-{first_name}-{last_name}"
        
        buffer = BytesIO()
        writer = ImageWriter()
        code128 = Code128(reference_number, writer=writer)
        code128.write(buffer)
        buffer.seek(0)

        barcode_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        logging.info("Barcode generated successfully for user: %s", reference_number)
        return reference_number, barcode_base64

    except ValueError as ve:
        logging.error("Value error during barcode generation: %s", str(ve))

        raise RuntimeError(f"Erreur lors de la génération du code-barres : {ve}") from ve