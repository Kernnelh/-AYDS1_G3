# Documento de Requerimientos

Este documento detalla los Requerimientos Funcionales (RF) y No Funcionales (RNF) de la fase 1 del proyecto.

---

## Requerimientos Funcionales (RF)

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-001**  |
| Descripción | El sistema debe permitir el registro de pacientes solicitando: nombre, apellido, DPI, fecha de nacimiento, género, dirección, teléfono, fotografía (opcional), correo y contraseña segura.|
| Actores involucrados | Paciente, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-002**  |
| Descripción | El sistema debe permitir el registro de médicos solicitando datos personales y profesionales: número de colegiado, especialidad, dirección de clínica, fotografía (obligatoria) y contraseña segura. |
| Actores involucrados | Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-003**  |
| Descripción | El sistema debe permitir al administrador visualizar una lista de médicos y pacientes registrados con estado "Pendiente" para aprobar, rechazar o simplemente desactivar en la plataforma. |
| Actores involucrados | Administrador, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-004**  |
| Descripción | El sistema debe permitir el inicio de sesión para pacientes y médicos utilizando correo y contraseña, validando previamente que su estado sea "Aprobado" |
| Actores involucrados | Paciente, Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-005**  |
| Descripción | El sistema debe contar con un inicio de sesión de dos pasos para el Administrador, requiriendo credenciales base y la subida del archivo (`auth2-ayd1.txt`).|
| Actores involucrados | Administrador, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-006**  |
| Descripción | El sistema debe permitir al médico configurar sus días de atención y un rango de horario general en donde tenga una hora de inicio y una final que aplicará para todos los días seleccionados. |
| Actores involucrados | Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-007**  |
| Descripción | El sistema debe validar y evitar que el médico actualice su horario si existen citas activas que queden fuera del nuevo rango propuesto. |
| Actores involucrados | Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-008**  |
| Descripción | El sistema debe mostrar al paciente una página principal con los médicos disponibles, permitiendo filtrar la lista mediante la especialidad del médico. |
| Actores involucrados | Paciente, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-009**  |
| Descripción | El sistema debe permitir al paciente agendar una cita validando que no se traslape con otra cita, que no se traslape horario del médico y que no agende más de una cita activa con el mismo doctor. |
| Actores involucrados | Paciente, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-010**  |
| Descripción | El sistema debe permitir al médico visualizar una lista de sus citas pendientes, ordenadas por fecha más reciente, mostrando la información del paciente y el motivo.|
| Actores involucrados | Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-011**  |
| Descripción | El sistema debe permitir al médico marcar una cita como "Atendida", desplegando un formulario para ingresar el tratamiento recetado.|
| Actores involucrados | Médico, Sistema |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RF-012**  |
| Descripción | El sistema debe permitir a los médicos y pacientes cancelar citas activas. En caso de que el médico cancele, el sistema enviará automáticamente un correo electrónico de notificación al paciente.|
| Actores involucrados | Paciente, Médico, Sistema |

---



## Requerimientos No Funcionales (RNF)

###  RESTRICCIÓN 

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RR-001** |
| Descripción | Permite crear contenedores que garantizan la consistencia de las aplicaciones en diferentes entornos, eliminando problemas de compatibilidad y simplificando tanto el desarrollo como el despliegue. |
| Justificación | El sistema debe ejecutarse en varios entornos. |
| Impacto | Todo el sistema. |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RR-002** |
| Descripción | El control de versiones del proyecto debe manejarse en un repositorio centralizado bajo el flujo de trabajo estándar de **Git Flow**. |
| Justificación | El control de manejo de versiones es importante en el desarrollo colaborativo |
| Impacto | Versionamiento |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **RR-003** |
| Descripción | El sistema manejará datos personales por el cual se manejarán estándares de manejo de contraseñas. |
| Justificación | El sistema manejará distintos datos personales de Médicos y Pacientes. |
| Impacto | Todo el sistema. |


### CALIDAD

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **EAC-001** |
| Atributo de calidad | **Seguridad** |
| Escenario crudo | Usuario mal intencionado tiene acceso parcial o total a la base de datos |
| Estímulo | Filtración de contraseñas |
| Fuente del estímulo | Personas no autorizadas con acceso al servidor | 
| Entorno | Persona no autorizada con acceso a cuentas de administrador |
| Artefacto | Sistema en general |
| Respuesta Esperada | Las contraseñas de todos los usuarios deben guardarse encriptadas en la base de datos. |
| Medida de la respuesta | El 100% de los datos sensibles almacenados deben estar cifrados con AES-256. |
| Objetivo del negocio | Garantiza la seguridad de las cuentas o filtración de datos |


| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **EAC-002** |
| Atributo de calidad | **Seguridad** |
| Escenario crudo | Usuario mal intencionado tiene acceso parcial o total a la base de datos |
| Estímulo | Filtración de contraseñas |
| Fuente del estímulo | Personas no autorizadas con acceso al servidor | 
| Entorno | Persona no autorizada con acceso a cuentas de administrador |
| Artefacto | Sistema en general |
| Respuesta Esperada |  Toda contraseña ingresada durante el registro debe contener un mínimo de 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un número. |
| Medida de la respuesta | El 100% de las contraseñas deben cumplir con las condiciones |
| Objetivo del negocio | Garantiza la seguridad de las cuentas o filtración de datos además de ser más difíciles de descifrar |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **EAC-003** |
| Atributo de calidad | **Eficiena** |
| Escenario crudo | El paciente se asigna con cualquier médico sin validar disponibilidad de horario |
| Estímulo | Asignacion de citas |
| Fuente del estímulo | Paciente | 
| Entorno | Asinación de citas 24/7 |
| Artefacto | Sistema de citas |
| Respuesta Esperada | El sistema debe validar la disponibilidad de horarios en tiempo real para evitar condiciones de carrera (doble reserva) en el cruce de citas.
| Medida de la respuesta | El 100% de las solicitudes de citas deben ser validados por el sistema |
| Objetivo del negocio | Garantiza la Eficiencia del sistema y de los médicos y evitar que el médico esté "corriendo" con las citas |

| CAMPO | CONTENIDO |
|-------|-----------|
| ID | **EAC-004** |
| Atributo de calidad | **Interoperabilidad** |
| Escenario crudo | Doctor desea cancelar cita con algún paciente en específico |
| Estímulo | Inconveniente o contratiempo con el médico |
| Fuente del estímulo | Médico | 
| Entorno | Médico tiene un contratiempo |
| Artefacto | Sistema en citas |
| Respuesta Esperada |  El backend debe integrarse con un servidor SMTP o servicio de terceros para el envío de correos electrónicos de cancelación. |
| Medida de la respuesta | El 100% de las citas canceladas del lado de doctor deben mandarse al correo del paciente con su respectiva justificación |
| Objetivo del negocio | Garantiza interoperabilidad del sistema y la eficiencia en el manejo y cancelación de citas |
