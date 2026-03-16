from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db, engine, Base

# Esto creará las tablas físicamente en MySQL
Base.metadata.create_all(bind=engine)

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