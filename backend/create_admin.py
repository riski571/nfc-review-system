import sys
sys.path.insert(0, '.')

from app.database.connection import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash

def create_user(name, email, password):
    db = SessionLocal()
    
    # Check if user exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f'Error: User with email {email} already exists')
        db.close()
        return
    
    # Hash password
    password_hash = get_password_hash(password)
    
    # Create user
    user = User(
        name=name,
        email=email,
        password_hash=password_hash
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    print(f'User created successfully!')
    print(f'  ID: {user.id}')
    print(f'  Name: {user.name}')
    print(f'  Email: {user.email}')
    print(f'  Password: {password}')
    
    db.close()

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print('Usage: python create_admin.py "Nama Lengkap" email@domain.com password123')
        print('Example: python create_admin.py "Admin User" admin@nfc.com admin123')
        sys.exit(1)
    
    name = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    
    create_user(name, email, password)
