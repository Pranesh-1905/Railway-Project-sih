from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ComponentIn(BaseModel):
    qr_code: Optional[str] = None
    item_code: str
    component_name: str
    specifications: Dict[str, Any]
    batch_number: Optional[str] = None
    serial_number: Optional[str] = None
    production_date: datetime
    warranty_period: int = 24
    unit_weight: float
    irs_specification: str
    uuid: Optional[str] = None

class ComponentOut(BaseModel):
    component_id: str
    qr_code: str
    item_code: str
    component_name: str
    specifications: Dict[str, Any]
    batch_number: str
    serial_number: str
    manufacturer_id: str
    manufacturer : Optional[str] = None
    production_date: datetime
    status : Optional[str] = None
    warranty_period: int
    unit_weight: float
    irs_specification: str
    qr_data: Optional[str] = None
    generated_at: datetime
    qc_status: str = "Pending"
    qc_date: Optional[datetime] = None
    inspector_id: Optional[str] = None
    warehouse_id: Optional[str] = None
    installation_location: Optional[str] = None
    last_maintenance: Optional[datetime] = None
    expected_expiry: Optional[datetime] = None
