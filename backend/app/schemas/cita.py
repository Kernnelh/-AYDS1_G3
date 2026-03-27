from pydantic import BaseModel
from datetime import date, time

class CitaCrear(BaseModel):
    id_medico: int
    fecha: date
    hora: time
    motivo: str