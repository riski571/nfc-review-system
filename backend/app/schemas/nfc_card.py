from pydantic import BaseModel, HttpUrl, field_validator
from datetime import datetime
from typing import Optional
from app.models.nfc_card import CardStatus


class NFCCardBase(BaseModel):
    business_name: str
    destination_url: Optional[HttpUrl] = None
    place_id: Optional[str] = None


class NFCCardCreate(NFCCardBase):
    pass


class NFCCardUpdate(BaseModel):
    business_name: Optional[str] = None
    destination_url: Optional[HttpUrl] = None
    place_id: Optional[str] = None
    status: Optional[CardStatus] = None


class NFCCardResponse(NFCCardBase):
    id: int
    user_id: int
    token: str
    status: CardStatus
    tap_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class NFCCardActivate(BaseModel):
    business_name: str
    destination_url: HttpUrl


class NFCCardPublicActivate(BaseModel):
    business_name: str
    place_id: str
    google_place_url: HttpUrl
    activation_code: str

    @field_validator('activation_code')
    @classmethod
    def validate_activation_code(cls, v):
        if not v.isdigit() or len(v) != 4:
            raise ValueError('Kode aktivasi harus 4 digit angka')
        return v
