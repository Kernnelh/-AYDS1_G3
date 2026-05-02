import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, func, Boolean
from app.db.database import Base

class GeneroEnum(str, enum.Enum):
    Masculino = "Masculino"
    Femenino = "Femenino"

class EstadoUsuarioEnum(str, enum.Enum):
    Pendiente = "Pendiente"
    Aprobado = "Aprobado"
    Rechazado = "Rechazado"
    Desactivado = "Desactivado" # Nuevo estado agregado

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
    fotografia = Column(String(255), nullable=False) # Ahora es obligatoria (nullable=False)
    archivo_dpi = Column(String(255), nullable=False) # Nueva columna DPI
    correo = Column(String(150), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    token_verificacion = Column(String(255), nullable=True) # Nueva columna token
    correo_verificado = Column(Boolean, default=False) # Nueva columna verificación
    estado = Column(Enum(EstadoUsuarioEnum), default=EstadoUsuarioEnum.Pendiente)
    fecha_registro = Column(DateTime, default=func.now())

