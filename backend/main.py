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
    return {"message": "API is running!"}

# The categories endpoints
@app.post("/categories/", response_model = CategoryModel, status_code=201)
async def create_category(category: CategoryCreate, db: db_dependancy):
    try:
        db_category = models.Category(**category.dict())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/categories/", response_model = List[CategoryModel], status_code = 200)
async def read_categories(db: db_dependancy, skip: int = 0, limit: int = 100): # u may need to alter the limit later, do the front, test it, and then later we see what to do
    try:
        categories = db.query(models.Category).offset(skip).limit(limit).all()
        return categories
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/categories/{category_id}", response_model = CategoryModel, status_code = 200)
async def read_category(category_id: int, db: db_dependancy):
    try:
        db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code = 404, detail = "Category not found")
        return db_category
    except Exception as e:
        raise HTTPException(status_code  = 500, detail = f"Error: {str(e)}")

@app.put("/categories/{category_id}", response_model = CategoryModel, status_code = 200)
async def update_category(category_id: int, category: CategoryCreate, db: db_dependancy):
    try:
        db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code = 404, detail = "Category not found")
        for key, value in category.dict().items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.delete("/categories/{category_id}", status_code = 204)
async def delete_category(category_id: int, db: db_dependancy):
    try:
        db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code = 404, detail = "Category not found")

        num_payments = len(db_category.payments)
        print(f"Deleting {db_category.id} with {num_payments}")

        db.delete(db_category)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

# Don't even think in changing it later for abb, the db alredy does this by defaul!!!!!
@app.get("/search/categories/", response_model = List[CategoryModel], status_code = 200)
async def search_categories(name: Optional[str] = None, db: Session = Depends(get_db)): #look it up later as to why it doesn't' accept de db_dependacy like the others, the message is that it needs a default value
    try:
        query = db.query(models.Category)
        if name:
            query = query.filter(models.Category.name.startswith(name))
        query = query.order_by(models.Category.name.asc())
        return query.all()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

# The payments endpoints
@app.post("/payments/", response_model = PaymentModel, status_code = 201)
async def create_payment(payment: PaymentCreate, db: db_dependancy):
    try:
        category = db.query(models.Category).filter(models.Category.id == payment.category_id).first()
        if not category:
            raise HTTPException(status_code = 400, detail = "category not found or does not exist")

        db_payment = models.Payment(**payment.dict())
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        return db_payment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/payment/", response_model = List[PaymentModel], status_code = 200)
async def read_payments(db: db_dependancy, skip: int = 0, limit: int = 200):# I'm changing the limit because it makes more sence to have more payments than categories, but I will need to adjust it later, who has 200 diferent payments to do???
    try:
        payments = db.query(models.Payment).offset(skip).limit(limit).all()
        return payments
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/payment/{payment_id}", response_model = PaymentModel, status_code = 200)
async def read_payment(payment_id: int, db: db_dependancy):
    try:
        db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
        if not db_payment:
            raise HTTPException(status_code = 404, detail = "Payment not found")
        return db_payment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.put("/payment/{payment_id}", response_model = PaymentModel, status_code = 200)
async def update_payment(payment_id: int, payment: PaymentCreate, db: db_dependancy):
    try:
        db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
        if not db_payment:
            raise HTTPException(status_code = 404, detail = "payment not found")

        payload = payment.dict() #do not use payments, u will mix it up with the other variables and functions later
        if "category_id" in payload:
            new_category = db.query(models.Category).filter(models.Category.id == payload["category_id"]).first()
            if not new_category:
                raise HTTPException(status_code = 400, detail = "category not found or does not exist")

        for key, value in payment.dict().items():
            setattr(db_payment, key, value)
        db.commit()
        db.refresh(db_payment)
        return db_payment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error:{str(e)}")


