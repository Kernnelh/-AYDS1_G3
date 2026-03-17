from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db, engine, Base
#RUTA DE LOS ENDPOINTS
from app.api.routes import pacientes
from app.api.routes import pacientes, medicos

from app.core.security import create_access_token #de aquí se importa la función para crear tokens JWT

# Esto creará las tablas físicamente en MySQL
#Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Backend - AYD1",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Inicio"])
def raiz():
    return {"mensaje": "¡Servidor de AYD1 corriendo exitosamente!"}

@app.get("/test-db", tags=["Pruebas"])
def probar_conexion_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"estado": "Éxito", "mensaje": "¡Conexión a MySQL establecida correctamente!"}
    except Exception as e:
        return {"estado": "Error", "detalle": str(e)}
    
@app.get("/test-token", tags=["Pruebas"])
def probar_generacion_token():
    # Simulamos que un médico se logueó
    datos_prueba = {
        "sub": "carlos.gomez@email.com",
        "rol": "medico",
        "id": 1
    }
    token = create_access_token(data=datos_prueba)
    return {"token_generado": token, "tipo": "Bearer"}
    
app.include_router(pacientes.router, prefix="/pacientes", tags=["Pacientes"])
app.include_router(medicos.router, prefix="/api/medicos", tags=["Médicos"])
