from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import get_db
from app.core.security import verificar_token

# Importamos nuestros nuevos modelos y esquemas
from app.models.cita import Cita, EstadoCitaEnum
from app.models.medico import HorarioMedico, DiaAtencion
from app.schemas.cita import CitaCrear

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