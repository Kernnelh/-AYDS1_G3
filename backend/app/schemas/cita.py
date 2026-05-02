from pydantic import BaseModel
from datetime import date, time
from typing import List, Optional

class CitaCrear(BaseModel):
    id_medico: int
    fecha: date
    hora: time
    motivo: str

class HorarioDisponible(BaseModel):
    hora_inicio: time
    hora_fin: time
    dias: List[str]

class MedicoDisponible(BaseModel):
    id_medico: int
    nombre: str
    apellido: str
    especialidad: str
    horario: Optional[HorarioDisponible]