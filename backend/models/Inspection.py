from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InspectionCreate(BaseModel):
    component_id: str
    inspected_by: Optional[str] = None
    status: str  # "OK" or "DEFECTED"
    defect_type: Optional[str] = None
    comments: Optional[str] = None

class InspectionOut(InspectionCreate):
    inspection_id: str
    inspected_by: Optional[str] = None
    inspected_at: Optional[datetime] = None
