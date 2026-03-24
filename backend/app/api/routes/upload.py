import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

# Definimos la carpeta donde se guardarán físicamente las fotos
UPLOAD_DIR = "app/static/fotos"
# Le decimos a Python que cree la carpeta si no existe
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/fotografia")
async def subir_fotografia(file: UploadFile = File(...)):
    # 1. Validar que el archivo sea realmente una imagen
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen válida")

    # 2. Extraer la extensión (jpg, png, etc.) y generar un nombre único
    extension = file.filename.split(".")[-1]
    nombre_unico = f"{uuid.uuid4()}.{extension}"
    ruta_completa = os.path.join(UPLOAD_DIR, nombre_unico)

    # 3. Guardar el archivo en el disco duro
    with open(ruta_completa, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. Construir la URL pública que guardaremos en la base de datos
    # (Ojo: 127.0.0.1:8000 es para tu entorno local)
    url_foto = f"http://127.0.0.1:8000/static/fotos/{nombre_unico}"
    
    return {
        "mensaje": "Fotografía subida exitosamente",
        "url": url_foto,
        "nombre_archivo": nombre_unico
    }