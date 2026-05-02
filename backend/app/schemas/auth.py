from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    # Usamos string normal en lugar de EmailStr porque el Administrador usa "admin" en vez de correo
    correo: str 
    contrasena: str
    token_verificacion: Optional[str] = None  # Para 2FA, si es necesario