from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import random
from app.database.connection import get_db
from app.models.nfc_card import NFCCard, CardStatus, GlobalActivationCode
from app.schemas.nfc_card import NFCCardResponse, NFCCardPublicActivate

router = APIRouter()


def generate_new_code():
    return str(random.randint(1000, 9999))


@router.get("/c/{token}")
def get_card_public(token: str, db: Session = Depends(get_db)):
    card = db.query(NFCCard).filter(NFCCard.token == token).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    if card.status == CardStatus.inactive:
        return {
            "status": "inactive",
            "token": token,
            "message": "Card is not activated yet"
        }
    
    card.tap_count += 1
    db.commit()
    
    return {
        "status": "active",
        "destination_url": card.destination_url,
        "business_name": card.business_name,
        "tap_count": card.tap_count
    }


@router.post("/c/{token}/activate", response_model=NFCCardResponse)
def activate_card_public(
    token: str,
    activate_data: NFCCardPublicActivate,
    db: Session = Depends(get_db)
):
    global_code = db.query(GlobalActivationCode).filter(
        GlobalActivationCode.is_active == True
    ).first()
    
    if not global_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode aktivasi tidak valid"
        )
    
    if activate_data.activation_code != global_code.code:
        global_code.failed_attempts += 1
        if global_code.failed_attempts >= 3:
            new_code = generate_new_code()
            while db.query(GlobalActivationCode).filter(GlobalActivationCode.code == new_code).first():
                new_code = generate_new_code()
            global_code.code = new_code
            global_code.failed_attempts = 0
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode aktivasi salah"
        )
    
    card = db.query(NFCCard).filter(NFCCard.token == token).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    
    if card.status == CardStatus.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card sudah aktif"
        )
    
    card.business_name = activate_data.business_name
    card.place_id = activate_data.place_id
    card.destination_url = str(activate_data.google_place_url)
    card.status = CardStatus.active
    
    global_code.failed_attempts = 0
    
    db.commit()
    db.refresh(card)
    return card
