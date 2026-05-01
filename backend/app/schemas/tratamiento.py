from pydantic import BaseModel
from typing import List

# Esquema individual para cada medicamento
class MedicamentoCreate(BaseModel):
    nombre: str
    cantidad: str
    tiempo_medicamento: str
    descripcion_dosis: str

# Esquema principal del Tratamiento que agrupa la cita, el diagnóstico y la lista de medicinas
class TratamientoCreate(BaseModel):
    id_cita: int
    diagnostico: str
    medicamentos: List[MedicamentoCreate]