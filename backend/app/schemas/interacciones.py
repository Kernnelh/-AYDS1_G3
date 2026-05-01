from pydantic import BaseModel, Field
from typing import Optional

class CalificacionCreate(BaseModel):
    id_cita: int
    estrellas: int = Field(..., ge=1, le=5, description="Puntuación de 1 a 5 estrellas")
    comentario: Optional[str] = None

class ReporteCreate(BaseModel):
    id_cita: int
    categoria: str 
    explicacion: str