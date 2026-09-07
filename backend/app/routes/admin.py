from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.nfc_card import GlobalActivationCode
from app.models.user import User
from app.utils.dependencies import get_current_user
from pydantic import BaseModel, field_validator

router = APIRouter()


class ActivationCodeUpdate(BaseModel):
    code: str

    @field_validator('code')
    @classmethod
    def validate_code(cls, v):
        if not v.isdigit() or len(v) != 4:
            raise ValueError('Kode aktivasi harus 4 digit angka')
        return v


@router.get("/activation-code")
def get_activation_code(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    global_code = db.query(GlobalActivationCode).filter(
        GlobalActivationCode.is_active == True
    ).first()
    
    if not global_code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tidak ada kode aktivasi aktif"
        )
    
    return {
        "code": global_code.code,
        "failed_attempts": global_code.failed_attempts,
        "is_active": global_code.is_active
    }


@router.put("/activation-code")
def update_activation_code(
    code_data: ActivationCodeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    global_code = db.query(GlobalActivationCode).filter(
        GlobalActivationCode.is_active == True
    ).first()
    
    if not global_code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tidak ada kode aktivasi aktif"
        )
    
    global_code.code = code_data.code
    global_code.failed_attempts = 0
    db.commit()
    db.refresh(global_code)
    
    return {
        "code": global_code.code,
        "failed_attempts": global_code.failed_attempts,
        "is_active": global_code.is_active
    }
