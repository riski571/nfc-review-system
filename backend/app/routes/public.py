from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.nfc_card import NFCCard, CardStatus

router = APIRouter()


@router.get("/{token}")
def redirect_card(token: str, request: Request, db: Session = Depends(get_db)):
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
