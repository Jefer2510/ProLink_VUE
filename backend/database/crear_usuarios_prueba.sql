-- Script para crear usuarios de prueba y conexiones
USE prolink_db;
-- Ejecutar en phpMyAdmin después de registrar tu primer usuario

-- Primero verifica tu ID de usuario actual
SELECT * FROM users;

-- Asumiendo que tu usuario tiene ID = 1, vamos a crear usuarios de prueba
-- IMPORTANTE: Cambia el hash de password si quieres (este es para password: "123456")

-- Usuario de prueba 1
INSERT INTO users (email, password, nombre, apellido, headline, points, level) 
VALUES (
  'ana.garcia@test.com',
  '$2b$10$YourHashHere', -- Necesitas registrarte normalmente para obtener el hash
  'Ana',
  'García',
  'Desarrolladora Frontend Senior',
  50,
  2
);

-- Usuario de prueba 2
INSERT INTO users (email, password, nombre, apellido, headline, points, level)
VALUES (
  'carlos.lopez@test.com',
  '$2b$10$YourHashHere', -- Necesitas registrarte normalmente para obtener el hash
  'Carlos',
  'López',
  'Backend Developer',
  75,
  3
);

-- Usuario de prueba 3
INSERT INTO users (email, password, nombre, apellido, headline, points, level)
VALUES (
  'maria.rodriguez@test.com',
  '$2b$10$YourHashHere', -- Necesitas registrarte normalmente para obtener el hash
  'María',
  'Rodríguez',
  'Full Stack Developer',
  100,
  4
);

-- Crear conexiones (asumiendo que tu ID es 1)
-- Cambia el user_id = 1 por tu ID real

-- Conexión con Ana (ID 2)
INSERT INTO connections (user_id, connected_user_id, status)
VALUES (1, 2, 'accepted');

-- Conexión con Carlos (ID 3)
INSERT INTO connections (user_id, connected_user_id, status)
VALUES (1, 3, 'accepted');

-- Conexión con María (ID 4)
INSERT INTO connections (user_id, connected_user_id, status)
VALUES (1, 4, 'accepted');

-- Verificar las conexiones
SELECT * FROM connections WHERE user_id = 1 OR connected_user_id = 1;
