# Backend - Proyecto Análisis y Diseño 1 (AYD1)

API REST construida con **FastAPI** y **Python** para la gestión de registros médicos, pacientes y un sistema de autenticación seguro utilizando JWT y encriptación SHA-256.

## 🛠️ Tecnologías Utilizadas
* **Framework:** FastAPI
* **Lenguaje:** Python 3.10+
* **Base de Datos:** MySQL
* **ORM:** SQLAlchemy
* **Autenticación:** JSON Web Tokens (JWT)
* **Seguridad:** Passlib (SHA-256)

---

## ⚙️ Requisitos Previos
Antes de levantar el proyecto, asegúrate de tener instalado:
* Python 3.10 o superior.
* Un servidor de MySQL corriendo localmente o en la nube.
* Git y SourceTree (para el versionamiento).

---

## 🚀 Guía de Instalación y Ejecución

### 1. Clonar el repositorio

```
git clone <url-del-repositorio>
cd backend 

```

### 2. Crear y activar el Entorno Virtual

#### En Windows

```
python -m venv venv
venv\Scripts\activate
```

##### En macOS / Linux

```
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crea un archivo llamado exactamente .env en la raíz del proyecto (al mismo nivel que este README). NO subas este archivo a Git.
Agrega tus credenciales locales de MySQL con el siguiente formato

```
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nombre_de_tu_base_de_datos
```

### 5. Ejecutar servidor local
```
uvicorn app.main:app --reload
```

# 📂 Estructura del Proyecto
* app/api/: Controladores y rutas de los endpoints (Auth, Pacientes, Médicos, Admin).

* app/core/: Configuraciones globales y lógica de seguridad (JWT, SHA-256).

* app/db/: Conexión a la base de datos MySQL con SQLAlchemy.

* app/models/: Modelos ORM que representan las tablas en la base de datos.

* app/schemas/: Modelos Pydantic para validación de datos de entrada y salida.

* app/services/: Lógica de negocio adicional.

# 🌿 Flujo de Trabajo (Git Flow)

+ Nunca trabajar directamente sobre main o develop.

+ Crear ramas para cada tarea utilizando el formato: feature/T-XXX-descripcion (ej. feature/T-001.02-registro-paciente).

+ Utilizar Conventional Commits para los mensajes (ej. feat(pacientes): ..., fix(auth): ...).