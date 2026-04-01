from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.security import verificar_token
from app.models.cita import Cita, EstadoCitaEnum
from app.models.medico import Medico

from app.db.database import get_db
from app.models.paciente import Paciente, EstadoUsuarioEnum
from app.schemas.paciente import PacienteCreate, PacienteUpdate

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


@router.get("/citas/historial", tags=["Paciente"])
def obtener_historial_citas_paciente(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Devuelve las citas pasadas (Atendidas o Canceladas) para el historial del paciente"""
    if usuario_actual.get("rol") != "paciente":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo pacientes.")
    
    id_paciente_actual = usuario_actual.get("id")

    # Buscamos las citas que YA NO son pendientes
    citas = db.query(Cita).filter(
        Cita.id_paciente == id_paciente_actual,
        Cita.estado.in_([
            EstadoCitaEnum.Atendida, 
            EstadoCitaEnum.Cancelada_Paciente, 
            EstadoCitaEnum.Cancelada_Medico
        ])
    ).all()

    resultado = []
    for cita in citas:
        medico = db.query(Medico).filter(Medico.id_medico == cita.id_medico).first()
        
        resultado.append({
            "id_cita": cita.id_cita,
            "id_medico": cita.id_medico,           # AGREGAR
            "fecha": cita.fecha,
            "hora": cita.hora,
            "motivo": cita.motivo,
            "tratamiento": cita.tratamiento,
            "estado": cita.estado,
            "medico": f"{medico.nombre} {medico.apellido}" if medico else "Médico Desconocido",  # QUITAR Dr.
            "direccion_clinica": medico.direccion_clinica if medico else "No disponible",  # AGREGAR
            "especialidad": medico.especialidad if medico else ""   # AGREGAR
        })
        
    return resultado

# obtenemos el perfil del paciente logueado para llenar datos en el dashboard y permitir su edición
@router.get("/perfil", tags=["Paciente"])
def obtener_perfil(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    if usuario_actual.get("rol") != "paciente":
        raise HTTPException(status_code=403, detail="Acceso denegado.")
    
    paciente = db.query(Paciente).filter(
        Paciente.id_paciente == usuario_actual.get("id")
    ).first()

    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    return paciente


@router.put("/perfil", tags=["Paciente"])
def actualizar_perfil(
    datos: PacienteUpdate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    if usuario_actual.get("rol") != "paciente":
        raise HTTPException(status_code=403, detail="Acceso denegado.")

    paciente = db.query(Paciente).filter(
        Paciente.id_paciente == usuario_actual.get("id")
    ).first()

    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    paciente.nombre          = datos.nombre
    paciente.apellido        = datos.apellido
    paciente.telefono        = datos.telefono
    paciente.direccion       = datos.direccion
    paciente.fecha_nacimiento = datos.fecha_nacimiento
    paciente.genero          = datos.genero

    db.commit()
    db.refresh(paciente)
    return paciente