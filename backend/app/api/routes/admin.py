from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.db.database import get_db
from sqlalchemy import text

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

@router.post("/auth2")
async def validar_segundo_factor(
    usuario: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # 1. Validar el nombre exacto del archivo
    if file.filename != "auth2-ayd1.txt":
        raise HTTPException(status_code=400, detail="El archivo debe llamarse exactamente 'auth2-ayd1.txt'")

    # 2. Leer el contenido del archivo subido
    contenido_bytes = await file.read()
    contrasena_archivo = contenido_bytes.decode("utf-8").strip() # Convertimos a texto y quitamos espacios

    # 3. Buscar al administrador en la base de datos
    # Como no tenemos modelo de SQLAlchemy para Admin, usamos una consulta SQL directa
    resultado = db.execute(
        text("SELECT contrasena_encrp FROM Administrador WHERE usuario = :user"), 
        {"user": usuario}
    ).fetchone()

    if not resultado:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")

    hash_guardado = resultado[0]

    # 4. Validar la contraseña del archivo contra el hash de la base de datos
    # NOTA: Si el profesor pide que el archivo contenga literalmente el texto encriptado (el hash), 
    # cambia esta línea por: if contrasena_archivo != hash_guardado:
    if not pwd_context.verify(contrasena_archivo, hash_guardado):
        raise HTTPException(status_code=401, detail="La contraseña del archivo es incorrecta")

    # Si todo está bien, le damos acceso
    return {"mensaje": "Autenticación de segundo factor exitosa. Bienvenido."}