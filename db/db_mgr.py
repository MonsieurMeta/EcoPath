# Database model
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

from sqlalchemy import Column, Integer, String
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

DATABASE_URL = "sqlite:///./EcoPath.db"
engine = create_engine(DATABASE_URL)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
base = sqlalchemy.orm.declarative_base()

