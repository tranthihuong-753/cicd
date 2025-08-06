from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import async_sessionmaker
import os
from dotenv import load_dotenv


load_dotenv()


DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD")


DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+asyncpg://postgres:{DATABASE_PASSWORD}@db:5432/testdb"
)


engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()
