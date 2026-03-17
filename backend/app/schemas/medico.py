from pydantic import BaseModel, EmailStr, Field
from datetime import date
from app.models.medico import GeneroEnum

class MedicoCreate(BaseModel):
    nombre: str = Field(..., max_length=100)
    apellido: str = Field(..., max_length=100)
    dpi: str = Field(..., max_length=15)
    fecha_nacimiento: date
    genero: GeneroEnum
    direccion: str = Field(..., max_length=255)
    telefono: str = Field(..., max_length=15)
    fotografia: str = Field(..., max_length=255)
    no_colegiado: str = Field(..., max_length=20)
    especialidad: str = Field(..., max_length=100)
    direccion_clinica: str = Field(..., max_length=255)
    correo: EmailStr
    contrasena: str = Field(..., min_length=8)