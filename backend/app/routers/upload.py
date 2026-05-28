from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
):
    ext = file.filename.rsplit(".", 1)[-1] if "." in (file.filename or "") else "png"
    if ext.lower() not in ("png", "jpg", "jpeg", "gif", "webp"):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    filename = f"{os.urandom(8).hex()}.{ext}"
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"url": f"/uploads/{filename}"}
