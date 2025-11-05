from fastapi import APIRouter, HTTPException, Depends, Response
from passlib.context import CryptContext
from datetime import datetime, timedelta
from db.client import users_collection, manufacturers_collection  # your db access
from models.User import UserCreate, UserLogin
from core.security import get_current_user
from core.security import create_access_token, get_password_hash,verify_password

SECRET_KEY = "your-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()


@router.post("/register")
async def register_user(user: UserCreate):
    print(f"DEBUG: Received registration data: {user.dict()}")
    
    existing = await users_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pwd = get_password_hash(user.password)
    now = datetime.utcnow()

    # Always keep core user data
    user_db = {
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "password": hashed_pwd,
        "status": "ACTIVE" if user.role != "MANUFACTURER" else "PENDING",
        "created_at": now,
        "updated_at": now,
    }
    
    # If employee → add employee-specific fields into users_collection
    if user.role != "MANUFACTURER":
        if user.employee_id:
            user_db["employee_id"] = user.employee_id
        if user.department:
            user_db["department"] = user.department
        if user.railway_zone:
            user_db["railway_zone"] = user.railway_zone
        if user.division:
            user_db["division"] = user.division
    
    await users_collection.insert_one(user_db)
    
    # If manufacturer → store manufacturer details separately
    if user.role == "MANUFACTURER":
        manufacturer_profile = {
            "username": user.username,
            "company_name": user.company_name or '',
            "contact_email": user.email,
            "address": user.address or '',
            "license_number": user.license_number or '',
            "registration_date": user.registration_date or '',
        }
        await manufacturers_collection.insert_one(manufacturer_profile)
    
    return {"message": "User registered successfully"}


@router.post("/login")
async def login(response: Response, login_data: UserLogin):
    user = await users_collection.find_one({"username": login_data.username, "role": login_data.role})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}
    )

    # Set HttpOnly cookie (for browsers)
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,  # set True in production
    )

    # Return JSON with token (for mobile apps)
    return {
        "user": {"username": user["username"], "role": user["role"]},
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Login successful"
    }


@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "username": current_user.get("sub"),
        "role": current_user.get("role")
    }

@router.get("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}