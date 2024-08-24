from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel



from sqlalchemy import Column, ForeignKey, Integer,String
from sqlalchemy.orm import relationship

from db import db_mgr    

Base=db_mgr.base




class User(Base):
    __tablename__ = "tbl_user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)
    description = Column(String)
  
    garden =  Column(Integer,default=0)
    score =  Column(Integer,default=0)
    goal=Column(Integer,default=0)
    mile=Column(Integer,default=0)
  
  

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    description: str
    score:int
    goal:int
    garden: int
    mile: int
    

 


class UserCreate(BaseModel):
    name: str
    password: str
    email: str
    description: str

class ImageUpload(BaseModel):
    user_id: int
    base64_image: str
    funct:str


 # This is the foreign key