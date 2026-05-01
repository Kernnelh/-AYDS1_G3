import enum
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, func
from app.db.database import Base

class AutorEnum(str, enum.Enum):
    Paciente = "Paciente"
    Medico = "Medico"

class CategoriaReporteEnum(str, enum.Enum):
    Conducta_inapropiada = "Conducta inapropiada"
    Falsificacion = "Falsificación de documentos"
    Agresion = "Agresión verbal o física"
    Robo_danio = "Robo o daño a las instalaciones"
    Falta_profesionalismo = "Falta de profesionalismo"
    Otro = "Otro"

class Reporte(Base):
    __tablename__ = "Reporte"

    id_reporte = Column(Integer, primary_key=True, index=True)
    id_cita = Column(Integer, ForeignKey("cita.id_cita"), nullable=False)
    autor = Column(Enum(AutorEnum), nullable=False)
    categoria = Column(Enum(CategoriaReporteEnum), nullable=False)
    explicacion = Column(Text, nullable=False)
    estado = Column(String(50), default="Pendiente_Revision")
    fecha_creacion = Column(DateTime, default=func.now())