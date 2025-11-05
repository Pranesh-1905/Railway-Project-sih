from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


class Manufacturer(BaseModel):
    username: str
    name: str 
    contact_email: EmailStr
    address: str 
    license_number: str
    approval_status: str = "PENDING"
    rating: Optional[float] = 0.0
    specialization: Optional[str] = None
    registration_date: datetime
    last_audit_date: Optional[date] = None 

class ManufacturerOut(BaseModel):
    id: str
    name: str 
    contact_email: EmailStr
    address: str 
    license_number: str
    approval_status: str
    registration_date: datetime