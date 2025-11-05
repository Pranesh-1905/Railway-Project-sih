from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth,manufacturer,components,inspection
import os

MONGO_URI = os.getenv("MONGODB_URI")

app = FastAPI(title="Railway QR System", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(manufacturer.router, prefix="/manufacturer", tags=["Manufacturer"])
app.include_router(components.router, prefix="/components", tags=["Components"])
app.include_router(inspection.router, prefix="/inspection", tags=["Inspection"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)