from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    MANUFACTURER = "MANUFACTURER"
    QUALITY_INSPECTOR = "QUALITY_INSPECTOR"
    WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER"
    INSTALLATION_TEAM = "INSTALLATION_TEAM"
    FIELD_INSPECTOR = "FIELD_INSPECTOR"
class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone: str
    role: UserRole

    # Employee fields (only stored for railway employees)
    employee_id: Optional[str] = None
    department: Optional[str] = None
    railway_zone: Optional[str] = None
    division: Optional[str] = None

    # Manufacturer fields (only stored in manufacturers_collection)
    company_name: Optional[str] = None
    address: Optional[str] = None
    license_number: Optional[str] = None
    registration_date: Optional[datetime] = None


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone: str
    role: UserRole
    
    # Manufacturer-specific fields (optional)
    company_name: Optional[str] = None
    license_number: Optional[str] = None
    address: Optional[str] = None
    registration_date: Optional[str] = None
    
    # Employee-specific fields (optional)
    employee_id: Optional[str] = None
    department: Optional[str] = None
    railway_zone: Optional[str] = None
    division: Optional[str] = None

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    phone: str
    role: UserRole
    password: str
    status: str = "ACTIVE"
    created_at: datetime
    updated_at: datetime

    # employee-specific (allowed in DB if railway employee)
    employee_id: Optional[str] = None
    department: Optional[str] = None
    railway_zone: Optional[str] = None
    division: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str
    role: UserRole

class UserResponse(BaseModel):
    username: str
    email: str
    role: UserRole
    status: str