/*
==========================================================
SCRIPT DE POBLACIÓN DE DATOS DE PRUEBA: SaludPlus
Motor: MySQL
Contraseña por defecto para todos: Password123!
==========================================================
*/

USE salud_plus;

-- ----------------------------------------------------------
-- Administrador
-- ----------------------------------------------------------
INSERT INTO Administrador (usuario, contrasena, contrasena_encrp) 
VALUES 
('admin_saludplus', '$2a$10$w09uYv6y2.x0Xw.x/fN1.OY.b/oZ5w1yZ8y.h9.dummyHash1', '$2a$10$tZ2yYv6y2.x0Xw.x/fN1.OY.b/oZ5w1yZ8y.h9.dummyHash2FA');

-- ----------------------------------------------------------
-- Pacientes
-- ----------------------------------------------------------
INSERT INTO Paciente (nombre, apellido, dpi, genero, direccion, telefono, fecha_nacimiento, fotografia, correo, contrasena, estado) VALUES
('Juan', 'Pérez', '1234567890101', 'Masculino', 'Zona 1, Ciudad', '55551111', '1990-05-15', 'juan.jpg', 'juan.perez@email.com', '$2a$10$dummyHash', 'Aprobado'),
('María', 'Gómez', '2345678901012', 'Femenino', 'Zona 2, Ciudad', '55552222', '1985-10-20', NULL, 'maria.gomez@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Carlos', 'López', '3456789010123', 'Masculino', 'Zona 3, Ciudad', '55553333', '1992-03-10', 'carlos.jpg', 'carlos.lopez@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Ana', 'Martínez', '4567890101234', 'Femenino', 'Zona 4, Ciudad', '55554444', '1998-07-25', 'ana.jpg', 'ana.martinez@email.com', '$2a$10$dummyHash', 'Pendiente'),
('Luis', 'Hernández', '5678901012345', 'Masculino', 'Zona 5, Ciudad', '55555555', '1980-12-05', NULL, 'luis.hernandez@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Laura', 'García', '6789010123456', 'Femenino', 'Zona 6, Ciudad', '55556666', '1995-02-14', 'laura.jpg', 'laura.garcia@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Pedro', 'Ramírez', '7890101234567', 'Masculino', 'Zona 7, Ciudad', '55557777', '1988-09-30', NULL, 'pedro.ramirez@email.com', '$2a$10$dummyHash', 'Rechazado'),
('Sofía', 'Cruz', '8901012345678', 'Femenino', 'Zona 8, Ciudad', '55558888', '2000-11-11', 'sofia.jpg', 'sofia.cruz@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Diego', 'Morales', '9010123456789', 'Masculino', 'Zona 9, Ciudad', '55559999', '1993-04-04', 'diego.jpg', 'diego.morales@email.com', '$2a$10$dummyHash', 'Pendiente'),
('Carmen', 'Reyes', '0123456789012', 'Femenino', 'Zona 10, Ciudad', '55550000', '1982-08-18', NULL, 'carmen.reyes@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Jorge', 'Ortiz', '1122334455667', 'Masculino', 'Zona 11, Ciudad', '44441111', '1975-01-22', 'jorge.jpg', 'jorge.ortiz@email.com', '$2a$10$dummyHash', 'Desactivado'),
('Elena', 'Ruiz', '2233445566778', 'Femenino', 'Zona 12, Ciudad', '44442222', '1997-06-09', NULL, 'elena.ruiz@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Miguel', 'Flores', '3344556677889', 'Masculino', 'Zona 13, Ciudad', '44443333', '1989-12-12', 'miguel.jpg', 'miguel.flores@email.com', '$2a$10$dummyHash', 'Aprobado'),
('Rosa', 'Castro', '4455667788990', 'Femenino', 'Zona 14, Ciudad', '44444444', '1994-03-31', 'rosa.jpg', 'rosa.castro@email.com', '$2a$10$dummyHash', 'Pendiente'),
('Fernando', 'Vargas', '5566778899001', 'Masculino', 'Zona 15, Ciudad', '44445555', '1986-05-20', NULL, 'fernando.vargas@email.com', '$2a$10$dummyHash', 'Aprobado');

-- ----------------------------------------------------------
-- Médicos
-- ----------------------------------------------------------
INSERT INTO Medico (nombre, apellido, dpi, fecha_nacimiento, genero, direccion, telefono, fotografia, no_colegiado, especialidad, direccion_clinica, correo, contrasena, estado) VALUES
('Dr. Roberto', 'Méndez', '9876543210101', '1970-02-10', 'Masculino', 'Zona 10, Ciudad', '33331111', 'dr_roberto.jpg', 'COL-1001', 'Cardiología', 'Edificio Sixtino 1, Of 101', 'roberto.mendez@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dra. Silvia', 'Pineda', '8765432101012', '1975-08-15', 'Femenino', 'Zona 14, Ciudad', '33332222', 'dra_silvia.jpg', 'COL-1002', 'Pediatría', 'Clínicas Médicas Z14', 'silvia.pineda@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dr. Mario', 'Salazar', '7654321010123', '1980-11-20', 'Masculino', 'Zona 1, Ciudad', '33333333', 'dr_mario.jpg', 'COL-1003', 'Dermatología', 'Centro Médico Zona 1', 'mario.salazar@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dra. Lucía', 'Navarro', '6543210101234', '1985-05-05', 'Femenino', 'Zona 9, Ciudad', '33334444', 'dra_lucia.jpg', 'COL-1004', 'Neurología', 'Hospital Las Américas Of 5', 'lucia.navarro@saludplus.com', '$2a$10$dummyHash', 'Pendiente'),
('Dr. Andrés', 'Cabrera', '5432101012345', '1978-09-12', 'Masculino', 'Zona 10, Ciudad', '33335555', 'dr_andres.jpg', 'COL-1005', 'Gastroenterología', 'Edificio Sixtino 2, Of 205', 'andres.cabrera@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dra. Patricia', 'Ríos', '4321010123456', '1982-01-30', 'Femenino', 'Zona 15, Ciudad', '33336666', 'dra_patricia.jpg', 'COL-1006', 'Ginecología', 'Multimédica Z15, Of 402', 'patricia.rios@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dr. Héctor', 'Molina', '3210101234567', '1973-04-18', 'Masculino', 'Zona 11, Ciudad', '33337777', 'dr_hector.jpg', 'COL-1007', 'Traumatología', 'Hospital Majadas', 'hector.molina@saludplus.com', '$2a$10$dummyHash', 'Desactivado'),
('Dra. Beatriz', 'Sosa', '2101012345678', '1988-07-07', 'Femenino', 'Zona 10, Ciudad', '33338888', 'dra_beatriz.jpg', 'COL-1008', 'Oftalmología', 'Clínica Visual Z10', 'beatriz.sosa@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dr. Oscar', 'Vega', '1010123456789', '1979-10-25', 'Masculino', 'Zona 14, Ciudad', '33339999', 'dr_oscar.jpg', 'COL-1009', 'Otorrinolaringología', 'Centro ORL Las Américas', 'oscar.vega@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dra. Natalia', 'Paz', '0987654321098', '1984-12-03', 'Femenino', 'Zona 9, Ciudad', '33330000', 'dra_natalia.jpg', 'COL-1010', 'Psiquiatría', 'Clínicas Mentis', 'natalia.paz@saludplus.com', '$2a$10$dummyHash', 'Pendiente'),
('Dr. Ricardo', 'Chávez', '9876501234567', '1972-03-14', 'Masculino', 'Zona 15, Ciudad', '22221111', 'dr_ricardo.jpg', 'COL-1011', 'Oncología', 'Hope Clinic Z15', 'ricardo.chavez@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dra. Mónica', 'Guzmán', '8765490123456', '1981-06-28', 'Femenino', 'Zona 10, Ciudad', '22222222', 'dra_monica.jpg', 'COL-1012', 'Endocrinología', 'Edificio Sixtino 1, Of 505', 'monica.guzman@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dr. Felipe', 'Rojas', '7654389012345', '1976-09-09', 'Masculino', 'Zona 11, Ciudad', '22223333', 'dr_felipe.jpg', 'COL-1013', 'Medicina General', 'Clínicas Familiares Majadas', 'felipe.rojas@saludplus.com', '$2a$10$dummyHash', 'Rechazado'),
('Dra. Verónica', 'Silva', '6543278901234', '1989-02-22', 'Femenino', 'Zona 14, Ciudad', '22224444', 'dra_veronica.jpg', 'COL-1014', 'Nutrición', 'Healthy Life Center Z14', 'veronica.silva@saludplus.com', '$2a$10$dummyHash', 'Aprobado'),
('Dr. Gustavo', 'Lara', '5432167890123', '1974-11-30', 'Masculino', 'Zona 1, Ciudad', '22225555', 'dr_gustavo.jpg', 'COL-1015', 'Odontología', 'Sonrisa Perfecta Z1', 'gustavo.lara@saludplus.com', '$2a$10$dummyHash', 'Aprobado');

-- ----------------------------------------------------------
-- Horario_Medico 
-- ----------------------------------------------------------
INSERT INTO Horario_Medico (id_medico, hora_inicio, hora_fin) VALUES
(1, '08:00:00', '16:00:00'),
(2, '09:00:00', '13:00:00'),
(3, '14:00:00', '18:00:00'),
(4, '07:00:00', '15:00:00'),
(5, '10:00:00', '17:00:00'),
(6, '08:30:00', '14:30:00'),
(7, '11:00:00', '19:00:00'),
(8, '09:00:00', '15:00:00'),
(9, '13:00:00', '17:00:00'),
(10, '08:00:00', '12:00:00'),
(11, '10:00:00', '18:00:00'),
(12, '07:30:00', '13:30:00'),
(13, '15:00:00', '20:00:00'),
(14, '09:00:00', '16:00:00'),
(15, '08:00:00', '17:00:00');

-- ----------------------------------------------------------
-- Dia_Atencion
-- ----------------------------------------------------------
INSERT INTO Dia_Atencion (id_medico, dia_semana) VALUES
(1, 'Lunes'), (1, 'Miércoles'), (1, 'Viernes'),
(2, 'Martes'), (2, 'Jueves'),
(3, 'Lunes'), (3, 'Martes'), (3, 'Miércoles'), (3, 'Jueves'), (3, 'Viernes'),
(4, 'Sábado'), (4, 'Domingo'),
(5, 'Lunes'), (5, 'Jueves'), (5, 'Viernes'),
(6, 'Martes'), (6, 'Miércoles'),
(8, 'Lunes'), (8, 'Miércoles'), (8, 'Viernes'),
(9, 'Martes'), (9, 'Jueves'), (9, 'Sábado'),
(11, 'Lunes'), (11, 'Martes'), (11, 'Miércoles'),
(12, 'Jueves'), (12, 'Viernes'),
(14, 'Lunes'), (14, 'Martes'), (14, 'Jueves'),
(15, 'Lunes'), (15, 'Martes'), (15, 'Miércoles'), (15, 'Jueves'), (15, 'Viernes'), (15, 'Sábado');

-- ----------------------------------------------------------
-- Citas
-- ----------------------------------------------------------
INSERT INTO Cita (id_paciente, id_medico, fecha, hora, motivo, tratamiento, estado, fecha_cancelacion) VALUES
(1, 1, '2026-02-01', '09:00:00', 'Dolor en el pecho persistente.', 'Reposo y receta de aspirinas. Próximo chequeo en 15 días.', 'Atendida', NULL),
(2, 2, '2026-02-05', '10:00:00', 'Chequeo general de rutina del infante.', 'Vitaminas pediátricas recetadas.', 'Atendida', NULL),
(3, 3, '2026-02-15', '14:30:00', 'Revisión de manchas en la piel.', NULL, 'Pendiente', NULL),
(5, 5, '2026-02-16', '11:00:00', 'Dolor estomacal agudo.', NULL, 'Cancelada_Paciente', '2026-02-14 08:30:00'),
(6, 6, '2026-02-20', '09:30:00', 'Consulta ginecológica anual.', NULL, 'Pendiente', NULL),
(8, 8, '2026-02-22', '10:00:00', 'Pérdida de agudeza visual.', NULL, 'Pendiente', NULL),
(10, 1, '2026-02-25', '11:00:00', 'Palpitaciones irregulares.', NULL, 'Cancelada_Medico', '2026-02-24 10:15:00'),
(12, 12, '2026-02-28', '08:00:00', 'Control de tiroides.', NULL, 'Pendiente', NULL),
(13, 14, '2026-02-30', '15:00:00', 'Asesoría para bajar de peso.', NULL, 'Pendiente', NULL),
(15, 15, '2026-03-02', '08:30:00', 'Limpieza dental y revisión.', NULL, 'Pendiente', NULL);