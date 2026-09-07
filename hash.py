from backend.app.utils.security import get_password_hash

password = "saya1234"

hashed = get_password_hash(password)

print(hashed)