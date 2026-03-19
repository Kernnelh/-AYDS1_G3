import os
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt.exceptions import PyJWTError

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Crea un token JWT firmado.
    'data' debe contener al menos el 'sub' (ID o correo) y el 'rol'.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    
    to_encode.update({"exp": expire})
    
    # Firmamos el token con la llave secreta (del archivo .env) y el algoritmo especificado
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Esto le dice a Swagger que usaremos tokens Bearer (habilita el candadito visual en la documentación)
reutilizable_oauth2 = HTTPBearer()

def verificar_token(credenciales: HTTPAuthorizationCredentials = Depends(reutilizable_oauth2)):
    """
    Esta función intercepta la petición, lee el token del header, 
    lo desencripta y verifica que sea válido.
    """
    token = credenciales.credentials
    try:
        # Intentamos abrir el candado con nuestra llave secreta
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload # Si es válido, devolvemos los datos del usuario (correo, rol, id)
    
    except PyJWTError:
        # Si el token es falso, fue modificado o ya caducó (pasaron los 60 mins)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudo validar las credenciales o el token ha expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )