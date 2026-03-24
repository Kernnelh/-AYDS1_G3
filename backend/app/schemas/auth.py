from pydantic import BaseModel

class LoginRequest(BaseModel):
    # Usamos string normal en lugar de EmailStr porque el Administrador usa "admin" en vez de correo
    correo: str 
    contrasena: str