from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from app.db.database import Base

class Tratamiento(Base):
    __tablename__ = "Tratamiento"

    id_tratamiento = Column(Integer, primary_key=True, index=True)
    # Relación uno a uno con Cita
    id_cita = Column(Integer, ForeignKey("cita.id_cita"), unique=True, nullable=False)
    diagnostico = Column(Text, nullable=False)
    fecha_registro = Column(DateTime, default=func.now())

class MedicamentoRecetado(Base):
    __tablename__ = "Medicamento_Recetado"

    id_medicamento = Column(Integer, primary_key=True, index=True)
    id_tratamiento = Column(Integer, ForeignKey("Tratamiento.id_tratamiento"), nullable=False)
    nombre = Column(String(150), nullable=False)
    cantidad = Column(String(50), nullable=False)
    tiempo_medicamento = Column(String(100), nullable=False)
    descripcion_dosis = Column(Text, nullable=False)