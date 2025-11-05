from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from db.client import components_collection, inspections_collection, manufacturers_collection
from models.Inspection import InspectionCreate, InspectionOut
from db.models.component import ComponentOut
from core.security import get_current_user

router = APIRouter()

# Fetch installed component by ID
@router.get("/component/{component_id}")
async def get_component(component_id: str):
    try:
        object_id = ObjectId(component_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid component ID format")
    
    component = await components_collection.find_one({"_id": object_id})
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    
    # Fetch manufacturer information
    manufacturer = None
    if component.get("manufacturer_id"):
        try:
            manufacturer = await manufacturers_collection.find_one({"_id": ObjectId(component["manufacturer_id"])})
        except:
            pass
    
    return ComponentOut(
        **component,
        manufacturer=manufacturer["company_name"] if manufacturer else "Unknown"
    )


# Submit inspection report
@router.post("/report")
async def submit_inspection(
    report: InspectionCreate, 
    current_user: dict = Depends(get_current_user)
):
    try:
        component_object_id = ObjectId(report.component_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid component ID format")
    
    component = await components_collection.find_one({"_id": component_object_id})
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    
    report_dict = report.dict()
    report_dict["component_id"] = str(component_object_id)
    report_dict["inspected_by"] = current_user.get("sub")
    report_dict["inspected_at"] = datetime.utcnow()
    
    # Insert inspection report
    result = await inspections_collection.insert_one(report_dict)

    # If defective → update component status
    if report.status.upper() == "DEFECTED":
        await components_collection.update_one(
            {"_id": component_object_id},
            {"$set": {"status": "Needs Replacement", "updated_at": datetime.utcnow()}}
        )

    return {"message": "Inspection submitted", "inspection_id": str(result.inserted_id)}


# Fetch inspection history for a component
@router.get("/history/{component_id}", response_model=list[InspectionOut])
async def inspection_history(component_id: str):
    try:
        object_id = ObjectId(component_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid component ID format")
    
    inspections = []
    async for insp in inspections_collection.find({"component_id": str(object_id)}).sort("inspected_at", -1):
        insp["inspection_id"] = str(insp["_id"])
        inspections.append(InspectionOut(**insp))
    
    return inspections
