from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.connection import Base
from app.models.user import User
import enum


class CardStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class NFCCard(Base):
    __tablename__ = "nfc_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, index=True, nullable=False)
    business_name = Column(String(255), nullable=False)
    destination_url = Column(Text, nullable=True)
    place_id = Column(String(255), nullable=True)
    status = Column(Enum(CardStatus), default=CardStatus.inactive, nullable=False)
    tap_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="cards")


User.cards = relationship("NFCCard", order_by=NFCCard.id, back_populates="user")


class GlobalActivationCode(Base):
    __tablename__ = "global_activation_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(4), unique=True, nullable=False)
    failed_attempts = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
