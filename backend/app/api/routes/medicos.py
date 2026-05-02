from datetime import datetime
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, UploadFile, File, Form
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.core.security import verificar_token
from app.db.database import get_db
from app.models.medico import Medico, EstadoUsuarioEnum
from app.schemas.medico import MedicoCreate, MedicoUpdate
from app.schemas.medico import HorarioCrear
from app.models.medico import HorarioMedico, DiaAtencion
from app.models.cita import Cita, EstadoCitaEnum
from app.models.paciente import Paciente
from app.models.tratamiento import Tratamiento, MedicamentoRecetado
from app.schemas.tratamiento import TratamientoCreate
from app.schemas.interacciones import CalificacionCreate, ReporteCreate
from app.models.calificacion import Calificacion
from app.models.reporte import Reporte
from pydantic import BaseModel
from app.core.email import enviar_correo_cancelacion, enviar_correo_verificacion
import os
import secrets
import shutil

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

#Esquema para manejo de tratamiento
class TratamientoUpdate(BaseModel):
    tratamiento: str

class CancelacionMedico(BaseModel):
    motivo_cancelacion: str

UPLOAD_DIR_MEDICOS = "static/uploads/medicos"
os.makedirs(UPLOAD_DIR_MEDICOS, exist_ok=True)    

@router.post("/registro", status_code=status.HTTP_201_CREATED)
async def registrar_medico(
    background_tasks: BackgroundTasks,
    nombre: str = Form(...),
    apellido: str = Form(...),
    dpi: str = Form(...),
    fecha_nacimiento: date = Form(...),
    genero: str = Form(...),
    direccion: str = Form(...),
    telefono: str = Form(...),
    no_colegiado: str = Form(...),
    especialidad: str = Form(...),
    direccion_clinica: str = Form(...),
    correo: str = Form(...),
    contrasena: str = Form(...),
    fotografia: UploadFile = File(...),  # Archivo físico obligatorio
    archivo_cv: UploadFile = File(...),  # Archivo físico obligatorio (CV en lugar de DPI)
    db: Session = Depends(get_db)
):
    # 1. Validar extensiones de los archivos
    ext_foto = os.path.splitext(fotografia.filename)[1].lower()
    if ext_foto not in ['.jpg', '.jpeg', '.png']:
        raise HTTPException(status_code=400, detail="La fotografía debe ser JPG o PNG")
    
    ext_cv = os.path.splitext(archivo_cv.filename)[1].lower()
    if ext_cv != '.pdf':
        raise HTTPException(status_code=400, detail="El documento CV debe ser un archivo PDF")

    # 2. Verificar que el correo, DPI o No. Colegiado no existan ya en la base de datos
    usuario_existente = db.query(Medico).filter(
        (Medico.correo == correo) | 
        (Medico.dpi == dpi) |
        (Medico.no_colegiado == no_colegiado)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=400, 
            detail="El correo, DPI o Número de Colegiado ya están registrados"
        )

    # 3. Guardar los archivos físicos en el servidor
    nombre_foto = f"foto_med_{dpi}_{secrets.token_hex(4)}{ext_foto}"
    ruta_foto = f"{UPLOAD_DIR_MEDICOS}/{nombre_foto}"
    
    nombre_pdf_cv = f"cv_{dpi}_{secrets.token_hex(4)}{ext_cv}"
    ruta_pdf_cv = f"{UPLOAD_DIR_MEDICOS}/{nombre_pdf_cv}"

    with open(ruta_foto, "wb") as buffer:
        shutil.copyfileobj(fotografia.file, buffer)
        
    with open(ruta_pdf_cv, "wb") as buffer:
        shutil.copyfileobj(archivo_cv.file, buffer)

    # 4. Encriptar la contraseña y generar Token de Verificación
    contrasena_hasheada = pwd_context.hash(contrasena)
    token_generado = secrets.token_hex(3)

    # 5. Crear el modelo de base de datos
    nuevo_medico = Medico(
        nombre=nombre,
        apellido=apellido,
        dpi=dpi,
        fecha_nacimiento=fecha_nacimiento,
        genero=genero,
        direccion=direccion,
        telefono=telefono,
        fotografia=ruta_foto,       # Guardamos la RUTA de la foto
        archivo_cv=ruta_pdf_cv,     # Guardamos la RUTA del CV
        no_colegiado=no_colegiado,
        especialidad=especialidad,
        direccion_clinica=direccion_clinica,
        correo=correo,
        contrasena=contrasena_hasheada,
        token_verificacion=token_generado, # Se guarda el token generado
        correo_verificado=False,
        estado=EstadoUsuarioEnum.Pendiente
    )

    # 6. Guardar en la base de datos
    db.add(nuevo_medico)
    db.commit()
    db.refresh(nuevo_medico)

    # 7. --- LÓGICA SMTP PARA DESPUÉS ---
    background_tasks.add_task(enviar_correo_verificacion, correo, nombre, token_generado)

    return {
        "mensaje": "Médico registrado exitosamente. Por favor, revisa tu correo para el token de verificación.", 
        "id_medico": nuevo_medico.id_medico
    }


@router.post("/horarios", tags=["Médico"])
def establecer_horario(
    horario_datos: HorarioCrear,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    if usuario_actual.get("rol") != "medico":
        raise HTTPException(status_code=403, detail="Solo los médicos pueden establecer horarios")
    
    id_medico_actual = usuario_actual.get("id")

    if horario_datos.hora_inicio >= horario_datos.hora_fin:
        raise HTTPException(status_code=400, detail="La hora de inicio debe ser antes de la hora de fin")

    # --- NUEVA LÓGICA: VALIDACIÓN DE BLOQUEO DE HORARIO ---
    citas_pendientes = db.query(Cita).filter(
        Cita.id_medico == id_medico_actual,
        Cita.estado == EstadoCitaEnum.Pendiente
    ).all()

    dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

    for cita in citas_pendientes:
        dia_cita = dias_semana[cita.fecha.weekday()]
        
        # 1. Validar que no quite un día donde ya tiene citas
        if dia_cita not in horario_datos.dias:
            raise HTTPException(
                status_code=400, 
                detail=f"No puedes eliminar el día {dia_cita} porque tienes citas pendientes programadas para ese día."
            )
        
        # 2. Validar que no acorte el horario dejando citas por fuera
        if not (horario_datos.hora_inicio <= cita.hora <= horario_datos.hora_fin):
            raise HTTPException(
                status_code=400, 
                detail=f"No puedes cambiar tu horario. Tienes citas programadas a las {cita.hora} que quedarían fuera del nuevo rango."
            )
    # ------------------------------------------------------

    try:
        # Limpiamos los horarios anteriores si está actualizando
        db.query(HorarioMedico).filter(HorarioMedico.id_medico == id_medico_actual).delete()
        db.query(DiaAtencion).filter(DiaAtencion.id_medico == id_medico_actual).delete()

        # Guardar el nuevo rango de horas
        nuevo_horario = HorarioMedico(
            id_medico=id_medico_actual,
            hora_inicio=horario_datos.hora_inicio,
            hora_fin=horario_datos.hora_fin
        )
        db.add(nuevo_horario)
        db.commit() 
        db.refresh(nuevo_horario) 

        # Guardar cada día seleccionado
        for dia in horario_datos.dias:
            nuevo_dia = DiaAtencion(
                id_medico=id_medico_actual,
                dia_semana=dia  # el campo en el modelo BD es dia_semana
            )
            db.add(nuevo_dia)
        
        db.commit()
        return {"mensaje": "Horario y días de atención establecidos correctamente"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar en BD: {str(e)}")
    


@router.get("/citas/pendientes", tags=["Médico"])
def obtener_citas_pendientes(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Devuelve la lista de citas pendientes para el médico que ha iniciado sesión"""
    if usuario_actual.get("rol") != "medico":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo médicos.")
    
    id_medico_actual = usuario_actual.get("id")

    # Buscamos las citas del médico en estado Pendiente
    citas = db.query(Cita).filter(
        Cita.id_medico == id_medico_actual,
        Cita.estado == EstadoCitaEnum.Pendiente
    ).all()

    # Formateamos la respuesta para incluir el nombre del paciente
    resultado = []
    for cita in citas:
        paciente = db.query(Paciente).filter(Paciente.id_paciente == cita.id_paciente).first()
        
        resultado.append({
            "id_cita": cita.id_cita,
            "fecha": cita.fecha,
            "hora": cita.hora,
            "motivo": cita.motivo,
            "estado": cita.estado,
            "paciente": f"{paciente.nombre} {paciente.apellido}" if paciente else "Paciente Desconocido",
            "correo_paciente": paciente.correo if paciente else "",
        })
        
    return resultado

@router.put("/citas/{id_cita}/atender", tags=["Médico"])
def atender_cita(
    id_cita: int,
    datos: TratamientoUpdate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Permite al médico ingresar el tratamiento y marcar la cita como Atendida"""
    if usuario_actual.get("rol") != "medico":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo médicos.")
    
    id_medico_actual = usuario_actual.get("id")

    # Buscamos la cita y verificamos que le pertenezca a ESTE médico
    cita_db = db.query(Cita).filter(
        Cita.id_cita == id_cita,
        Cita.id_medico == id_medico_actual
    ).first()

    if not cita_db:
        raise HTTPException(status_code=404, detail="Cita no encontrada o no tienes permisos sobre ella.")
    
    if cita_db.estado != EstadoCitaEnum.Pendiente:
        raise HTTPException(status_code=400, detail="Solo puedes atender citas que estén en estado Pendiente.")

    # Guardamos el tratamiento y cambiamos el estado
    cita_db.tratamiento = datos.tratamiento
    cita_db.estado = EstadoCitaEnum.Atendida
    
    db.commit()
    db.refresh(cita_db)

    return {
        "mensaje": "Cita atendida exitosamente", 
        "id_cita": cita_db.id_cita,
        "nuevo_estado": cita_db.estado
    }


@router.put("/citas/{id_cita}/cancelar", tags=["Médico"])
def cancelar_cita_medico(
    id_cita: int,
    datos: CancelacionMedico,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Permite al médico cancelar una cita y 'envía' un correo de notificación al paciente"""
    if usuario_actual.get("rol") != "medico":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo médicos.")
    
    id_medico_actual = usuario_actual.get("id")

    # 1. Buscamos la cita
    cita_db = db.query(Cita).filter(
        Cita.id_cita == id_cita,
        Cita.id_medico == id_medico_actual
    ).first()

    if not cita_db:
        raise HTTPException(status_code=404, detail="Cita no encontrada o no te pertenece.")
    
    if cita_db.estado != EstadoCitaEnum.Pendiente:
        raise HTTPException(status_code=400, detail="Solo puedes cancelar citas que estén Pendientes.")

    # 2. Obtenemos los datos del paciente y del médico para armar el correo
    paciente_db = db.query(Paciente).filter(Paciente.id_paciente == cita_db.id_paciente).first()
    medico_db = db.query(Medico).filter(Medico.id_medico == id_medico_actual).first()

    # 3. Cambiamos el estado en la Base de Datos
    motivo_original = cita_db.motivo
    nuevo_motivo = f"{datos.motivo_cancelacion} (Motivo original: {motivo_original})"


    cita_db.estado = EstadoCitaEnum.Cancelada_Medico
    cita_db.fecha_cancelacion = datetime.now()
    cita_db.motivo = nuevo_motivo
    db.commit()
    db.refresh(cita_db)

    # 4. --- LÓGICA DE CORREO (COMPROBANTE TÉCNICO) ---
    background_tasks.add_task(
        enviar_correo_cancelacion,
        destinatario=paciente_db.correo,
        nombre_paciente=paciente_db.nombre,
        fecha=str(cita_db.fecha),
        hora=str(cita_db.hora),
        medico=f"Dr(a). {medico_db.nombre} {medico_db.apellido}",
        motivo=nuevo_motivo)
    # ----------------------------------------------------------

    return {
        "mensaje": "Cita cancelada exitosamente y notificación enviada al paciente", 
        "id_cita": cita_db.id_cita,
        "nuevo_estado": cita_db.estado
    }



@router.get("/citas/historial", tags=["Médico"])
def obtener_historial_citas_medico(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Devuelve las citas pasadas (Atendidas o Canceladas) para el historial del médico"""
    if usuario_actual.get("rol") != "medico":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo médicos.")
    
    id_medico_actual = usuario_actual.get("id")

    # Buscamos las citas que YA NO son pendientes para este doctor
    citas = db.query(Cita).filter(
        Cita.id_medico == id_medico_actual,
        Cita.estado.in_([
            EstadoCitaEnum.Atendida, 
            EstadoCitaEnum.Cancelada_Paciente, 
            EstadoCitaEnum.Cancelada_Medico
        ])
    ).all()

    # Formateamos incluyendo el nombre del paciente
    resultado = []
    for cita in citas:
        paciente = db.query(Paciente).filter(Paciente.id_paciente == cita.id_paciente).first()
        # Buscamos si existe un tratamiento para esta cita
        tratamiento_db = db.query(Tratamiento).filter(Tratamiento.id_cita == cita.id_cita).first()
        
        resultado.append({
            "id_cita": cita.id_cita,
            "id_paciente": cita.id_paciente, # AGREGADO: Buena práctica para el frontend
            "fecha": cita.fecha,
            "hora": cita.hora,
            "estado": cita.estado,
            "motivo": cita.motivo,          
            # EXTRAÍDO de la tabla Tratamiento, no de Cita
            "tratamiento": tratamiento_db.diagnostico if tratamiento_db else "Sin tratamiento registrado", 
            # AGREGADO: ID para que el frontend pueda ver el PDF
            "id_tratamiento": tratamiento_db.id_tratamiento if tratamiento_db else None,
            "paciente": f"{paciente.nombre} {paciente.apellido}" if paciente else "Paciente Desconocido",
            "telefono_paciente": paciente.telefono if paciente else "No disponible" # EXTRA para el doc
        })
        
    return resultado

@router.get("/perfil", tags=["Médico"])
def obtener_perfil_medico(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    if usuario_actual.get("rol") != "medico":
        raise HTTPException(status_code=403, detail="Acceso denegado.")
    
    medico = db.query(Medico).filter(
        Medico.id_medico == usuario_actual.get("id")
    ).first()

    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")

    horario = db.query(HorarioMedico).filter(HorarioMedico.id_medico == medico.id_medico).first()
    dias = db.query(DiaAtencion).filter(DiaAtencion.id_medico == medico.id_medico).all()

    return {
        "id_medico": medico.id_medico,
        "nombre": medico.nombre,
        "apellido": medico.apellido,
        "dpi": medico.dpi,
        "genero": medico.genero,
        "direccion": medico.direccion,
        "telefono": medico.telefono,
        "fecha_nacimiento": medico.fecha_nacimiento,
        "fotografia": medico.fotografia,
        "no_colegiado": medico.no_colegiado,
        "especialidad": medico.especialidad,
        "direccion_clinica": medico.direccion_clinica,
        "correo": medico.correo,
        "estado": medico.estado,
        "fecha_registro": medico.fecha_registro,
        "horario_inicio": horario.hora_inicio.strftime("%H:%M") if horario else None,
        "horario_fin": horario.hora_fin.strftime("%H:%M") if horario else None,
        "dias_atencion": [d.dia_semana for d in dias]
    }


@router.put("/perfil", tags=["Médico"])
def actualizar_perfil_medico(
    datos: MedicoUpdate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    if usuario_actual.get("rol") != "medico":
        raise HTTPException(status_code=403, detail="Acceso denegado.")

    medico = db.query(Medico).filter(
        Medico.id_medico == usuario_actual.get("id")
    ).first()

    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")

    medico.nombre           = datos.nombre
    medico.apellido         = datos.apellido
    medico.telefono         = datos.telefono
    medico.direccion        = datos.direccion
    medico.direccion_clinica = datos.direccion_clinica
    medico.especialidad     = datos.especialidad
    medico.genero           = datos.genero
    medico.fecha_nacimiento = datos.fecha_nacimiento

    db.commit()
    db.refresh(medico)

    horario = db.query(HorarioMedico).filter(HorarioMedico.id_medico == medico.id_medico).first()
    dias = db.query(DiaAtencion).filter(DiaAtencion.id_medico == medico.id_medico).all()

    return {
        **medico.__dict__,
        "horario_inicio": horario.hora_inicio.strftime("%H:%M") if horario else None,
        "horario_fin": horario.hora_fin.strftime("%H:%M") if horario else None,
        "dias_atencion": [d.dia_semana for d in dias]
    }


@router.post("/tratamiento", status_code=status.HTTP_201_CREATED)
def registrar_tratamiento(datos: TratamientoCreate, db: Session = Depends(get_db)):
    # 1. Validar que la cita exista
    cita = db.query(Cita).filter(Cita.id_cita == datos.id_cita).first()
    if not cita:
        raise HTTPException(status_code=404, detail="La cita especificada no existe")
        
    # Opcional: Validar que la cita no esté ya finalizada o cancelada
    if cita.estado == EstadoCitaEnum.Atendida:
        raise HTTPException(status_code=400, detail="Esta cita ya tiene un tratamiento registrado")

    try:
        # 2. Crear el encabezado del Tratamiento
        nuevo_tratamiento = Tratamiento(
            id_cita=datos.id_cita,
            diagnostico=datos.diagnostico
        )
        db.add(nuevo_tratamiento)
        db.flush() # Guardamos temporalmente para obtener el id_tratamiento generado sin hacer commit final
        
        # 3. Iterar y registrar cada medicamento recetado
        for med in datos.medicamentos:
            nuevo_medicamento = MedicamentoRecetado(
                id_tratamiento=nuevo_tratamiento.id_tratamiento,
                nombre=med.nombre,
                cantidad=med.cantidad,
                tiempo_medicamento=med.tiempo_medicamento,
                descripcion_dosis=med.descripcion_dosis
            )
            db.add(nuevo_medicamento)
            
        # 4. Actualizar el estado de la cita
        cita.estado = EstadoCitaEnum.Atendida
        
        # 5. Confirmar todos los cambios en la base de datos de golpe
        db.commit()
        
        return {
            "mensaje": "Tratamiento registrado y cita finalizada exitosamente",
            "id_tratamiento": nuevo_tratamiento.id_tratamiento
        }
        
    except Exception as e:
        db.rollback() # Si algo falla (ej. error de base de datos), se deshace todo
        raise HTTPException(status_code=500, detail=f"Error interno al registrar el tratamiento: {str(e)}")
    


@router.post("/calificar", status_code=status.HTTP_201_CREATED, tags=["Médico"])
def calificar_paciente(datos: CalificacionCreate, db: Session = Depends(get_db)):
    # 1. Verificar que la cita exista
    cita = db.query(Cita).filter(Cita.id_cita == datos.id_cita).first()
    if not cita:
        raise HTTPException(status_code=404, detail="La cita especificada no existe")
        
    # 2. Asegurar que la cita ya ocurrió
    if cita.estado != EstadoCitaEnum.Atendida:
        raise HTTPException(status_code=400, detail="Solo se pueden calificar citas que ya fueron Atendidas")

    # 3. Verificar que el médico no haya calificado esta cita antes (evitar spam)
    # Buscamos por id_cita y autor="Medico" para no chocar con la calificación del paciente
    calificacion_existente = db.query(Calificacion).filter(
        Calificacion.id_cita == datos.id_cita,
        Calificacion.autor == "Medico"
    ).first()
    
    if calificacion_existente:
         raise HTTPException(status_code=400, detail="Ya has calificado a este paciente por esta cita")

    # 4. Guardar calificación
    nueva_calificacion = Calificacion(
        id_cita=datos.id_cita,
        autor="Medico",            # <-- El autor cambia a Médico
        estrellas=datos.estrellas,
        comentario=datos.comentario
    )
    db.add(nueva_calificacion)
    db.commit()
    
    return {"mensaje": "Calificación al paciente guardada exitosamente."}


@router.post("/reportar", status_code=status.HTTP_201_CREATED, tags=["Médico"])
def reportar_paciente(datos: ReporteCreate, db: Session = Depends(get_db)):
    # 1. Verificar cita
    cita = db.query(Cita).filter(Cita.id_cita == datos.id_cita).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada para reportar")

    # 2. Crear el reporte para el Admin
    nuevo_reporte = Reporte(
        id_cita=datos.id_cita,
        autor="Medico",                # <-- El autor cambia a Médico
        categoria=datos.categoria,     
        explicacion=datos.explicacion  
    )
    db.add(nuevo_reporte)
    db.commit()
    
    return {"mensaje": "Reporte enviado exitosamente. El administrador revisará el caso del paciente."}