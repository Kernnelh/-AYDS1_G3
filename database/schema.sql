/*
==========================================================
SCRIPT DE CREACIÓN DE BASE DE DATOS: SaludPlus
Motor: MySQL
==========================================================
*/
CREATE DATABASE IF NOT EXISTS salud_plus;
USE salud_plus;

-- ----------------------------------------------------------
-- Administrador
-- ----------------------------------------------------------
CREATE TABLE Administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,      
    contrasena_encrp VARCHAR(255) NOT NULL 
);

-- ----------------------------------------------------------
-- Paciente
-- ----------------------------------------------------------
CREATE TABLE Paciente (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dpi VARCHAR(15) UNIQUE NOT NULL,
    genero ENUM('Masculino', 'Femenino') NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fotografia VARCHAR(255) NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado', 'Desactivado') DEFAULT 'Pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- Médico
-- ----------------------------------------------------------
CREATE TABLE Medico (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dpi VARCHAR(15) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('Masculino', 'Femenino') NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    fotografia VARCHAR(255) NOT NULL,
    no_colegiado VARCHAR(20) UNIQUE NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    direccion_clinica VARCHAR(255) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado', 'Desactivado') DEFAULT 'Pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- Horario_Medico
-- ----------------------------------------------------------
CREATE TABLE Horario_Medico (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_medico INT UNIQUE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- Dia_Atencion
-- ----------------------------------------------------------
CREATE TABLE Dia_Atencion (
    id_dia_atencion INT AUTO_INCREMENT PRIMARY KEY,
    id_medico INT NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico) ON DELETE CASCADE, 
    UNIQUE (id_medico, dia_semana)
);

-- ----------------------------------------------------------
-- ENTIDAD: Cita
-- ----------------------------------------------------------
CREATE TABLE Cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT NOT NULL,
    tratamiento TEXT NULL,
    estado ENUM(
        'Pendiente', 
        'Atendida', 
        'Cancelada_Paciente', 
        'Cancelada_Medico'
    ) DEFAULT 'Pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cancelacion TIMESTAMP NULL,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico) ON DELETE CASCADE
);