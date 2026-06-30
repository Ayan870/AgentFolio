from fastapi import APIRouter, HTTPException, Header, UploadFile, File
from pydantic import BaseModel
from app.services.auth import (
    create_user, get_user_by_email, verify_password,
    create_token, decode_token, link_user_to_agent,
    update_user_avatar
)
import shutil
import os
import json

router = APIRouter()


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(req: SignupRequest):
    if len(req.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    try:
        user = create_user(req.name, req.email, req.password)
    except ValueError as e:
        raise HTTPException(400, str(e))

    token = create_token(req.email)
    return {
        "token": token,
        "name": user["name"],
        "email": user["email"],
        "user_id": user["user_id"],
        "has_agent": False,
        "avatar_url": user.get("avatar_url"),
    }


@router.post("/login")
def login(req: LoginRequest):
    user = get_user_by_email(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")

    token = create_token(req.email)
    has_agent = user.get("user_id") is not None

    return {
        "token": token,
        "name": user["name"],
        "email": user["email"],
        "user_id": user.get("user_id"),
        "has_agent": has_agent,
        "avatar_url": user.get("avatar_url"),
    }


@router.get("/me")
def me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = authorization.replace("Bearer ", "")
    email = decode_token(token)
    if not email:
        raise HTTPException(401, "Invalid or expired token")

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(404, "User not found")

    has_agent = user.get("user_id") is not None
    agent_data = None

    if has_agent:
        profile_path = f"./data/profiles/{user['user_id']}.json"
        if os.path.exists(profile_path):
            with open(profile_path) as f:
                agent_data = json.load(f)

    return {
        "name": user["name"],
        "email": user["email"],
        "user_id": user.get("user_id"),
        "has_agent": has_agent,
        "agent": agent_data,
        "avatar_url": user.get("avatar_url"),
    }


@router.post("/link-agent")
def link_agent(body: dict, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = authorization.replace("Bearer ", "")
    email = decode_token(token)
    if not email:
        raise HTTPException(401, "Invalid token")

    user_id = body.get("user_id")
    if not user_id:
        raise HTTPException(400, "user_id required")

    link_user_to_agent(email, user_id)
    return {"success": True}


@router.post("/upload-avatar")
def upload_avatar(file: UploadFile = File(...), authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = authorization.replace("Bearer ", "")
    email = decode_token(token)
    if not email:
        raise HTTPException(401, "Invalid token")

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(404, "User not found")

    user_id = user.get("user_id")
    safe_name = user_id if user_id else email.replace("@", "_at_").replace(".", "_dot_")

    os.makedirs("./data/avatars", exist_ok=True)
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "png"
    file_name = f"{safe_name}.{file_extension}"
    file_path = f"./data/avatars/{file_name}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    avatar_url = f"/data/avatars/{file_name}"
    update_user_avatar(email, avatar_url)

    # Also update the user's agent profile JSON to include this avatar URL if it exists
    if user_id:
        profile_path = f"./data/profiles/{user_id}.json"
        if os.path.exists(profile_path):
            try:
                with open(profile_path, "r") as f:
                    profile_data = json.load(f)
                profile_data["avatar_url"] = avatar_url
                with open(profile_path, "w") as f:
                    json.dump(profile_data, f, indent=2)
            except Exception as e:
                print(f"Error updating agent profile avatar: {e}")

    return {"success": True, "avatar_url": avatar_url}