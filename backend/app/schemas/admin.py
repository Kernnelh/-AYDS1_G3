from pydantic import BaseModel
from app.models.paciente import EstadoUsuarioEnum

class ActualizarEstado(BaseModel):
    estado: EstadoUsuarioEnum