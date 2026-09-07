from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine
from app.models import user, nfc_card
from app.routes import auth, cards, public, public_api, admin
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
import random

app = FastAPI(title="NFC Review Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nfc-review-system.riskisk7880.workers.dev",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user.Base.metadata.create_all(bind=engine)
nfc_card.Base.metadata.create_all(bind=engine)


def seed_global_activation_code():
    db = SessionLocal()
    try:
        existing = db.query(nfc_card.GlobalActivationCode).first()
        if not existing:
            code = str(random.randint(1000, 9999))
            global_code = nfc_card.GlobalActivationCode(
                code=code,
                failed_attempts=0,
                is_active=True
            )
            db.add(global_code)
            db.commit()
            print(f"Global activation code seeded: {code}")
    finally:
        db.close()


@app.on_event("startup")
def startup_event():
    seed_global_activation_code()


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(cards.router, prefix="/api/cards", tags=["NFC Cards"])
app.include_router(public.router, prefix="/c", tags=["Public"])
app.include_router(public_api.router, prefix="/api/public", tags=["Public API"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/")
def root():
    return {"message": "NFC Review Manager API", "status": "running"}
