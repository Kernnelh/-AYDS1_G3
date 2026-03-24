import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, func
from app.db.database import Base


class GeneroEnum(str, enum.Enum):
    Masculino = "Masculino"
    Femenino = "Femenino"

class EstadoUsuarioEnum(str, enum.Enum):
    Pendiente = "Pendiente"
    Aprobado = "Aprobado"
    Rechazado = "Rechazado"

class Medico(Base):
    __tablename__ = "Medico"

    id_medico = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    dpi = Column(String(15), nullable=False, unique=True)
    fecha_nacimiento = Column(Date, nullable=False)
    genero = Column(Enum(GeneroEnum), nullable=False)
    direccion = Column(String(255), nullable=False)
    telefono = Column(String(15), nullable=False)
    # A diferencia del paciente, en el diagrama del médico la foto sí es Not Null (NN)
    fotografia = Column(String(255), nullable=False) 
    no_colegiado = Column(String(20), nullable=False, unique=True)
    especialidad = Column(String(100), nullable=False)
    direccion_clinica = Column(String(255), nullable=False)
    correo = Column(String(150), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    estado = Column(Enum(EstadoUsuarioEnum), default=EstadoUsuarioEnum.Pendiente)
    fecha_registro = Column(DateTime, default=func.now())