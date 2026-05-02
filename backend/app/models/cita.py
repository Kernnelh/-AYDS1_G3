import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Time, Enum, ForeignKey, func, Text
from app.db.database import Base

class EstadoCitaEnum(str, enum.Enum):
    Pendiente = "Pendiente"
    Atendida = "Atendida"
    Cancelada_Paciente = "Cancelada_Paciente"
    Cancelada_Medico = "Cancelada_Medico"

class Cita(Base):
    __tablename__ = "cita"

    id_cita = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("Paciente.id_paciente"), nullable=False)
    id_medico = Column(Integer, ForeignKey("Medico.id_medico"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    motivo = Column(Text, nullable=False) # Actualizado a Text según schema.sql
    # La columna 'tratamiento' fue eliminada porque ahora es una tabla independiente
    estado = Column(Enum(EstadoCitaEnum), default=EstadoCitaEnum.Pendiente)
    fecha_creacion = Column(DateTime, default=func.now())
    fecha_cancelacion = Column(DateTime, nullable=True)