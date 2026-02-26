-- Migración RBAC para usuarios internos (EXAUP)
-- Fecha: 2026-02-22

USE EXAUP;

CREATE TABLE IF NOT EXISTS cat_rol_usuario (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
);

INSERT INTO cat_rol_usuario (nombre, descripcion)
VALUES
  ('super_admin', 'Acceso total al sistema'),
  ('director_vinculacion', 'Acceso total a la gestión operativa'),
  ('director_programa_educativo', 'Consulta y aprobación/rechazo acotado por programa educativo')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

CREATE TABLE IF NOT EXISTS usuario_interno (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  id_rol INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_interno_rol FOREIGN KEY (id_rol) REFERENCES cat_rol_usuario(id_rol)
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS usuario_programa_educativo (
  id_usuario INT NOT NULL,
  id_programa_educativo INT NOT NULL,
  PRIMARY KEY (id_usuario, id_programa_educativo),
  CONSTRAINT fk_usuario_programa_usuario FOREIGN KEY (id_usuario) REFERENCES usuario_interno(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_programa_programa FOREIGN KEY (id_programa_educativo) REFERENCES programa_educativo(id_programa_educativo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Usuario semilla opcional (super admin).
-- Password temporal en texto plano: 125645
-- IMPORTANTE: cambiar contraseña después del primer acceso.
INSERT INTO usuario_interno (nombre, email, password_hash, id_rol, is_active)
SELECT
  'super admin',
  '233317@ids.upchiapas.edu.mx',
  '$2b$10$wDyCGeeUNgmYQJPwg.DBCOlL.XR6TsFTA.FN1U5tJmnrt6xnzkA9K',
  r.id_rol,
  TRUE
FROM cat_rol_usuario r
WHERE r.nombre = 'super_admin'
  AND NOT EXISTS (
    SELECT 1 FROM usuario_interno u WHERE u.email = '233317@ids.upchiapas.edu.mx'
  );
