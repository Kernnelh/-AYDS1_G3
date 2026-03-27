import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Time, Enum, ForeignKey, func
from app.db.database import Base

class EstadoCitaEnum(str, enum.Enum):
    Pendiente = "Pendiente"
    Atendida = "Atendida"
    Cancelada_Paciente = "Cancelada_Paciente"
    Cancelada_Medico = "Cancelada_Medico"

class Cita(Base):
    __tablename__ = "cita"

    id_cita = Column(Integer, primary_key=True, index=True)
    # Asumo que en tu diagrama las tablas se llaman "Paciente" y "Medico". Ajusta si es en minúscula.
    id_paciente = Column(Integer, ForeignKey("Paciente.id_paciente"), nullable=False)
    id_medico = Column(Integer, ForeignKey("Medico.id_medico"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    motivo = Column(String(255), nullable=False)
    tratamiento = Column(String(500), nullable=True)
    estado = Column(Enum(EstadoCitaEnum), default=EstadoCitaEnum.Pendiente)
    fecha_creacion = Column(DateTime, default=func.now())
    fecha_cancelacion = Column(DateTime, nullable=True)