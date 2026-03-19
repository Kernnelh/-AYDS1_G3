from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.db.database import get_db
from sqlalchemy import text
from app.db.database import get_db
from app.models.paciente import Paciente, EstadoUsuarioEnum as EstadoPaciente
from app.models.medico import Medico, EstadoUsuarioEnum as EstadoMedico
from app.schemas.admin import ActualizarEstado
from app.core.security import verificar_token

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


# --- T-005.01: Obtener usuarios pendientes ---
@router.get("/pendientes", tags=["Administrador"])
def obtener_usuarios_pendientes(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token) # <--- ¡AQUÍ ESTÁ EL GUARDIA!
):
    # (Opcional) Podemos verificar que quien está entrando realmente tenga el rol de administrador
    if usuario_actual.get("rol") != "administrador":
        raise HTTPException(status_code=403, detail="No tienes permisos de administrador")

    pacientes_pendientes = db.query(Paciente).filter(Paciente.estado == EstadoPaciente.Pendiente).all()
    medicos_pendientes = db.query(Medico).filter(Medico.estado == EstadoMedico.Pendiente).all()

    return {
        "pacientes": pacientes_pendientes,
        "medicos": medicos_pendientes
    }

# --- T-005.02: Cambiar estado de usuario (Aceptar/Rechazar) ---
@router.patch("/usuarios/{rol}/{id_usuario}/estado", tags=["Administrador"])
def actualizar_estado_usuario(
    rol: str, 
    id_usuario: int, 
    datos: ActualizarEstado, 
    db: Session = Depends(get_db)
):
    if rol.lower() == "paciente":
        usuario = db.query(Paciente).filter(Paciente.id_paciente == id_usuario).first()
    elif rol.lower() == "medico":
        usuario = db.query(Medico).filter(Medico.id_medico == id_usuario).first()
    else:
        raise HTTPException(status_code=400, detail="El rol debe ser 'paciente' o 'medico'")

    if not usuario:
        raise HTTPException(status_code=404, detail=f"{rol.capitalize()} no encontrado")

    # Actualizamos el estado (ACTIVO o RECHAZADO)
    usuario.estado = datos.estado
    db.commit()
    
    return {"mensaje": f"Estado del {rol} actualizado exitosamente a {datos.estado.value}"}