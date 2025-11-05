import motor.motor_asyncio
from core.config import MONGODB_URI

try:
    MONGO_URI = MONGODB_URI
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    db = client["railway_db"]
    
    users_collection = db["users"]
    manufacturers_collection = db["manufacturers"]
    components_collection = db["components"]
    inspections_collection = db["inspections"]
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")