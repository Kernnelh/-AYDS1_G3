import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from app.api.routes.medicos import router
from app.db.database import get_db
from app.core.security import verificar_token
from app.models.cita import EstadoCitaEnum

# 1. Configuramos una app de FastAPI "falsa"
app = FastAPI()
app.include_router(router)
client = TestClient(app)

# 2. Creamos funciones "Fake" para sobreescribir las dependencias

def override_verificar_token_medico():
    """Simula que un médico con ID 1 ha iniciado sesión"""
    return {"rol": "medico", "id": 1}

def override_verificar_token_paciente():
    """Simula que un paciente (no médico) ha iniciado sesión"""
    return {"rol": "paciente", "id": 99}

# =====================================================================
# PRUEBA 1: Rol Incorrecto
# Ruta: GET /perfil
# =====================================================================
def test_obtener_perfil_medico_acceso_denegado():
    # Sobreescribimos el token para simular que somos un paciente
    app.dependency_overrides[verificar_token] = override_verificar_token_paciente
    
    response = client.get("/perfil")
    
    assert response.status_code == 403
    assert response.json()["detail"] == "Acceso denegado."
    
    # Limpiamos el override
    app.dependency_overrides.clear()

# =====================================================================
# PRUEBA 2: Médico no encontrado en la base de datos
# Ruta: GET /perfil
# =====================================================================
def test_obtener_perfil_medico_no_encontrado():
    app.dependency_overrides[verificar_token] = override_verificar_token_medico
    
    # Creamos un mock  de la base de datos
    mock_db = MagicMock()
    # Le decimos al mock que cuando encadene query().filter().first(), devuelva None
    mock_db.query.return_value.filter.return_value.first.return_value = None
    
    # Sobreescribimos la base de datos para que use nuestro mock
    app.dependency_overrides[get_db] = lambda: mock_db
    
    response = client.get("/perfil")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Médico no encontrado"
    
    app.dependency_overrides.clear()

# =====================================================================
# PRUEBA 3: Registrar tratamiento pero la cita no existe
# Ruta: POST /tratamiento
# =====================================================================
def test_registrar_tratamiento_cita_no_existe():
    mock_db = MagicMock()
    # Simulamos que la búsqueda de la cita devuelve None
    mock_db.query.return_value.filter.return_value.first.return_value = None
    app.dependency_overrides[get_db] = lambda: mock_db

    datos_tratamiento = {
        "id_cita": 999,
        "diagnostico": "Gripe común",
        "medicamentos": []
    }

    response = client.post("/tratamiento", json=datos_tratamiento)
    
    assert response.status_code == 404
    assert response.json()["detail"] == "La cita especificada no existe"
    
    app.dependency_overrides.clear()

# =====================================================================
# PRUEBA 4: Atender cita que no está en estado "Pendiente"
# Ruta: PUT /citas/{id_cita}/atender
# =====================================================================
def test_atender_cita_estado_incorrecto():
    app.dependency_overrides[verificar_token] = override_verificar_token_medico
    
    # Creamos un objeto Cita falso que ya está "Atendido"
    mock_cita = MagicMock()
    mock_cita.estado = EstadoCitaEnum.Atendida 
    
    mock_db = MagicMock()
    # Al buscar la cita, devolvemos nuestra cita falsa
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cita
    app.dependency_overrides[get_db] = lambda: mock_db

    datos = {"tratamiento": "Reposo por 3 días"}
    
    response = client.put("/citas/1/atender", json=datos)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Solo puedes atender citas que estén en estado Pendiente."
    
    app.dependency_overrides.clear()

# =====================================================================
# PRUEBA 5: Obtener citas pendientes exitosamente (Mock devolviendo lista)
# Ruta: GET /citas/pendientes
# =====================================================================
def test_obtener_citas_pendientes_vacia_exito():
    app.dependency_overrides[verificar_token] = override_verificar_token_medico
    
    mock_db = MagicMock()
    # Simulamos que `.all()` devuelve una lista vacía (el médico no tiene citas)
    mock_db.query.return_value.filter.return_value.all.return_value = []
    
    app.dependency_overrides[get_db] = lambda: mock_db
    
    response = client.get("/citas/pendientes")
    
    assert response.status_code == 200
    # Esperamos que la respuesta sea una lista vacía
    assert response.json() == []
    
    app.dependency_overrides.clear()