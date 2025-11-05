from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from typing import List
from bson import ObjectId
from db.models.component import ComponentIn, ComponentOut
from db.client import components_collection,manufacturers_collection
from core.security import get_current_user

router = APIRouter()


@router.get("/{component_id}", response_model=ComponentOut)
async def get_component(component_id: str, current_user: dict = Depends(get_current_user)):
    try:
        object_id = ObjectId(component_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid component ID format")
    
    component = await components_collection.find_one({"_id": object_id})
    manufacturer = await manufacturers_collection.find_one({"_id": ObjectId(component["manufacturer_id"])}) if component else None
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return ComponentOut(**component,manufacturer=manufacturer["company_name"] if manufacturer else "Unknown")

# Install component (update installation location)
@router.post("/{component_id}/install", response_model=ComponentOut)
async def install_component(component_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    if latitude is None or longitude is None:
        raise HTTPException(status_code=400, detail="Location coordinates required")

    try:
        object_id = ObjectId(component_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid component ID format")

    component = await components_collection.find_one({"_id": object_id})
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    updated = {
        "installation_location": f"{latitude},{longitude}",
        "status": "Installed",
        "updated_at": datetime.utcnow(),
        "installed_by": current_user.get("sub")
    }
    await components_collection.update_one({"_id": object_id}, {"$set": updated})
    component.update(updated)
    return ComponentOut(**component)

# List all components
@router.get("/", response_model=List[ComponentOut])
async def list_components(current_user: dict = Depends(get_current_user)):
    comps = await components_collection.find({}).to_list(100)
    return [ComponentOut(**c) for c in comps]