-- ====================================================================
-- SISTEMA DE GESTION DE HISTORIAL CLINICO VETERINARIO - MEDIMASCOTAS
-- Base de Datos Relacional: MySQL 8.0+
-- Autores: Enoc Tamayo, Esteban Fierro, Santiago Avila
-- ====================================================================

CREATE DATABASE IF NOT EXISTS medimascotas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medimascotas_db;

-- 1. TABLA: Usuarios (RF-01, CU-01, RN-12)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'veterinario', 'propietario') DEFAULT 'propietario',
  telefono VARCHAR(20) DEFAULT '',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABLA: Propietarios (RF-03, CU-02, RN-02)
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

-- 3. TABLA: Mascotas (RF-04, CU-03, RN-01, RN-03, RN-11)
CREATE TABLE IF NOT EXISTS mascotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_chip VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raza VARCHAR(80) DEFAULT 'Criollo / Mestizo',
  edad INT DEFAULT 0,
  sexo ENUM('Macho', 'Hembra', 'Indefinido') DEFAULT 'Indefinido',
  peso_kg DECIMAL(5,2) DEFAULT 0.00,
  propietario_id INT NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mascota_propietario FOREIGN KEY (propietario_id) 
    REFERENCES propietarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. TABLA: Historiales Medicos (RF-05, RF-11, CU-05, RN-04)
CREATE TABLE IF NOT EXISTS historiales_medicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT NOT NULL UNIQUE,
  antecedentes TEXT,
  alergias JSON,
  observaciones_generales TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_historial_mascota FOREIGN KEY (mascota_id) 
    REFERENCES mascotas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. TABLA: Consultas Veterinarias (RF-06, CU-04, RN-05, RN-06, RN-12, RN-15)
CREATE TABLE IF NOT EXISTS consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  historial_id INT DEFAULT NULL,
  mascota_id INT NOT NULL,
  veterinario_id INT NOT NULL,
  veterinario_nombre VARCHAR(120) NOT NULL,
  fecha DATE NOT NULL,
  hora VARCHAR(10) DEFAULT '08:00',
  motivo VARCHAR(255) NOT NULL,
  observaciones TEXT,
  estado ENUM('completada', 'en_progreso', 'cancelada') DEFAULT 'completada',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_consulta_mascota FOREIGN KEY (mascota_id) 
    REFERENCES mascotas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_consulta_veterinario FOREIGN KEY (veterinario_id) 
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_consulta_historial FOREIGN KEY (historial_id) 
    REFERENCES historiales_medicos(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. TABLA: Diagnosticos (RF-07, RN-07)
CREATE TABLE IF NOT EXISTS diagnosticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consulta_id INT NOT NULL,
  descripcion TEXT NOT NULL,
  gravedad ENUM('leve', 'moderada', 'grave') DEFAULT 'leve',
  fecha DATE NOT NULL,
  CONSTRAINT fk_diagnostico_consulta FOREIGN KEY (consulta_id) 
    REFERENCES consultas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. TABLA: Tratamientos (RF-08, RN-08)
CREATE TABLE IF NOT EXISTS tratamientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diagnostico_id INT NOT NULL,
  descripcion TEXT NOT NULL,
  duracion VARCHAR(100) DEFAULT 'Segun evolucion',
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE DEFAULT NULL,
  CONSTRAINT fk_tratamiento_diagnostico FOREIGN KEY (diagnostico_id) 
    REFERENCES diagnosticos(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. TABLA: Medicamentos (RF-09, RN-09)
CREATE TABLE IF NOT EXISTS medicamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consulta_id INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  dosis VARCHAR(80) NOT NULL,
  frecuencia VARCHAR(80) NOT NULL,
  duracion VARCHAR(80) NOT NULL,
  indicaciones TEXT,
  CONSTRAINT fk_medicamento_consulta FOREIGN KEY (consulta_id) 
    REFERENCES consultas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 9. TABLA: Vacunas (RF-10, CU-06, RN-10, RN-15)
CREATE TABLE IF NOT EXISTS vacunas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT NOT NULL,
  veterinario_id INT DEFAULT 1,
  tipo_vacuna VARCHAR(100) NOT NULL,
  fecha_aplicacion DATE NOT NULL,
  dosis VARCHAR(60) DEFAULT 'Dosis unica',
  proxima_dosis DATE DEFAULT NULL,
  observaciones TEXT,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vacuna_mascota FOREIGN KEY (mascota_id) 
    REFERENCES mascotas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 10. TABLA: Recordatorios (Documento oficial: Recordatorios de salud y citas)
CREATE TABLE IF NOT EXISTS recordatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT NOT NULL,
  tipo ENUM('vacuna', 'consulta', 'tratamiento', 'medicamento') DEFAULT 'consulta',
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  fecha_recordatorio DATE NOT NULL,
  estado ENUM('pendiente', 'completado', 'cancelado') DEFAULT 'pendiente',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_recordatorio_mascota FOREIGN KEY (mascota_id) 
    REFERENCES mascotas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ====================================================================
-- DATOS SEMILLA INICIALES (SEED DATA)
-- Con los 3 integrantes: Enoc Tamayo, Esteban Fierro, Santiago Avila
-- ====================================================================

-- Usuarios
INSERT INTO usuarios (id, nombre, email, password, rol, telefono) VALUES
(1, 'Dr. Santiago Avila Ramirez', 'santiago.avila@medimascotas.com', 'Password123!', 'veterinario', '3101234567'),
(2, 'Enoc Tamayo', 'enoc.tamayo@medimascotas.com', 'AdminPassword123!', 'admin', '3129876543'),
(3, 'Esteban Fierro', 'esteban.fierro@medimascotas.com', 'UserPass123!', 'propietario', '3157778899')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Propietarios
INSERT INTO propietarios (id, identificacion, nombre, telefono, direccion, email, activo) VALUES
(1, '1010203040', 'Esteban Fierro', '3157778899', 'Calle 45 # 12-34, Bogota', 'esteban.fierro@gmail.com', TRUE),
(2, '1098765432', 'Enoc Tamayo', '3164445566', 'Carrera 15 # 80-20, Bogota', 'enoc.tamayo@gmail.com', TRUE)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Mascotas
INSERT INTO mascotas (id, codigo_chip, nombre, especie, raza, edad, sexo, peso_kg, propietario_id, activo) VALUES
(1, 'CHIP-982101', 'Lucas', 'Canino', 'Golden Retriever', 3, 'Macho', 28.50, 1, TRUE),
(2, 'CHIP-451299', 'Mishi', 'Felino', 'Siames', 2, 'Hembra', 4.20, 2, TRUE)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Historiales Medicos
INSERT INTO historiales_medicos (id, mascota_id, antecedentes, alergias, observaciones_generales) VALUES
(1, 1, 'Sin cirugias previas. Desparasitacion al dia.', '["Polen"]', 'Paciente canino en condicion corporal optima.'),
(2, 2, 'Esterilizada.', '[]', 'Paciente felina sana y activa.')
ON DUPLICATE KEY UPDATE antecedentes=VALUES(antecedentes);

-- Consultas
INSERT INTO consultas (id, historial_id, mascota_id, veterinario_id, veterinario_nombre, fecha, hora, motivo, observaciones, estado) VALUES
(1, 1, 1, 1, 'Dr. Santiago Avila Ramirez', '2026-02-15', '10:30', 'Revision general y control de peso', 'El paciente se encuentra animado, pelaje brillante, mucosas normocoloreadas.', 'completada')
ON DUPLICATE KEY UPDATE motivo=VALUES(motivo);

-- Diagnosticos
INSERT INTO diagnosticos (id, consulta_id, descripcion, gravedad, fecha) VALUES
(1, 1, 'Paciente sano en optimas condiciones generales', 'leve', '2026-02-15')
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

-- Tratamientos
INSERT INTO tratamientos (id, diagnostico_id, descripcion, duracion, fecha_inicio, fecha_fin) VALUES
(1, 1, 'Mantener dieta balanceada y ejercicio moderado', 'Permanente', '2026-02-15', NULL)
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

-- Medicamentos
INSERT INTO medicamentos (id, consulta_id, nombre, dosis, frecuencia, duracion, indicaciones) VALUES
(1, 1, 'Suplemento de Omega 3', '1 capsula diaria', 'Cada 24 horas', '30 dias', 'Administrar junto con el alimento de la manana')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Vacunas
INSERT INTO vacunas (id, mascota_id, veterinario_id, tipo_vacuna, fecha_aplicacion, dosis, proxima_dosis, observaciones) VALUES
(1, 1, 1, 'Rabia', '2026-02-15', 'Refuerzo anual', '2027-02-15', 'Vacunacion sin reacciones adversas inmediatas.'),
(2, 1, 1, 'Multiple Canina (DHPP)', '2026-02-15', 'Refuerzo anual', '2027-02-15', 'Tolerancia adecuada.')
ON DUPLICATE KEY UPDATE tipo_vacuna=VALUES(tipo_vacuna);

-- Recordatorios
INSERT INTO recordatorios (id, mascota_id, tipo, titulo, descripcion, fecha_recordatorio, estado) VALUES
(1, 1, 'vacuna', 'Proxima dosis de Vacuna Rabia', 'Refuerzo anual obligatorio', '2027-02-15', 'pendiente'),
(2, 2, 'consulta', 'Chequeo semestral felino', 'Revision dental y renal preventiva', '2026-08-10', 'pendiente')
ON DUPLICATE KEY UPDATE titulo=VALUES(titulo);
