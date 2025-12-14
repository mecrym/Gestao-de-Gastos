from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List, Optional
from pydantic import BaseModel
from database import SessionLocal, engine
from sqlalchemy.orm import Session
import models
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

origins = [ "http://localhost", "http://localhost:3000", "http://localhost:5173"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryModel(CategoryBase):
    id: int
    payments: Annotated[List[PaymentModel], []] = []
    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "API is running!"}

# The categories endpoints
@app.post("/categories/", response_model = CategoryModel, status_code=201)
async def create_category(category: CategoryCreate, db: db_dependency):
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
async def read_categories(db: db_dependency, skip: int = 0, limit: int = 100):
    try:
        categories = db.query(models.Category).order_by(models.Category.name.asc()).offset(skip).limit(limit).all()
        return categories
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/categories/{category_id}", response_model = CategoryModel, status_code = 200)
async def read_category(category_id: int, db: db_dependency):
    try:
        db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code = 404, detail = "Category not found")
        return db_category
    except Exception as e:
        raise HTTPException(status_code  = 500, detail = f"Error: {str(e)}")

@app.put("/categories/{category_id}", response_model = CategoryModel, status_code = 200)
async def update_category(category_id: int, category: CategoryCreate, db: db_dependency):
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
async def delete_category(category_id: int, db: db_dependency):
    try:
        db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code = 404, detail = "Category not found")

        db.delete(db_category)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/search/categories/", response_model = List[CategoryModel], status_code = 200)
async def search_categories(db: db_dependency, name: Optional[str] = None):
    try:
        query = db.query(models.Category)
        if name:
            query = query.filter(models.Category.name.startswith(name))
        query = query.order_by(models.Category.name.asc())
        return query.all()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

# The payment endpoints
@app.post("/payments/", response_model = PaymentModel, status_code = 201)
async def create_payment(payment: PaymentCreate, db: db_dependency):
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

@app.get("/payments/", response_model = List[PaymentModel], status_code = 200)
async def read_payments(db: db_dependency, skip: int = 0, limit: int = 200):
    try:
        payments = db.query(models.Payment).offset(skip).limit(limit).all()
        return payments
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/payments/{payment_id}", response_model = PaymentModel, status_code = 200)
async def read_payment(payment_id: int, db: db_dependency):
    try:
        db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
        if not db_payment:
            raise HTTPException(status_code = 404, detail = "Payment not found")
        return db_payment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/search/payments/", response_model = List[PaymentModel], status_code = 200)
async def search_payments(db: db_dependency, name: Optional[str] = None):
    try:
        query = db.query(models.Payment)
        if name:
            query = query.filter(models.Payment.name.startswith(name))
        query = query.order_by(models.Payment.name.asc())
        return query.all()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.get("/search/payments-by-category/", response_model = List[PaymentModel], status_code = 200)
async def search_payments_by_category(db: db_dependency, name: Optional[str] = None):
    try:
        query = db.query(models.Payment)

        if name:
            categories = (db.query(models.Category).filter(models.Category.name.startswith(name)).all())
            if not categories:
                raise HTTPException(status_code = 404, detail = "Category not found")
            category_ids = [category.id for category in categories]
            query = query.filter(models.Payment.category_id.in_(category_ids))
        query = query.order_by(models.Payment.name.asc())
        return query.all()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")

@app.put("/payments/{payment_id}", response_model = PaymentModel, status_code = 200)
async def update_payment(payment_id: int, payment: PaymentCreate, db: db_dependency):
    try:
        db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
        if not db_payment:
            raise HTTPException(status_code = 404, detail = "payment not found")

        payload = payment.dict()
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

@app.delete("/payments/{payment_id}", status_code = 204)
async def delete_payment(payment_id: int, db: db_dependency):
    try:
        db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
        if not db_payment:
            raise HTTPException(status_code = 404, detail = "Payment not found or does not exist")
        db.delete(db_payment)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail = f"Error: {str(e)}")
