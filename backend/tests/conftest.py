import pytest
from fastapi.testclient import TestClient
from app.main import app 

@pytest.fixture(scope="module")
def test_client():
    """
    Este fixture crea un cliente de pruebas que simula peticiones
    a tu API sin tener que levantar el servidor uvicorn.
    """
    with TestClient(app) as client:
        yield client