import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, func
from app.db.database import Base

# NOTA: Verifica que estos valores coincidan exactamente con los de tu schema.sql
class GeneroEnum(str, enum.Enum):
    Masculino = "Masculino"
    Femenino = "Femenino"

class EstadoUsuarioEnum(str, enum.Enum):
    Pendiente = "Pendiente"
    Aprobado = "Aprobado"
    Rechazado = "Rechazado"

class Paciente(Base):
    __tablename__ = "Paciente"

    id_paciente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    dpi = Column(String(15), nullable=False, unique=True)
    genero = Column(Enum(GeneroEnum), nullable=False)
    direccion = Column(String(255), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    # Fotografía no tiene "NN" en el diagrama, así que es nullable=True
    fotografia = Column(String(255), nullable=True) 
    correo = Column(String(150), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    estado = Column(Enum(EstadoUsuarioEnum), default=EstadoUsuarioEnum.Pendiente)
    fecha_registro = Column(DateTime, default=func.now())