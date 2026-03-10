from pydantic import BaseModel
from typing import Optional

# Схема для перевірки доступу школи
class VerifyRequest(BaseModel):
    name: str
    user: str
    password: str

# Схема для Webhook від Mosquitto
class MQTTAuth(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    clientid: Optional[str] = None
    topic: Optional[str] = None
    acc: Optional[int] = None

# Схема для команди OTA
class OTACommand(BaseModel):
    school_name: str
    device_id: Optional[str] = None

# Схема для відповіді з підписками
class SubscriptionsResponse(BaseModel):
    basic: bool = True
    monitoring: bool
    security: bool
    announcements: bool
