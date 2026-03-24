# Historias de Usuario 

En este documento se detallan las Historias de Usuario (HU) definidas para el desarrollo del proyecto. 

---

### Módulo de Registro y Autenticación

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-001** |
| **Título** | Registro de Paciente |
| **Descripción** | **Como** paciente, **quiero** registrarme en la plataforma ingresando mis datos personales (nombre, DPI, dirección, etc.) **para** poder gestionar mis citas médicas. |
| **Criterios de aceptación** | • El formulario debe solicitar los datos requeridos, incluyendo correo electrónico y contraseña.<br>• La contraseña debe tener mínimo 8 caracteres e incluir al menos una letra minúscula, una mayúscula y un número.<br>• La contraseña debe guardarse de forma encriptada en la base de datos. |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | Ninguna |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-002** |
| **Título** | Registro de Médico |
| **Descripción** | **Como** médico, **quiero** registrar mi perfil profesional con mis datos, fotografía y especialidad **para** poder ofrecer mis servicios en la plataforma. |
| **Criterios de aceptación** | • El formulario debe solicitar todos los datos, incluyendo número de colegiado, dirección de clínica y fotografía obligatoria.<br>• La contraseña debe cumplir con los requisitos de seguridad (8 caracteres, mayúsculas, minúsculas, números) y guardarse encriptada. |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | Ninguna |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-003** |
| **Título** | Inicio de Sesión de Usuarios |
| **Descripción** | **Como** paciente o médico, **quiero** iniciar sesión en el sistema con mi correo y contraseña **para** acceder a mi panel correspondiente. |
| **Criterios de aceptación** | • El usuario debe haber sido aprobado previamente por un administrador para poder ingresar.<br>• Si hay un error, se debe mostrar un mensaje explicando el problema y ofrecer un enlace para registrarse. |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-001, HU-002, HU-004, HU-005 |

---

### Módulo Administrador

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-004** |
| **Título** | Autenticación de Administrador con 2FA |
| **Descripción** | **Como** administrador, **quiero** iniciar sesión utilizando un usuario predeterminado y un sistema de doble autenticación **para** garantizar la seguridad del sistema. |
| **Criterios de aceptación** | • Después de ingresar credenciales base, el sistema debe redirigir a una página para subir un archivo llamado `auth2-ayd1.txt`.<br>• El archivo debe contener una contraseña encriptada (diferente a la de inicio de sesión) que validará el acceso final a la página principal. |
| **Prioridad** | Alta |
| **Estimación** | 2 Puntos |
| **Dependencias** | Ninguna |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-005** |
| **Título** | Aprobación de Usuarios |
| **Descripción** | **Como** administrador, **quiero** ver una lista de pacientes y médicos que esperan ser aprobados, **para** aceptar o rechazar su registro en el sistema. |
| **Criterios de aceptación** | • Se debe mostrar la información del usuario (fotografía, nombre, DPI, etc.).<br>• Deben existir botones visibles para "aceptar" o "rechazar" la solicitud. |
| **Prioridad** | Alta |
| **Estimación** | 1 Puntos |
| **Dependencias** | HU-001, HU-002, HU-004 |

---

### Módulo Médico

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-006** |
| **Título** | Gestión de Horarios de Atención |
| **Descripción** | **Como** médico, **quiero** establecer y actualizar los días y el rango de horario en los que atenderé a mis pacientes **para** organizar mi agenda. |
| **Criterios de aceptación** | • El horario establecido aplicará para todos los días seleccionados.<br>• Al actualizar un horario, el sistema debe validar que no existan citas activas fuera del nuevo rango y si las hay no permitirá el cambio hasta reprogramar o cancelar dichas citas. |
| **Prioridad** | Alta |
| **Estimación** | 5 Puntos |
| **Dependencias** | HU-003 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-007** |
| **Título** | Atención de Citas |
| **Descripción** | **Como** médico, **quiero** visualizar mis citas pendientes ordenadas por fecha más reciente y poder marcar a un paciente como atendido luego de la consulta. |
| **Criterios de aceptación** | • La lista debe mostrar: fecha, hora, nombre del paciente y motivo.<br>• Al marcar botón atendido, se debe desplegar un formulario para ingresar el tratamiento a seguir.<br>• Una vez registrado el tratamiento, la cita debe desaparecer de las pendientes. |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-009 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-008** |
| **Título** | Cancelación de Citas por el Médico |
| **Descripción** | **Como** médico, **quiero** poder cancelar una cita en caso de algún contratiempo y que el paciente sea notificado automáticamente. |
| **Criterios de aceptación** | • Al cancelar, la cita debe desaparecer de las pendientes.<br>• El sistema debe enviar un correo electrónico al paciente con los detalles de la cancelación (fecha, hora, motivo, nombre del médico y un mensaje de disculpa). |
| **Prioridad** | Media |
| **Estimación** | 8 Puntos |
| **Dependencias** | HU-009 |

---

### Módulo Paciente

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-009** |
| **Título** | Programar Cita Médica |
| **Descripción** | **Como** paciente, **quiero** seleccionar un médico, ver sus horarios disponibles y programar una cita **para** recibir atención. |
| **Criterios de aceptación** | • Se deben validar los días que atiende el médico y que el horario esté disponible sin traslapes.<br>• No puedo agendar más de una cita con el mismo doctor, pero sí tener múltiples citas con diferentes doctores.<br>• El sistema debe evitar que yo tenga dos citas el mismo día a la misma hora.<br>• Si falla alguna validación, el sistema debe notificar el motivo. |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-003, HU-006 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-010** |
| **Título** | Búsqueda y Visualización de Médicos |
| **Descripción** | **Como** paciente, **quiero** ver a los médicos disponibles en la página principal y poder filtrarlos por especialidad **para** elegir el más adecuado. |
| **Criterios de aceptación** | • La página principal debe mostrar el nombre completo, especialidad, dirección de la clínica y foto del médico.<br>• No se deben mostrar los médicos con los que ya tengo una cita programada.<br>• Debe existir un campo (texto o ComboBox) para filtrar resultados por especialidad. |
| **Prioridad** | Media |
| **Estimación** | 2 Puntos |
| **Dependencias** | HU-003 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-011** |
| **Título** | Cancelar Cita Activa (Paciente) |
| **Descripción** | **Como** paciente, **quiero** poder cancelar una cita que tengo programada desde mi lista de citas activas. |
| **Criterios de aceptación** | • El sistema debe mostrar un mensaje de confirmación consultando si estoy seguro de cancelar la cita.<br>• Al confirmar, la cita debe eliminarse de la lista de citas activas. |
| **Prioridad** | Media |
| **Estimación** | 2 Puntos |
| **Dependencias** | HU-009 |