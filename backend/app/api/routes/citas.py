from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import get_db
from app.core.security import verificar_token

# Importamos nuestros nuevos modelos y esquemas
from app.models.cita import Cita, EstadoCitaEnum
from app.models.medico import HorarioMedico, DiaAtencion
from app.schemas.cita import CitaCrear

from app.models.medico import Medico, EstadoUsuarioEnum as EstadoMedicoEnum

router = APIRouter()

@router.post("/citas", tags=["Paciente"])
def programar_cita(
    cita_datos: CitaCrear,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    # Validar que es un paciente
    if usuario_actual.get("rol") != "paciente":
        raise HTTPException(status_code=403, detail="Solo los pacientes pueden programar citas")

    id_paciente_actual = usuario_actual.get("id")

    # 1. Validar que la fecha no sea en el pasado
    if cita_datos.fecha < datetime.now().date():
        raise HTTPException(status_code=400, detail="No puedes programar citas en fechas pasadas")

    # 2. Validar que el médico atienda ese día de la semana
    dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    dia_elegido = dias_semana[cita_datos.fecha.weekday()]

    dia_atencion = db.query(DiaAtencion).filter(
        DiaAtencion.id_medico == cita_datos.id_medico,
        DiaAtencion.dia_semana == dia_elegido
    ).first()

    if not dia_atencion:
        raise HTTPException(status_code=400, detail=f"El médico seleccionado no atiende los días {dia_elegido}")

    # 3. Validar que la hora esté dentro de su horario laboral
    horario = db.query(HorarioMedico).filter(HorarioMedico.id_medico == cita_datos.id_medico).first()
    if not horario:
        raise HTTPException(status_code=400, detail="Este médico aún no tiene un horario configurado")

    if not (horario.hora_inicio <= cita_datos.hora <= horario.hora_fin):
        raise HTTPException(
            status_code=400, 
            detail=f"La hora solicitada debe estar entre {horario.hora_inicio} y {horario.hora_fin}"
        )

    # 4. Validar traslapes (Que no haya otra cita activa ese mismo día y hora)
    cita_existente = db.query(Cita).filter(
        Cita.id_medico == cita_datos.id_medico,
        Cita.fecha == cita_datos.fecha,
        Cita.hora == cita_datos.hora,
        Cita.estado.in_([EstadoCitaEnum.Pendiente, EstadoCitaEnum.Atendida])
    ).first()

    if cita_existente:
        raise HTTPException(status_code=400, detail="El horario seleccionado ya se encuentra ocupado")

    # 5. Si pasa todas las validaciones, guardamos la cita
    try:
        nueva_cita = Cita(
            id_paciente=id_paciente_actual,
            id_medico=cita_datos.id_medico,
            fecha=cita_datos.fecha,
            hora=cita_datos.hora,
            motivo=cita_datos.motivo
        )
        db.add(nueva_cita)
        db.commit()
        db.refresh(nueva_cita)
        return {"mensaje": "Cita programada exitosamente", "id_cita": nueva_cita.id_cita}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al programar la cita: {str(e)}")
    


@router.get("/medicos-disponibles", tags=["Paciente"])
def obtener_medicos_disponibles(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Devuelve médicos aprobados, ocultando aquellos con los que el paciente ya tiene una cita activa"""
    
    if usuario_actual.get("rol") != "paciente":
        raise HTTPException(status_code=403, detail="Solo los pacientes pueden consultar la disponibilidad")

    id_paciente_actual = usuario_actual.get("id")

    # 1. Buscamos los IDs de los médicos con los que el paciente YA tiene una cita Pendiente
    citas_activas = db.query(Cita.id_medico).filter(
        Cita.id_paciente == id_paciente_actual,
        Cita.estado == EstadoCitaEnum.Pendiente
    ).all()
    
    # Extraemos solo los IDs en una lista de Python (ej: [1, 4, 5])
    ids_medicos_ocupados = [cita[0] for cita in citas_activas]

    # 2. Buscamos a los médicos Aprobados, EXCLUYENDO los IDs que encontramos arriba
    medicos_aprobados = db.query(Medico).filter(
        Medico.estado == EstadoMedicoEnum.Aprobado,
        Medico.id_medico.notin_(ids_medicos_ocupados) if ids_medicos_ocupados else True
    ).all()
    
    resultado = []
    
    # 3. Formateamos la respuesta igual que antes
    for medico in medicos_aprobados:
        horario_db = db.query(HorarioMedico).filter(HorarioMedico.id_medico == medico.id_medico).first()
        dias_db = db.query(DiaAtencion).filter(DiaAtencion.id_medico == medico.id_medico).all()
        
        dias_lista = [dia.dia_semana for dia in dias_db]
        
        horario_formateado = None
        if horario_db:
            horario_formateado = {
                "hora_inicio": horario_db.hora_inicio,
                "hora_fin": horario_db.hora_fin,
                "dias": dias_lista
            }
        
        resultado.append({
            "id_medico": medico.id_medico,
            "nombre": medico.nombre,
            "apellido": medico.apellido,
            "especialidad": medico.especialidad,
            "horario": horario_formateado
        })
        
    return resultado


@router.get("/citas/activas", tags=["Paciente"])
def obtener_citas_activas_paciente(
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Devuelve la lista de citas pendientes (futuras) para el paciente que ha iniciado sesión"""
    if usuario_actual.get("rol") != "paciente":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo pacientes.")
    
    id_paciente_actual = usuario_actual.get("id")

    # Buscamos las citas del paciente que aún no han sido atendidas ni canceladas
    citas = db.query(Cita).filter(
        Cita.id_paciente == id_paciente_actual,
        Cita.estado == EstadoCitaEnum.Pendiente
    ).all()

    # Formateamos para incluir el nombre del doctor
    resultado = []
    for cita in citas:
        medico = db.query(Medico).filter(Medico.id_medico == cita.id_medico).first()
        
        resultado.append({
            "id_cita": cita.id_cita,
            "fecha": cita.fecha,
            "hora": cita.hora,
            "motivo": cita.motivo,
            "estado": cita.estado,
            "medico": f"Dr. {medico.nombre} {medico.apellido}" if medico else "Médico Desconocido"
        })
        
    return resultado

@router.put("/citas/{id_cita}/cancelar", tags=["Paciente"])
def cancelar_cita_paciente(
    id_cita: int,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token)
):
    """Permite al paciente cancelar su propia cita"""
    if usuario_actual.get("rol") != "paciente":
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo pacientes.")
    
    id_paciente_actual = usuario_actual.get("id")

    # Buscamos la cita y verificamos que le pertenezca a ESTE paciente
    cita_db = db.query(Cita).filter(
        Cita.id_cita == id_cita,
        Cita.id_paciente == id_paciente_actual
    ).first()

    if not cita_db:
        raise HTTPException(status_code=404, detail="Cita no encontrada o no tienes permisos sobre ella.")
    
    if cita_db.estado != EstadoCitaEnum.Pendiente:
        raise HTTPException(status_code=400, detail="Solo puedes cancelar citas que estén programadas (Pendientes).")

    # Ejecutamos la cancelación
    cita_db.estado = EstadoCitaEnum.Cancelada_Paciente
    cita_db.fecha_cancelacion = datetime.now()
    
    db.commit()
    db.refresh(cita_db)

    return {
        "mensaje": "Cita cancelada exitosamente", 
        "id_cita": cita_db.id_cita,
        "nuevo_estado": cita_db.estado,
        "fecha_cancelacion": cita_db.fecha_cancelacion
    }