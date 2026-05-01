from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from app.core.email import enviar_correo_verificacion
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
import secrets
import shutil
from datetime import date

from app.core.security import verificar_token
from app.models.cita import Cita, EstadoCitaEnum
from app.models.medico import Medico

from app.db.database import get_db
from app.models.paciente import Paciente, EstadoUsuarioEnum
from app.schemas.paciente import PacienteCreate, PacienteUpdate
from app.models.reporte import Reporte
from app.models.calificacion import Calificacion

router = APIRouter()
# Configuramos Passlib para usar SHA-256
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

#Crear el directorio para almacenar las fotos de perfil si no existe
UPLOAD_DIR = "static/uploads/pacientes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/registro", status_code=status.HTTP_201_CREATED)
async def registrar_paciente(
    background_tasks: BackgroundTasks, # Para enviar el correo sin congelar la pantalla
    nombre: str = Form(...),
    apellido: str = Form(...),
    dpi: str = Form(...),
    genero: str = Form(...),
    direccion: str = Form(...),
    telefono: str = Form(...),
    fecha_nacimiento: date = Form(...),
    correo: str = Form(...),
    contrasena: str = Form(...),
    fotografia: UploadFile = File(...),  # Archivo físico obligatorio
    archivo_dpi: UploadFile = File(...), # Archivo físico obligatorio
    db: Session = Depends(get_db)
):
    # 1. Validar extensiones de los archivos
    ext_foto = os.path.splitext(fotografia.filename)[1].lower()
    if ext_foto not in ['.jpg', '.jpeg', '.png']:
        raise HTTPException(status_code=400, detail="La fotografía debe ser JPG o PNG")
    
    ext_dpi = os.path.splitext(archivo_dpi.filename)[1].lower()
    if ext_dpi != '.pdf':
        raise HTTPException(status_code=400, detail="El documento DPI debe ser un archivo PDF")

    # 2. Verificar que el correo o DPI no existan ya
    usuario_existente = db.query(Paciente).filter(
        (Paciente.correo == correo) | (Paciente.dpi == dpi)
    ).first()
    
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El correo o DPI ya están registrados")

    # 3. Guardar los archivos físicos en el servidor
    # Generamos nombres únicos usando el DPI y un texto aleatorio para no sobreescribir archivos
    nombre_foto = f"foto_{dpi}_{secrets.token_hex(4)}{ext_foto}"
    ruta_foto = f"{UPLOAD_DIR}/{nombre_foto}"
    
    nombre_pdf_dpi = f"dpi_{dpi}_{secrets.token_hex(4)}{ext_dpi}"
    ruta_pdf_dpi = f"{UPLOAD_DIR}/{nombre_pdf_dpi}"

    with open(ruta_foto, "wb") as buffer:
        shutil.copyfileobj(fotografia.file, buffer)
        
    with open(ruta_pdf_dpi, "wb") as buffer:
        shutil.copyfileobj(archivo_dpi.file, buffer)

    # 4. Encriptar la contraseña y generar Token de Verificación
    contrasena_hasheada = pwd_context.hash(contrasena)
    token_generado = secrets.token_hex(3) # Genera un token seguro de 6 caracteres (ej: "8f4e1a")

    # 5. Crear el modelo de base de datos
    nuevo_paciente = Paciente(
        nombre=nombre,
        apellido=apellido,
        dpi=dpi,
        genero=genero,
        direccion=direccion,
        telefono=telefono,
        fecha_nacimiento=fecha_nacimiento,
        fotografia=ruta_foto,       # Guardamos la RUTA del archivo en BD
        archivo_dpi=ruta_pdf_dpi,   # Guardamos la RUTA del archivo en BD
        correo=correo,
        contrasena=contrasena_hasheada,
        token_verificacion=token_generado, # Se guarda el token generado
        correo_verificado=False,
        estado=EstadoUsuarioEnum.Pendiente
    )

    # 6. Guardar en la base de datos
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)

    # 7. --- AQUÍ IREMOS A ENVIAR EL CORREO LUEGO ---
    background_tasks.add_task(enviar_correo_verificacion, correo, nombre, token_generado)

    return {
        "mensaje": "Paciente registrado exitosamente. Por favor, revisa tu correo para el token de verificación.", 
        "id_paciente": nuevo_paciente.id_paciente
    }

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