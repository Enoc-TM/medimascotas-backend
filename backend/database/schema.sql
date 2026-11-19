-- ========================================================
-- SISTEMA DE GESTION DE HISTORIAL CLINICO Y MASCOTAS - MEDIMASCOTAS
-- Base de Datos Relacional: MySQL 8.0+
-- ========================================================

CREATE DATABASE IF NOT EXISTS medimascotas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medimascotas_db;

-- TABLA 1: Usuarios (Autenticación y roles)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'veterinario', 'propietario') DEFAULT 'propietario',
  telefono VARCHAR(20) DEFAULT '',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- TABLA 2: Propietarios (Clientes del sistema veterinario)
CREATE TABLE IF NOT EXISTS propietarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identificacion VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(200) DEFAULT '',
  email VARCHAR(120) DEFAULT '',
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- TABLA 3: Mascotas (Pacientes veterinarios asociados a un propietario/cliente)
CREATE TABLE IF NOT EXISTS mascotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_chip VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raza VARCHAR(80) DEFAULT 'Criollo / Mestizo',
  edad INT DEFAULT 0,
  sexo ENUM('Macho', 'Hembra', 'Indefinido') DEFAULT 'Macho',
  peso_kg DECIMAL(5,2) DEFAULT 0.00,
  propietario_id INT NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mascota_propietario FOREIGN KEY (propietario_id) 
    REFERENCES propietarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- DATOS SEMILLA (Seed Data)
-- Usuario de prueba (Contraseña: Password123!)
INSERT INTO usuarios (id, nombre, email, password, rol, telefono) VALUES
(1, 'Enoc Tamayo', 'enoc@ejemplo.com', '$2a$10$wN3tN39jV5v9r9s3d0Z7UekTzKzq79yUoJ3F0H1d.V1L.mIuRj.Q6', 'admin', '3129876543'),
(2, 'Esteban Fierro', 'esteban@ejemplo.com', '$2a$10$wN3tN39jV5v9r9s3d0Z7UekTzKzq79yUoJ3F0H1d.V1L.mIuRj.Q6', 'propietario', '3157778899')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- 2 Clientes / Propietarios
INSERT INTO propietarios (id, identificacion, nombre, telefono, direccion, email, activo) VALUES
(1, '1010203040', 'Esteban Fierro', '3157778899', 'Calle 45 # 12-34, Bogotá', 'esteban.fierro@gmail.com', TRUE),
(2, '1098765432', 'Enoc Tamayo', '3164445566', 'Carrera 15 # 80-20, Bogotá', 'enoc.tamayo@gmail.com', TRUE),
(3, '52998811', 'Laura Marcela Ortiz', '3118889900', 'Av Boyaca # 170-40, Bogotá', 'laura.ortiz@gmail.com', TRUE)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Mascotas asociadas a los 2 clientes
INSERT INTO mascotas (id, codigo_chip, nombre, especie, raza, edad, sexo, peso_kg, propietario_id, activo) VALUES
(1, 'CHIP-982101', 'Lucas', 'Canino', 'Golden Retriever', 3, 'Macho', 28.50, 1, TRUE),
(2, 'CHIP-451299', 'Mishi', 'Felino', 'Siamés', 2, 'Hembra', 4.20, 2, TRUE),
(3, 'CHIP-LAB-7744', 'Rocky', 'Canino', 'Labrador Retriever', 4, 'Macho', 32.00, 1, TRUE)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), activo = TRUE;
