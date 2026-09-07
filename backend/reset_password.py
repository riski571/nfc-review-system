import sys
sys.path.insert(0, '.')

from app.database.connection import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash

def reset_password(email, new_password):
    db = SessionLocal()
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print(f'Error: User with email {email} not found')
        db.close()
        return
    
    user.password_hash = get_password_hash(new_password)
    db.commit()
    
    print(f'Password reset successful!')
    print(f'  Email: {user.email}')
    print(f'  Name: {user.name}')
    print(f'  New Password: {new_password}')
    
    db.close()

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python reset_password.py email@domain.com newpassword123')
        print('Example: python reset_password.py admin@nfc.com admin123')
        sys.exit(1)
    
    email = sys.argv[1]
    new_password = sys.argv[2]
    
    reset_password(email, new_password)
