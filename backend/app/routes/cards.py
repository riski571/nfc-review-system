from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.nfc_card import NFCCard
from app.schemas.nfc_card import NFCCardCreate, NFCCardUpdate, NFCCardResponse, NFCCardActivate
from app.utils.dependencies import get_current_user
from app.utils.token import generate_unique_token

router = APIRouter()


@router.get("/", response_model=List[NFCCardResponse])
def get_cards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cards = db.query(NFCCard).filter(NFCCard.user_id == current_user.id).all()
    return cards


@router.post("/", response_model=NFCCardResponse, status_code=status.HTTP_201_CREATED)
def create_card(
    card_data: NFCCardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    token = generate_unique_token()
    while db.query(NFCCard).filter(NFCCard.token == token).first():
        token = generate_unique_token()
    
    card = NFCCard(
        user_id=current_user.id,
        token=token,
        business_name=card_data.business_name,
        destination_url=str(card_data.destination_url) if card_data.destination_url else None,
        place_id=card_data.place_id
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.get("/{card_id}", response_model=NFCCardResponse)
def get_card(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(NFCCard).filter(
        NFCCard.id == card_id,
        NFCCard.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return card


@router.put("/{card_id}", response_model=NFCCardResponse)
def update_card(
    card_id: int,
    card_data: NFCCardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(NFCCard).filter(
        NFCCard.id == card_id,
        NFCCard.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    
    if card_data.business_name is not None:
        card.business_name = card_data.business_name
    if card_data.destination_url is not None:
        card.destination_url = str(card_data.destination_url)
    if card_data.place_id is not None:
        card.place_id = card_data.place_id
    if card_data.status is not None:
        card.status = card_data.status
    
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(NFCCard).filter(
        NFCCard.id == card_id,
        NFCCard.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    db.delete(card)
    db.commit()
    return None


@router.post("/{token}/activate", response_model=NFCCardResponse)
def activate_card(
    token: str,
    activate_data: NFCCardActivate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(NFCCard).filter(NFCCard.token == token).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    
    if card.user_id is not None and card.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card already belongs to another user"
        )
    
    card.user_id = current_user.id
    card.business_name = activate_data.business_name
    card.destination_url = str(activate_data.destination_url)
    card.status = "active"
    
    db.commit()
    db.refresh(card)
    return card


@router.post("/{card_id}/activate", response_model=NFCCardResponse)
def activate_card_by_id(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(NFCCard).filter(
        NFCCard.id == card_id,
        NFCCard.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    
    card.status = "active"
    db.commit()
    db.refresh(card)
    return card
