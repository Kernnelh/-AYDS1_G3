from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy import text

from app.db.database import get_db
from app.schemas.auth import LoginRequest
from app.models.paciente import Paciente
from app.models.medico import Medico
from app.core.security import create_access_token

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

@router.post("/login", tags=["Autenticación"])
def iniciar_sesion(credenciales: LoginRequest, db: Session = Depends(get_db)):
    
    # 1. Intentar como Administrador (Validación directa con SQL)
    admin = db.execute(
        text("SELECT usuario, contrasena FROM Administrador WHERE usuario = :user"),
        {"user": credenciales.correo}
    ).fetchone()

    if admin and pwd_context.verify(credenciales.contrasena, admin[1]):
        # El admin no necesita validación de estado, pasa directo a la fase 2
        token = create_access_token(data={"sub": admin[0], "rol": "administrador"})
        return {"mensaje": "Redirigiendo a 2FA", "token": token, "rol": "administrador"}

    # 2. Intentar como Paciente
    paciente = db.query(Paciente).filter(Paciente.correo == credenciales.correo).first()
    if paciente and pwd_context.verify(credenciales.contrasena, paciente.contrasena):
        # T-003.02: Verificación de estado
        if paciente.estado == "Pendiente":
            raise HTTPException(status_code=403, detail="Su cuenta está pendiente de aprobación")
        elif paciente.estado == "Rechazado":
            raise HTTPException(status_code=403, detail="Su cuenta ha sido rechazada o dada de baja")
        
        token = create_access_token(data={"sub": paciente.correo, "rol": "paciente", "id": paciente.id_paciente})
        return {"mensaje": "Login exitoso", "token": token, "rol": "paciente"}

    # 3. Intentar como Médico
    medico = db.query(Medico).filter(Medico.correo == credenciales.correo).first()
    if medico and pwd_context.verify(credenciales.contrasena, medico.contrasena):
        # T-003.02: Verificación de estado
        if medico.estado == "Pendiente":
            raise HTTPException(status_code=403, detail="Su cuenta está pendiente de aprobación")
        elif medico.estado == "Rechazado":
            raise HTTPException(status_code=403, detail="Su cuenta ha sido rechazada o dada de baja")
            
        token = create_access_token(data={"sub": medico.correo, "rol": "medico", "id": medico.id_medico})
        return {"mensaje": "Login exitoso", "token": token, "rol": "medico"}

    # 4. Si no se encontró en ningún lado o la contraseña es incorrecta
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")