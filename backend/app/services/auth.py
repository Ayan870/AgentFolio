import json
import os
import hashlib
from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt

SECRET_KEY = "agentfolio-super-secret-change-in-prod"
ALGORITHM = "HS256"
USERS_FILE = "./data/users.json"

# Using direct bcrypt library calls instead of passlib CryptContext due to compatibility issues with Python 3.12+


def load_users() -> dict:
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE) as f:
        return json.load(f)


def save_users(users: dict):
    os.makedirs("./data", exist_ok=True)
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(days=30)
    return jwt.encode({"sub": email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


def get_user_by_email(email: str) -> dict | None:
    users = load_users()
    return users.get(email)


def create_user(name: str, email: str, password: str) -> dict:
    users = load_users()
    if email in users:
        raise ValueError("Email already registered")
    user = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "created_at": datetime.utcnow().isoformat(),
        "user_id": None,  # set after onboarding
    }
    users[email] = user
    save_users(users)
    return user


def link_user_to_agent(email: str, user_id: str):
    users = load_users()
    if email in users:
        users[email]["user_id"] = user_id
        save_users(users)


def update_user_avatar(email: str, avatar_url: str):
    users = load_users()
    if email in users:
        users[email]["avatar_url"] = avatar_url
        save_users(users)