# Import necessary modules and classes
from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from ai.ai import describe_picture, describe_base64_picture
from db import crud as crud
import db.db_mgr as db_mgr  
from db.model import ImageUpload, User, UserCreate, UserResponse
from fastapi import File, UploadFile
import base64
# FastAPI app instance
app = FastAPI()
 
# Database setup
#DATABASE_URL = "sqlite:///./test.db"
#engine = create_engine(DATABASE_URL)
#sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_mgr.engine)


# Create tables
db_mgr.base.metadata.create_all(bind=db_mgr.engine)

# Dependency to get the database session
def get_db():
	db = db_mgr.sessionLocal()
	try:
		yield db
	finally:
		db.close()

# Creating user model for request data             
# Creating user model for response data

# API endpoint to create an item
@app.post("/create_user", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):



    return await crud.insert_user(user, db)

# API endpoint to read an item by ID
@app.get("/users/{user_id}", response_model=UserResponse)
async def read_user(user_id: int, db: Session = Depends(get_db)):

	return await crud.get_user(user_id, db)

# API endpoint to update item
@app.get("/update_user/{user_id}/{type}/{value}")
async def update_user(user_id: int, type: str, value: str, db: Session = Depends(get_db)):

	await crud.update_user(user_id,type,value,db)
	return "ok"


@app.post("/upload_picture")
async def upload_picture(funct: str, file: UploadFile = File(...)):

	user_image = await file.read()
	#base64_image = base64.b64encode(user_image).decode('utf-8')  
	return await describe_picture(funct,user_image )

@app.post("/get_picture_description")
async def describe_picture(iml:ImageUpload):

	 
	#base64_image = base64.b64encode(user_image).decode('utf-8')  
	return await describe_base64_picture(uid=iml.user_id,base64_image=iml.base64_image,funct=iml.funct   )

'''
async def rate_sort( type):
	if type == "sort":
'''

'''

@app.post("/get_picture_description")
async def get_picture_description(user_image :str):

	 
	return describe_picture(base64_image=user_image)
'''
 

app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
 
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

