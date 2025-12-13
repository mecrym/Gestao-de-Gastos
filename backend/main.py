from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List, Optional # because python is dinamically typed... unfortunately...
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware # this... is to defeat u'r greatest enemy, the one who should not be named, the evil CORS...

app = FastAPI()

# Duda U MUST READ THIS!!!
origins = [ "http://localhost", "http://localhost:3000"] # ok, if I remenber corectly, ur frontend uses the 5573 port on ocasion, if u run into a problem, add it here... 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # there are more options, but for now this is enough, we will see later if we need to add more
)

class PaymentBase(BaseModel):
    name: str
    date:str
    value: float
    is_recurring: Optional[bool] = False

class PaymentCreate(PaymentBase):
    category_id: int

class PaymentModel(PaymentBase):
    id: int
    category_id: int
    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = None # typing is easier for me, but if there's time, it wold be beter to selec from a color weel

class CategoryCreate(CategoryBase):
    pass

class CategoryModel(CategoryBase):
    id: int
    payments: Annotated[List[PaymentModel], []] = []
    class Config:
        orm_mode = True

# It shold only be open when there is a request, and it should close it there aren't
# If there's time, u should implement error handling and logging
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependancy = Annotated[Session, Depends(get_db)]
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "API de Gestão de Gastos está rodando!"}

@app.post("/categories/", response_model=CategoryModel, status_code=201)
async def create_category(category: CategoryCreate, db: db_dependancy):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category
@app.get("/categories/", response_model=List[CategoryModel])
async def list_categories(db: db_dependancy):
    categories = db.query(models.Category).all()
    return categories



