from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.db.database import get_db
from app.models.medico import Medico, EstadoUsuarioEnum
from app.schemas.medico import MedicoCreate

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

@router.post("/registro", status_code=status.HTTP_201_CREATED)
def registrar_medico(medico: MedicoCreate, db: Session = Depends(get_db)):
    # 1. Verificar que el correo, DPI o No. Colegiado no existan ya en la base de datos
    usuario_existente = db.query(Medico).filter(
        (Medico.correo == medico.correo) | 
        (Medico.dpi == medico.dpi) |
        (Medico.no_colegiado == medico.no_colegiado)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=400, 
            detail="El correo, DPI o Número de Colegiado ya están registrados"
        )

    # 2. Encriptar la contraseña
    contrasena_hasheada = pwd_context.hash(medico.contrasena)

    # 3. Crear el modelo de base de datos
    nuevo_medico = Medico(
        nombre=medico.nombre,
        apellido=medico.apellido,
        dpi=medico.dpi,
        fecha_nacimiento=medico.fecha_nacimiento,
        genero=medico.genero,
        direccion=medico.direccion,
        telefono=medico.telefono,
        fotografia=medico.fotografia,
        no_colegiado=medico.no_colegiado,
        especialidad=medico.especialidad,
        direccion_clinica=medico.direccion_clinica,
        correo=medico.correo,
        contrasena=contrasena_hasheada,
        estado=EstadoUsuarioEnum.Pendiente  # Los médicos también inician pendientes
    )

    # 4. Guardar en la base de datos
    db.add(nuevo_medico)
    db.commit()
    db.refresh(nuevo_medico)

    return {
        "mensaje": "Médico registrado exitosamente", 
        "id_medico": nuevo_medico.id_medico
    }