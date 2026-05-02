from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy import text

from app.db.database import get_db
from app.schemas.auth import LoginRequest
from app.models.paciente import Paciente, EstadoUsuarioEnum as EstadoPaciente
from app.models.medico import Medico, EstadoUsuarioEnum as EstadoMedico
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
        token = create_access_token(data={"sub": admin[0], "rol": "administrador"})
        return {"mensaje": "Redirigiendo a 2FA", "token": token, "rol": "administrador"}

    # 2. Intentar como Paciente
    paciente = db.query(Paciente).filter(Paciente.correo == credenciales.correo).first()
    if paciente and pwd_context.verify(credenciales.contrasena, paciente.contrasena):
        # A. Verificación de estado de cuenta
        if paciente.estado in [EstadoPaciente.Pendiente, EstadoPaciente.Rechazado, EstadoPaciente.Desactivado]:
            raise HTTPException(status_code=403, detail=f"Su cuenta no está activa. Estado actual: PENDIENTE, RECHAZADO o DESACTIVADO")
        
        # B. Verificación de Token para primer inicio
        if not paciente.correo_verificado:
            if not credenciales.token_verificacion:
                # CAMBIO CLAVE: Devolvemos 200 OK y la bandera primer_ingreso
                return {"mensaje": "Requiere token", "primer_ingreso": True}
            
            if credenciales.token_verificacion != paciente.token_verificacion:
                raise HTTPException(status_code=401, detail="Token de verificación incorrecto.")
            
            # Si es correcto, validamos la cuenta y guardamos
            paciente.correo_verificado = True
            paciente.token_verificacion = None
            db.commit()
        
        token = create_access_token(data={"sub": paciente.correo, "rol": "paciente", "id": paciente.id_paciente})
        return {"mensaje": "Login exitoso", "token": token, "rol": "paciente"}

    # 3. Intentar como Médico
    medico = db.query(Medico).filter(Medico.correo == credenciales.correo).first()
    if medico and pwd_context.verify(credenciales.contrasena, medico.contrasena):
        # A. Verificación de estado de cuenta
        if medico.estado in [EstadoMedico.Pendiente, EstadoMedico.Rechazado, EstadoMedico.Desactivado]:
            raise HTTPException(status_code=403, detail=f"Su cuenta no está activa. Estado actual: {medico.estado}")
        
        # B. Verificación de Token para primer inicio
        if not medico.correo_verificado:
            if not credenciales.token_verificacion:
                # CAMBIO CLAVE: Devolvemos 200 OK y la bandera primer_ingreso
                return {"mensaje": "Requiere token", "primer_ingreso": True}
            
            if credenciales.token_verificacion != medico.token_verificacion:
                raise HTTPException(status_code=401, detail="Token de verificación incorrecto.")
            
            # Si es correcto, validamos la cuenta y guardamos
            medico.correo_verificado = True
            medico.token_verificacion = None
            db.commit()
            
        token = create_access_token(data={"sub": medico.correo, "rol": "medico", "id": medico.id_medico})
        return {"mensaje": "Login exitoso", "token": token, "rol": "medico"}

    # 4. Si no se encontró o la contraseña es incorrecta
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")

@router.get("/generar-clave", tags=["Test"])
def generar_clave():
    """Genera un hash nativo compatible con este backend"""
    hash_real = pwd_context.hash("secreto_2026")
    return {"hash_generado": hash_real}