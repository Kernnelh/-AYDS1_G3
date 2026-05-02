# Historias de Usuario 

En este documento se detallan las Historias de Usuario (HU) definidas para el desarrollo del proyecto correspondientes a la Fase 2. 

---

### Módulo de Registro y Validación

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-012** |
| **Título** | Actualización de Registro con Carga de Documentos |
| **Descripción** | **Como** médico o paciente, **quiero** poder subir archivos PDF (DPI escaneado o CV) y una fotografía reciente durante mi registro **para** cumplir con los nuevos requisitos de validación del sistema. |
| **Criterios de aceptación** | • El formulario de paciente debe exigir obligatoriamente una foto reciente y un archivo PDF del DPI.<br>• El formulario del médico debe exigir obligatoriamente un archivo PDF con su CV.<br>• El sistema debe validar que los archivos subidos sean efectivamente formato PDF e imágenes válidas. |
| **Prioridad** | Alta |
| **Estimación** | 5 Puntos |
| **Dependencias** | HU-001, HU-002 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-013** |
| **Título** | Validación de Correo con Token en Primer Inicio de Sesión |
| **Descripción** | **Como** usuario nuevo, **quiero** recibir un token por correo electrónico al registrarme y usarlo en mi primer inicio de sesión **para** verificar la autenticidad de mi cuenta. |
| **Criterios de aceptación** | • Al registrarse, el sistema debe generar un token único y enviar un correo con el logo de SaludPlus, mensaje de bienvenida e instrucciones.<br>• En el primer inicio de sesión, el formulario debe exigir: correo, contraseña y el token.<br>• El sistema debe validar el token, y verificar que el administrador haya aprobado la cuenta.<br>• Los inicios de sesión posteriores solo deben pedir correo y contraseña. |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-012, HU-003 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-014** |
| **Título** | Visualización Embebida de Documentos para Aprobación |
| **Descripción** | **Como** administrador, **quiero** visualizar los documentos PDF (DPI y CV) directamente en el navegador al revisar las solicitudes de nuevos usuarios **para** agilizar el proceso de aprobación sin descargar archivos. |
| **Criterios de aceptación** | • En la lista de usuarios pendientes, debe existir un visor PDF embebido.<br>• Si el paciente no subió foto en la Fase 1, se debe mostrar una por defecto.<br>• Los botones de "Aceptar" y "Rechazar" deben seguir funcionando correctamente tras la revisión de los documentos. |
| **Prioridad** | Alta |
| **Estimación** | 2 Puntos |
| **Dependencias** | HU-012, HU-005 |

---

### Módulo de Tratamientos y Consultas

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-015** |
| **Título** | Registro de Tratamiento Médico Estructurado |
| **Descripción** | **Como** médico, **quiero** registrar un tratamiento detallado y estructurado al marcar una cita como "Atendida" **para** brindar instrucciones claras a mis pacientes. |
| **Criterios de aceptación** | • Al hacer clic en el botón para atender, se debe abrir un formulario que exija obligatoriamente un "Diagnóstico".<br>• Debe permitir agregar uno o varios medicamentos indicando: Nombre, Cantidad, Tiempo del medicamento y Descripción de la dosis.<br>• Una vez guardado el tratamiento, la cita pasa al historial con estado "Atendida". |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-007 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-016** |
| **Título** | Visualización e Impresión de Tratamiento Médico |
| **Descripción** | **Como** paciente, **quiero** ver los detalles estructurados de mi tratamiento en el historial de citas y poder generar un PDF de mi receta médica **para** comprar mis medicamentos. |
| **Criterios de aceptación** | • El detalle del tratamiento debe mostrar diagnóstico, fecha de última cita, datos del médico con su colegiado correspondiente y la lista detallada de medicamentos.<br>• Debe existir un botón para imprimir el PDF.<br>• El PDF debe incluir un encabezado (SaludPlus, fecha, teléfono), cuerpo (tabla de medicamentos) y pie de documento (nombre del médico, especialidad, colegiado y espacio para firma). |
| **Prioridad** | Alta |
| **Estimación** | 2 Puntos |
| **Dependencias** | HU-015 |

---

### Módulo de Calidad, Calificaciones y Reportes

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-017** |
| **Título** | Calificación y Reporte de Médicos |
| **Descripción** | **Como** paciente, **quiero** poder calificar de 0 a 5 estrellas y/o reportar a un médico después de una cita atendida **para** evaluar su servicio o denunciar malas prácticas. |
| **Criterios de aceptación** | • Solo se permiten estas acciones en citas con estado "Atendido".<br>• La calificación debe permitir seleccionar de 0 a 5 estrellas y dejar un comentario opcional.<br>• El reporte debe permitir seleccionar una categoría predefinida (Ej. Negligencia, Abuso) y exigir una explicación detallada.<br>• El reporte debe enviarse al módulo del administrador. |
| **Prioridad** | Media |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-015 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-018** |
| **Título** | Calificación y Reporte de Pacientes |
| **Descripción** | **Como** médico, **quiero** poder calificar y/o reportar a un paciente problemático después de haberlo atendido **para** mantener un registro de su conducta. |
| **Criterios de aceptación** | • Solo aplica para citas con estado "Atendido".<br>• La calificación exige estrellas (0-5) y comentario explicativo.<br>• El reporte exige seleccionar categoría (Ej. Conducta inapropiada, Agresión, mal uso de instalaciones) y explicación detallada.<br>• El reporte debe enviarse al módulo del administrador. |
| **Prioridad** | Media |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-015 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-019** |
| **Título** | Gestión de Usuarios Activos |
| **Descripción** | **Como** administrador, **quiero** ver una lista de pacientes y médicos ya aceptados **para** poder editar su información o darlos de baja si es necesario. |
| **Criterios de aceptación** | • Deben existir vistas separadas para médicos y pacientes activos.<br>• El administrador puede editar cualquier campo del perfil excepto el correo electrónico.<br>• Debe existir un botón funcional para desactivar a un usuario, pidiendo confirmación. |
| **Prioridad** | Alta |
| **Estimación** | 1 Punto |
| **Dependencias** | HU-005 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-020** |
| **Título** | Gestión de Reportes y Calificaciones Globales |
| **Descripción** | **Como** administrador, **quiero** revisar los reportes cruzados entre médicos y pacientes, así como sus promedios de calificación, **para** tomar acciones disciplinarias. |
| **Criterios de aceptación** | • Vistas separadas para reportes hacia médicos y hacia pacientes, mostrando detalles, fechas y nombres involucrados.<br>• Botones para "Dar de baja" al reportado o "Rechazar denuncia".<br>• Vistas separadas para ver el promedio global de estrellas (0-5) de todos los médicos activos y pacientes activos. |
| **Prioridad** | Alta |
| **Estimación** | 3 Puntos |
| **Dependencias** | HU-017, HU-018 |

<br>

| Campo | Detalle |
| :--- | :--- |
| **ID** | **HU-021** |
| **Título** | Generación de Reportes Analíticos Nuevos |
| **Descripción** | **Como** administrador, **quiero** generar al menos dos reportes estadísticos nuevos sobre el uso de la plataforma **para** apoyar la toma de decisiones gerenciales. |
| **Criterios de aceptación** | • El sistema debe generar 2 reportes funcionales y dinámicos.<br>• Los reportes desarrollados en la Fase 1 deben seguir funcionando correctamente. |
| **Prioridad** | Media |
| **Estimación** | 2 Puntos |
| **Dependencias** | Ninguna |