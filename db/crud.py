from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from db.model import User
from db.model import User, UserCreate, UserResponse

Base = sqlalchemy.orm.declarative_base()




async def insert_user( user: UserCreate, db: Session ):
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    return  UserResponse(id=db_user.id, name=db_user.name,email= db_user.email, description= db_user.description, mile=0, garden=0, goal=0,score=0)

async def get_user( uid: int, db: Session ):
    #db_user=db.get(User, uid)
    db_user=db.query(User.id,User.description,User.goal,User.score,User.email,User.name,User.mile, User.garden).filter(User.id==uid).first()
   

    return UserResponse(id=db_user.id, name=db_user.name,email= db_user.email, description= db_user.description,score=db_user.score,goal= db_user.goal, mile=db_user.mile, garden= db_user.garden)


async def update_user(uid: int,type: str ,value: str, db: Session):
    db_user=db.get(User,uid)
    if type == "garden":
        db_user.garden = int(value)
    elif type == "goal":
        db_user.goal = int(value)
    elif type == "mile":
        db_user.mile = int(value)
    elif type == "score":
        db_user.score = int(value)
    elif type == "name":
        db_user.name = value
    elif type == "email":
        db_user.email = value
    else:
        db_user.description = value
    db.commit()



