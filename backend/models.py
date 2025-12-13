from database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey#, DateTime
from sqlalchemy.orm import relationship
# import datetime
# from pydantic import BaseModel

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key = True, index = True)
    name = Column(String, unique = True, index = True)
    description = Column(String, nullable = True)
    color = Column(String, nullable = True)

    payments = relationship("Payment", back_populates = "category", cascade = "all, delete-orphan")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key = True, index = True)
    name = Column(String, index = True)
    date = Column(String, index = True)
    value = Column(Float, nullable = False)
    is_recurring = Column(Boolean, default = False)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable = False)
    category = relationship("Category", back_populates = "payments")
