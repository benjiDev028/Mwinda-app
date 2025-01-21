import asyncpg
from fastapi import FastAPI
from typing import Callable
import os
from dotenv import load_dotenv

load_dotenv() 
#DATABASE_URL = os.getenv("DATABASE_URL" , "postgresql://mwinda:mwinda@localhost:5432/mwindaIdentity")
# DATABASE_URL= "postgresql://mwinda:mwinda@localhost:5432/mwindaidentity"
DATABASE_URL="postgresql://postgres:benji028@localhost:5432/mwindaidentity"


async def connect_to_db():
    return await asyncpg.connect(DATABASE_URL)

async def close_db_connection(connection):
    await connection.close()

def get_db() -> Callable:
    return connect_to_db
