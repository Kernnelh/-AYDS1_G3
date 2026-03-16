from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional
from app.models.paciente import GeneroEnum

class PacienteCreate(BaseModel):
    nombre: str = Field(..., max_length=100)
    apellido: str = Field(..., max_length=100)
    dpi: str = Field(..., max_length=15)
    genero: GeneroEnum
    direccion: str = Field(..., max_length=255)
    telefono: str = Field(..., max_length=15)
    fecha_nacimiento: date
    fotografia: Optional[str] = None
    correo: EmailStr
    contrasena: str = Field(..., min_length=8) # Exigimos mínimo 8 caracteres