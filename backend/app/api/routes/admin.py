from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
from app.models.cita import Cita, EstadoCitaEnum
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.db.database import get_db
from sqlalchemy import text, func, desc
from app.db.database import get_db
from app.models.medico import Medico, EstadoUsuarioEnum as EstadoMedicoEnum
from app.models.paciente import Paciente, EstadoUsuarioEnum as EstadoPacienteEnum
from app.models.reporte import Reporte
from app.models.calificacion import Calificacion
from app.schemas.admin import ActualizarEstado
from app.core.security import verificar_token
import os
from dotenv import load_dotenv
load_dotenv()

# Clave secreta para el segundo factor de autenticación (2FA)
ADMIN_2FA_KEY = os.getenv("SECRET_KEY")


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
    admin = db.execute(
        text("SELECT usuario FROM Administrador WHERE usuario = :user"),
        {"user": usuario}
    ).fetchone()

    if not admin:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")

    # 4. Validar contra la clave quemada en .env
    if contrasena_archivo != ADMIN_2FA_KEY:
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

    pacientes_pendientes = db.query(Paciente).filter(Paciente.estado == EstadoPacienteEnum.Pendiente).all()
    medicos_pendientes = db.query(Medico).filter(Medico.estado == EstadoMedicoEnum.Pendiente).all()

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

@router.get("/usuarios/{tipo_usuario}/aprobados", tags=["Administrador"])
def listar_usuarios_aprobados(
    tipo_usuario: str, 
    db: Session = Depends(get_db), 
    usuario_actual: dict = Depends(verificar_token)
):
    """Lista médicos o pacientes que están actualmente Aprobados (activos)"""
    if usuario_actual.get("rol") != "administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado.")
    
    if tipo_usuario.lower() == "medico":
        # Usamos el Enum específico del médico
        usuarios = db.query(Medico).filter(Medico.estado == EstadoMedicoEnum.Aprobado).all()
    elif tipo_usuario.lower() == "paciente":
        # Usamos el Enum específico del paciente
        usuarios = db.query(Paciente).filter(Paciente.estado == EstadoPacienteEnum.Aprobado).all()
    else:
        raise HTTPException(status_code=400, detail="Tipo de usuario inválido. Use 'medico' o 'paciente'.")
    
    return usuarios

@router.patch("/usuarios/{tipo_usuario}/{id_usuario}/baja", tags=["Administrador"])
def dar_de_baja_usuario(
    tipo_usuario: str, 
    id_usuario: int, 
    db: Session = Depends(get_db), 
    usuario_actual: dict = Depends(verificar_token)
):
    """Cambia el estado de un usuario Aprobado a Rechazado (Dar de baja)"""
    if usuario_actual.get("rol") != "administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado.")
    
    # 1. Buscamos y validamos el estado según el tipo
    if tipo_usuario.lower() == "medico":
        usuario_db = db.query(Medico).filter(Medico.id_medico == id_usuario).first()
        if not usuario_db:
            raise HTTPException(status_code=404, detail="Médico no encontrado.")
        if usuario_db.estado == EstadoMedicoEnum.Rechazado:
            raise HTTPException(status_code=400, detail="Este médico ya está dado de baja.")
        # Aplicamos la baja con su propio Enum
        usuario_db.estado = EstadoMedicoEnum.Rechazado

    elif tipo_usuario.lower() == "paciente":
        usuario_db = db.query(Paciente).filter(Paciente.id_paciente == id_usuario).first()
        if not usuario_db:
            raise HTTPException(status_code=404, detail="Paciente no encontrado.")
        if usuario_db.estado == EstadoPacienteEnum.Rechazado:
            raise HTTPException(status_code=400, detail="Este paciente ya está dado de baja.")
        # Aplicamos la baja con su propio Enum
        usuario_db.estado = EstadoPacienteEnum.Rechazado
        
    else:
        raise HTTPException(status_code=400, detail="Tipo de usuario inválido. Use 'medico' o 'paciente'.")

    # 2. Guardamos los cambios
    db.commit()
    db.refresh(usuario_db)
    
    return {
        "mensaje": f"{tipo_usuario.capitalize()} dado de baja exitosamente", 
        "nuevo_estado": usuario_db.estado
    }
@router.get("/reportes/medicos-mas-atendidos", tags=["Administrador", "Reportes"])
def reporte_top_medicos_pdf(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Genera un PDF con los médicos que más pacientes han atendido"""
    if usuario_actual.get("rol") != "administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo administradores.")

    # 1. Consultar la base de datos (como lo teníamos antes)
    conteo = db.query(
        Medico.nombre, 
        Medico.apellido, 
        func.count(Cita.id_cita).label("total_atendidos")
    ).join(Cita, Medico.id_medico == Cita.id_medico)\
     .filter(Cita.estado == EstadoCitaEnum.Atendida)\
     .group_by(Medico.id_medico)\
     .order_by(desc("total_atendidos"))\
     .limit(10).all()

    # 2. Crear el PDF en memoria
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Diseño del Título
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "Reporte: Médicos con más pacientes atendidos")
    c.setFont("Helvetica", 10)
    c.drawString(50, 735, "Clínica Médica - Generado automáticamente")
    
    # Diseño de la cabecera de la tabla
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 690, "Nombre del Médico")
    c.drawString(400, 690, "Citas Atendidas")
    c.line(50, 680, 500, 680) # Línea separadora
    
    # Imprimir los datos
    c.setFont("Helvetica", 12)
    y = 650
    for fila in conteo:
        nombre = f"Dr(a). {fila.nombre} {fila.apellido}"
        total = str(fila.total_atendidos)
        
        c.drawString(50, y, nombre)
        c.drawString(400, y, total)
        y -= 25 # Moverse hacia abajo para la siguiente fila
        
    c.save()
    buffer.seek(0)

    # 3. Retornar el archivo PDF
    return StreamingResponse(
        buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=reporte_medicos.pdf"}
    )


@router.get("/reportes/especialidades-mas-solicitadas", tags=["Administrador", "Reportes"])
def reporte_top_especialidades_pdf(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Genera un PDF con las especialidades que más citas han generado"""
    if usuario_actual.get("rol") != "administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo administradores.")

    # 1. Consultar la base de datos
    conteo = db.query(
        Medico.especialidad, 
        func.count(Cita.id_cita).label("total_citas")
    ).join(Cita, Medico.id_medico == Cita.id_medico)\
     .group_by(Medico.especialidad)\
     .order_by(desc("total_citas")).all()

    # 2. Crear el PDF en memoria
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Diseño del Título
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "Reporte: Especialidades más solicitadas")
    c.setFont("Helvetica", 10)
    c.drawString(50, 735, "Clínica Médica - Generado automáticamente")
    
    # Diseño de la cabecera de la tabla
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 690, "Especialidad")
    c.drawString(400, 690, "Total de Citas Generadas")
    c.line(50, 680, 500, 680) 
    
    # Imprimir los datos
    c.setFont("Helvetica", 12)
    y = 650
    for fila in conteo:
        especialidad = fila.especialidad
        total = str(fila.total_citas)
        
        c.drawString(50, y, especialidad)
        c.drawString(400, y, total)
        y -= 25 
        
    c.save()
    buffer.seek(0)

    # 3. Retornar el archivo PDF
    return StreamingResponse(
        buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=reporte_especialidades.pdf"}
    )

@router.get("/reportes", tags=["Administrador"])
def listar_reportes(db: Session = Depends(get_db)):
    # Traemos todos los reportes, ordenados del más reciente al más antiguo
    reportes = db.query(Reporte).order_by(Reporte.fecha_creacion.desc()).all()
    
    if not reportes:
        return {"mensaje": "No hay reportes registrados en el sistema.", "reportes": []}
        
    return {"reportes": reportes}


@router.get("/calificaciones/promedios", tags=["Administrador"])
def promedios_globales(db: Session = Depends(get_db)):
    # Calculamos el promedio global usando func.avg de SQLAlchemy
    promedio_general = db.query(func.avg(Calificacion.estrellas)).scalar()
    
    # Contamos cuántas calificaciones existen en total
    total_calificaciones = db.query(Calificacion).count()
    
    # Si no hay calificaciones, promedio_general será None, lo manejamos devolviendo 0.0
    promedio_seguro = round(promedio_general, 2) if promedio_general else 0.0
    
    return {
        "promedio_global": promedio_seguro,
        "total_calificaciones": total_calificaciones
    }


@router.get("/usuarios/activos", tags=["Administrador"])
def listar_usuarios_activos(db: Session = Depends(get_db)):
    # Buscar pacientes activos/aprobados
    pacientes_activos = db.query(Paciente).filter(Paciente.estado == EstadoPacienteEnum.Aprobado).all()
    
    # Buscar médicos activos/aprobados
    medicos_activos = db.query(Medico).filter(Medico.estado == EstadoMedicoEnum.Aprobado).all()
    
    return {
        "pacientes_activos": pacientes_activos,
        "medicos_activos": medicos_activos,
        "total_activos": len(pacientes_activos) + len(medicos_activos)
    }