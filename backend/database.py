import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# 1. Cargar las variables ocultas del archivo .env
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# 2. Armar la URL de conexión que exige SQLAlchemy
# Formato: mysql+pymysql://usuario:contraseña@servidor:puerto/nombre_bd
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 3. Crear el "Engine" (El motor real que se conecta a MySQL)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 4. Configurar la fábrica de sesiones (Abre y cierra la conexión por cada petición)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Base para los modelos (Se usará después para reflejar las tablas)
Base = declarative_base()

# 6. Dependencia para inyectar la conexión en los endpoints de FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()