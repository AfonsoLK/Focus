
from ninja import Schema
from datetime import datetime
from typing import Optional

class TaskSchema(Schema):
    id: Optional[int] = None
    titulo: str
    status_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None