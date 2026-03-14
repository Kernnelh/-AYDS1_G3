from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# Desactivamos temporalmente la base de datos hasta que la configuremos correctamente, para evitar errores al iniciar el servidor.
# from sqlalchemy.orm import Session
# from sqlalchemy import text
# from app.db.database import get_db, engine, Base
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Backend - AYD1",
    description="API para el sistema de registros médicos y autenticación",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción se cambia por la URL exacta del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Inicio"])
def raiz():
    return {"mensaje": "¡Servidor de AYD1 corriendo exitosamente!"}

#@app.get("/test-db", tags=["Pruebas"])
#def probar_conexion_db(db: Session = Depends(get_db)):
 #   """
 #   Endpoint temporal para verificar que las credenciales del .env 
 #   y la conexión a MySQL funcionen correctamente.
 #   """
#    try:
#        # Ejecuta una consulta muy básica para probar la conexión
#        db.execute(text("SELECT 1"))
#        return {"estado": "Éxito", "mensaje": "¡Conexión a MySQL establecida correctamente!"}
#    except Exception as e:
#        return {"estado": "Error", "detalle": str(e)}