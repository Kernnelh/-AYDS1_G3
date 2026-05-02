# Documento de Requerimientos

Este documento detalla los Requerimientos Funcionales (RF) y No Funcionales (RNF) de la Fase 2 del proyecto SaludPlus.

---

## Requerimientos Funcionales (RF)

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-013** |
| Descripción | El sistema debe requerir y validar la carga de archivos en formato PDF (DPI para pacientes, CV para médicos) y una fotografía válida durante el proceso de registro de nuevos usuarios. |
| Actores involucrados | Paciente, Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-014** |
| Descripción | El sistema debe generar y enviar un token único al correo electrónico del usuario registrado, el cual será exigido de forma obligatoria durante su primer inicio de sesión para verificar la cuenta. |
| Actores involucrados | Paciente, Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-015** |
| Descripción | El sistema debe incluir un visor de archivos PDF embebido en el módulo del administrador para permitir la lectura de los documentos de identidad y currículums sin necesidad de descargarlos. |
| Actores involucrados | Administrador, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-016** |
| Descripción | El sistema debe proveer un formulario al médico para ingresar obligatoriamente un diagnóstico y una lista dinámica de medicamentos (nombre, cantidad, tiempo, dosis) al marcar una cita como "Atendida". |
| Actores involucrados | Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-017** |
| Descripción | El sistema debe permitir al paciente visualizar el detalle de su tratamiento y generar un documento PDF descargable con formato de receta médica. |
| Actores involucrados | Paciente, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-018** |
| Descripción | El sistema debe habilitar un sistema de evaluación mutua que permita a pacientes y médicos otorgarse de 0 a 5 estrellas y/o levantar reportes categorizados tras la finalización de una cita. |
| Actores involucrados | Paciente, Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-019** |
| Descripción | El sistema debe permitir al administrador gestionar el directorio de usuarios activos (edición y desactivación), así como revisar y auditar los reportes y promedios de calificación cruzados. |
| Actores involucrados | Administrador, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-020** |
| Descripción | El sistema debe generar dos nuevos reportes analíticos y dinámicos para la toma de decisiones gerenciales, manteniendo la funcionalidad de los reportes de la fase anterior. |
| Actores involucrados | Administrador, Sistema |

---

## Requerimientos No Funcionales (RNF)

### RESTRICCIÓN 

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RR-004** |
| Descripción | El almacenamiento y transmisión de documentos adjuntos (DPI y CV) debe restringirse exclusivamente a archivos con formato PDF, validando su extensión y tipo MIME. |
| Justificación | Garantiza que los documentos subidos sean legibles en el visor embebido y evita la inyección de archivos maliciosos. |
| Impacto | Backend (Controladores de subida) y Frontend (Validación de formularios). |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RR-005** |
| Descripción | La generación de recetas médicas debe realizarse en el lado del servidor o cliente asegurando un formato PDF estandarizado que no pueda ser alterado fácilmente tras su emisión. |
| Justificación | La receta médica es un documento de validez en farmacias, por lo que su estructura y exportación deben ser consistentes e inmutables. |
| Impacto | Módulo de visualización e impresión de pacientes. |

### CALIDAD

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **EAC-005** |
| Atributo de calidad | **Seguridad / Autenticación** |
| Escenario crudo | Registro de usuarios con correos electrónicos falsos o bots |
| Estímulo | Creación masiva de cuentas ficticias |
| Fuente del estímulo | Scripts automatizados o usuarios malintencionados | 
| Entorno | Pantalla de Login / Base de datos |
| Artefacto | Módulo de Autenticación |
| Respuesta Esperada | El sistema bloquea el acceso completo a la plataforma hasta que el usuario demuestre la propiedad del correo ingresando el token enviado por email. |
| Medida de la respuesta | El 100% de los nuevos usuarios deben ingresar el token correcto en su primer inicio de sesión para activar su estado de verificación. |
| Objetivo del negocio | Garantiza que la base de datos de SaludPlus contenga únicamente usuarios legítimos y contactables. |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **EAC-006** |
| Atributo de calidad | **Usabilidad / Eficiencia** |
| Escenario crudo | Administrador pierde mucho tiempo descargando y abriendo archivos locales para validar un médico |
| Estímulo | Revisión de lista de usuarios pendientes |
| Fuente del estímulo | Crecimiento en el volumen de registros nuevos | 
| Entorno | Panel de Aprobación del Administrador |
| Artefacto | Interfaz de Usuario (Frontend) |
| Respuesta Esperada | Los documentos PDF  se renderizan de forma inmediata dentro de la misma pestaña del navegador web. |
| Medida de la respuesta | El visor debe cargar el documento sin requerir descargas adicionales ni software externo instalado en la máquina del administrador el 100% de las ocaciones. |
| Objetivo del negocio | Optimiza el tiempo operativo del administrador, reduciendo el cuello de botella en la aprobación de nuevos profesionales y pacientes. |