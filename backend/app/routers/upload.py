from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os
import io
from PIL import Image
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/api/admin", tags=["admin"])

MAX_AVATAR_KB = 200


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
):
    ext = file.filename.rsplit(".", 1)[-1] if "." in (file.filename or "") else "png"
    if ext.lower() not in ("png", "jpg", "jpeg", "gif", "webp"):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()
    file_size_kb = len(contents) / 1024

    # Compress if > 200KB or resize large images
    if ext.lower() in ("jpg", "jpeg", "png", "webp") and (file_size_kb > MAX_AVATAR_KB):
        try:
            img = Image.open(io.BytesIO(contents))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            # Resize if too large
            if max(img.size) > 800:
                img.thumbnail((800, 800), Image.LANCZOS)
            # Save with compression
            out = io.BytesIO()
            fmt = "JPEG" if ext.lower() in ("jpg", "jpeg") else "PNG"
            img.save(out, format=fmt, optimize=True, quality=75)
            contents = out.getvalue()
            if fmt == "PNG":
                ext = "png"  # keep png for transparency
        except Exception:
            pass  # If PIL fails, use original

    filename = f"{os.urandom(8).hex()}.{ext}"
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)
    return {"url": f"/uploads/{filename}"}
