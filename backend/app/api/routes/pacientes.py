from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.db.database import get_db
from app.models.paciente import Paciente, EstadoUsuarioEnum
from app.schemas.paciente import PacienteCreate

router = APIRouter()
# Configuramos Passlib para usar SHA-256
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

@router.post("/registro", status_code=status.HTTP_201_CREATED)
def registrar_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    # 1. Verificar que el correo o DPI no existan ya
    usuario_existente = db.query(Paciente).filter(
        (Paciente.correo == paciente.correo) | (Paciente.dpi == paciente.dpi)
    ).first()
    
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El correo o DPI ya están registrados")

    # 2. Encriptar la contraseña
    contrasena_hasheada = pwd_context.hash(paciente.contrasena)

    # 3. Crear el modelo de base de datos
    nuevo_paciente = Paciente(
        nombre=paciente.nombre,
        apellido=paciente.apellido,
        dpi=paciente.dpi,
        genero=paciente.genero,
        direccion=paciente.direccion,
        telefono=paciente.telefono,
        fecha_nacimiento=paciente.fecha_nacimiento,
        fotografia=paciente.fotografia,
        correo=paciente.correo,
        contrasena=contrasena_hasheada,
        estado=EstadoUsuarioEnum.Pendiente # Los pacientes nacen como pendientes (HU-005)
    )

    # 4. Guardar en la base de datos
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)

    return {"mensaje": "Paciente registrado exitosamente", "id_paciente": nuevo_paciente.id_paciente}