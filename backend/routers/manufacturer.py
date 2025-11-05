import io
import base64
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
import qrcode
from db.client import components_collection, manufacturers_collection
from db.models.component import ComponentIn, ComponentOut
from core.security import get_current_manufacturer
from bson import ObjectId
import uuid as uuidlib
from models.Manufacturer import ManufacturerOut

router = APIRouter()

@router.get("/mydetails", response_model=ManufacturerOut)
async def get_my_details(username: str = Depends(get_current_manufacturer)):
    manufacturer = await manufacturers_collection.find_one({"username": username})
    if not manufacturer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Manufacturer not found")
    
    return ManufacturerOut(
        id=str(manufacturer["_id"]),
        company_name=manufacturer["company_name"],
        contact_email=manufacturer["contact_email"],
        address=manufacturer["address"],
        license_number=manufacturer["license_number"],
        approval_status=manufacturer.get("approval_status", "PENDING"),
        registration_date=manufacturer["registration_date"],
        
    )

@router.post("/components/generate_qr")
async def generate_qr(comp: ComponentIn, username: str = Depends(get_current_manufacturer)):
    manufacturer = await manufacturers_collection.find_one({"username": username})
    if not manufacturer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Manufacturer not found")
    
    manufacturer_id = str(manufacturer["_id"])
    comp_uuid = comp.uuid or str(uuidlib.uuid4())
    
    # Generate QR code and component ID
    qr_code = f"QR{datetime.now().strftime('%Y%m%d')}{comp_uuid[-8:]}"

    # Calculate expiry date based on warranty
    expected_expiry = comp.production_date + timedelta(days=comp.warranty_period * 30)
    
    doc = {
        "component_id": f"COMP{datetime.now().strftime('%Y%m%d')}{len(await components_collection.find().to_list(None)) + 1:06d}",
        "qr_code": qr_code,
        "item_code": comp.item_code,
        "component_name": comp.component_name,
        "specifications": comp.specifications,
        "batch_number": comp.batch_number or f"BATCH{datetime.now().strftime('%Y%m%d')}01",
        "serial_number": comp.serial_number or f"SER{datetime.now().strftime('%Y%m%d')}{comp_uuid[-6:]}",
        "manufacturer_id": manufacturer_id,
        "production_date": comp.production_date,
        "warranty_period": comp.warranty_period,
        "unit_weight": comp.unit_weight,
        "irs_specification": comp.irs_specification,
        "generated_at": datetime.utcnow(),
        "qc_status": "Pending",
        "uuid": comp_uuid,
        "expected_expiry": expected_expiry
    }

    result = await components_collection.insert_one(doc)
    new_id = str(result.inserted_id)

    # Generate QR payload
    payload = new_id
    qr = qrcode.QRCode(box_size=10, border=4)
    qr.add_data(str(payload))
    qr.make(fit=True)
    img = qr.make_image(fill="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_base64 = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

    await components_collection.update_one(
        {"_id": ObjectId(new_id)},
        {"$set": {"qr_data": qr_base64}}
    )

    comp_out = {**doc, "_id": new_id, "qr_data": qr_base64}
    return {"component": comp_out, "message": "Component generated successfully"}

@router.get("/components/list")
async def list_components(username: str = Depends(get_current_manufacturer)):
    manufacturer = await manufacturers_collection.find_one({"username": username})
    if not manufacturer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Manufacturer not found")
    
    manufacturer_id = str(manufacturer["_id"])
    cursor = components_collection.find({"manufacturer_id": manufacturer_id})
    components = []
    
    async for c in cursor:
        components.append({
            "_id": str(c["_id"]),
            "component_id": c.get("component_id"),
            "qr_code": c.get("qr_code"),
            "item_code": c.get("item_code"),
            "component_name": c.get("component_name"),
            "specifications": c.get("specifications", {}),
            "batch_number": c.get("batch_number"),
            "serial_number": c.get("serial_number"),
            "manufacturer_id": c.get("manufacturer_id"),
            "production_date": c.get("production_date"),
            "warranty_period": c.get("warranty_period", 24),
            "unit_weight": c.get("unit_weight"),
            "irs_specification": c.get("irs_specification"),
            "qr_data": c.get("qr_data"),
            "generated_at": c.get("generated_at"),
            "qc_status": c.get("qc_status", "Pending"),
            "uuid": c.get("uuid")
        })
    
    return {"components": components}

@router.get("/components/{component_id}")
async def get_component(component_id: str, username: str = Depends(get_current_manufacturer)):
    manufacturer = await manufacturers_collection.find_one({"username": username})
    if not manufacturer:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    
    try:
        component = await components_collection.find_one({
            "_id": ObjectId(component_id),
            "manufacturer_id": str(manufacturer["_id"])
        })
        if not component:
            raise HTTPException(status_code=404, detail="Component not found")
        
        return {"component": {**component, "_id": str(component["_id"])}}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid component ID")
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    try:
        component = await components_collection.find_one({
            "_id": ObjectId(component_id),
            "manufacturerId": ObjectId(str(manufacturer["_id"]))
        })
        if not component:
            raise HTTPException(status_code=404, detail="Component not found")
        return {
            "component": {
                "_id": str(component["_id"]),
                "manufacturerId": str(component["manufacturerId"]),
                "componentName": component["componentName"],
                "serialNumber": component["serialNumber"],
                "batchNumber": component["batchNumber"],
                "generatedAt": component["generatedAt"],
                "qrData": component.get("qrData", None),
                "qcStatus": component.get("qcStatus"),
                "qcDate": component.get("qcDate"),
                "inspectorId": component.get("inspectorId"),
                "warehouseId": component.get("warehouseId"),
                "installationLocation": component.get("installationLocation"),
                "lastMaintenance": component.get("lastMaintenance"),
                "expectedExpiry": component.get("expectedExpiry"),
                "uuid": component.get("uuid")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid component ID")

@router.get("/profile", response_model=dict)
async def get_manufacturer_profile(email: str = Depends(get_current_manufacturer)):
    manufacturer = await manufacturers_collection.find_one({"email": email})
    if not manufacturer:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    return {
        "manufacturer": {
            "companyName": manufacturer["companyName"],
            "email": manufacturer["email"],
            "contactNumber": manufacturer["contactNumber"],
            "address": manufacturer["address"],
            "registrationNumber": manufacturer["registrationNumber"],
            "createdAt": manufacturer["createdAt"],
        }
    }

@router.get("/components/daily_counts_by_date?date={date}", response_model=dict)
async def daily_counts_by_date(date: str, username: str = Depends(get_current_manufacturer)):
    """
    Returns a dict of {date: {component_name: count, ...}, ...} for all days for this manufacturer.
    """
    manufacturer = await manufacturers_collection.find_one({"username": username})
    if not manufacturer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Manufacturer not found")
    manufacturer_id = str(manufacturer["_id"])

    component_types = [
        "Rail Clip",
        "Fish Plate",
        "Rail Pad",
        "Base Plate"
    ]
    counts_by_date = {}
    cursor = components_collection.find({"manufacturer_id": manufacturer_id})
    async for c in cursor:
        comp_name = c.get("component_name")
        gen_at = c.get("generated_at")
        if comp_name in component_types and gen_at:
            try:
                date_str = gen_at.date().isoformat() if hasattr(gen_at, 'date') else str(gen_at)[:10]
            except Exception:
                continue
            if date_str not in counts_by_date:
                counts_by_date[date_str] = {name: 0 for name in component_types}
            counts_by_date[date_str][comp_name] += 1
    return {"counts_by_date": counts_by_date}