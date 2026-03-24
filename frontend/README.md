# Frontend - Guía de Instalación y Ejecución

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Git

## Instalación

1. **Clonar el repositorio**
    ```bash
    git clone <url-del-repositorio>
    cd frontend
    ```

2. **Instalar dependencias**
    ```bash
    npm install
    ```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`

### Modo producción
```bash
npm run build
npm run start
```

## Solución de Problemas

- **Error de dependencias**: Ejecuta `npm install` nuevamente
- **Puerto en uso**: Cambia el puerto en las variables de entorno
- **Caché**: Solo de ser necesario elimina `node_modules` y reinstala: `rm -rf node_modules && npm install` <- 

## Estructura del Proyecto

```
frontend/
├── src/
├── public/
├── package.json
└── README.md
```
