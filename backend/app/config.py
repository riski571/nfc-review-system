from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "mysql+pymysql://root:password@localhost:3306/nfc_review_db"
    secret_key: str = "your-secret-key-change-this-in-production-please-use-strong-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    class Config:
        env_file = ".env"


settings = Settings()
