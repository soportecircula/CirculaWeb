from pydantic import BaseModel
from datetime import datetime

class ImpactMetricBase(BaseModel):
    key_name: str
    label: str
    value: float
    unit: str | None = None
    description: str | None = None

class ImpactMetricCreate(ImpactMetricBase):
    pass

class ImpactMetricUpdate(ImpactMetricBase):
    pass

class ImpactMetricRead(ImpactMetricBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
