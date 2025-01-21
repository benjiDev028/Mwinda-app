import asyncpg
from fastapi import FastAPI
from typing import Callable

DATABASE_URL = "postgresql://mwinda:mwinda@localhost:5432/mwindaIdentity"


async def connect_to_db():
    return await asyncpg.connect(DATABASE_URL)

async def close_db_connection(connection):
    await connection.close()

def get_db() -> Callable:
    return connect_to_db
