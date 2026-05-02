import enum
from sqlalchemy import Column, Integer, Text, DateTime, Enum, ForeignKey, func
from app.db.database import Base

class AutorEnum(str, enum.Enum):
    Paciente = "Paciente"
    Medico = "Medico"

class Calificacion(Base):
    __tablename__ = "Calificacion"

    id_calificacion = Column(Integer, primary_key=True, index=True)
    id_cita = Column(Integer, ForeignKey("cita.id_cita"), nullable=False)
    autor = Column(Enum(AutorEnum), nullable=False)
    estrellas = Column(Integer, nullable=False) # Rango de 0 a 5
    comentario = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, default=func.now())