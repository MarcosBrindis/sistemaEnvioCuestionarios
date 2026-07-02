-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: gateway01.us-east-1.prod.aws.tidbcloud.com    Database: EXAUP
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v8.5.3-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `EXAUP`
--

CREATE DATABASE IF NOT EXISTS `EXAUP` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `EXAUP`;

--
-- Table structure for table `automatic_event`
--

DROP TABLE IF EXISTS `automatic_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `automatic_event` (
  `id_event` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `event_type` enum('birthday_dispatch','survey_dispatch') NOT NULL,
  `cron_expression` varchar(100) NOT NULL,
  `timezone` varchar(100) NOT NULL,
  `payload_json` json NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `next_run_at` datetime DEFAULT NULL,
  `last_run_at` datetime DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_event`) /*T![clustered_index] CLUSTERED */,
  KEY `idx_automatic_event_is_active_next_run` (`is_active`,`next_run_at`),
  KEY `idx_automatic_event_type` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `automatic_event_run`
--

DROP TABLE IF EXISTS `automatic_event_run`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `automatic_event_run` (
  `id_run` bigint NOT NULL AUTO_INCREMENT,
  `id_event` int NOT NULL,
  `scheduled_for` datetime NOT NULL,
  `started_at` datetime NOT NULL,
  `finished_at` datetime DEFAULT NULL,
  `status` enum('running','success','failed') NOT NULL,
  `attempts` int NOT NULL DEFAULT '1',
  `triggered_by` int DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `result_json` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_run`) /*T![clustered_index] CLUSTERED */,
  KEY `idx_automatic_event_run_event` (`id_event`),
  KEY `idx_automatic_event_run_scheduled` (`scheduled_for`),
  CONSTRAINT `fk_automatic_event_run_event` FOREIGN KEY (`id_event`) REFERENCES `automatic_event` (`id_event`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `baja_correo`
--

DROP TABLE IF EXISTS `baja_correo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baja_correo` (
  `id_baja` int NOT NULL AUTO_INCREMENT,
  `fecha_baja` datetime DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `id_egresado` int DEFAULT NULL,
  PRIMARY KEY (`id_baja`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_egresado`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cat_frecuencia`
--

DROP TABLE IF EXISTS `cat_frecuencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_frecuencia` (
  `id_frecuencia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_frecuencia`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cat_rol_usuario`
--

DROP TABLE IF EXISTS `cat_rol_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_rol_usuario` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_rol`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cat_sector_economico`
--

DROP TABLE IF EXISTS `cat_sector_economico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_sector_economico` (
  `id_sector` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_sector`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cat_tipo_evento`
--

DROP TABLE IF EXISTS `cat_tipo_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_tipo_evento` (
  `id_tipo_evento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_evento`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `datos_domiciliarios`
--

DROP TABLE IF EXISTS `datos_domiciliarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datos_domiciliarios` (
  `id_datos_domiciliarios` int NOT NULL AUTO_INCREMENT,
  `calle` varchar(200) NOT NULL,
  `colonia` varchar(150) NOT NULL,
  `numero_exterior` varchar(20) NOT NULL,
  `codigo_postal` varchar(10) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `foto_perfil` longtext DEFAULT NULL,
  `id_egresado` int NOT NULL,
  `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_datos_domiciliarios`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `id_egresado` (`id_egresado`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `datos_laborales`
--

DROP TABLE IF EXISTS `datos_laborales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datos_laborales` (
  `id_datos_laborales` int NOT NULL AUTO_INCREMENT,
  `trabaja_actualmente` tinyint(1) NOT NULL,
  `nombre_empresa` varchar(200) DEFAULT NULL,
  `puesto` varchar(150) DEFAULT NULL,
  `id_sector` int DEFAULT NULL,
  `actividad_principal` varchar(255) DEFAULT NULL,
  `id_egresado` int NOT NULL,
  `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_datos_laborales`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `id_egresado` (`id_egresado`),
  KEY `fk_2` (`id_sector`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`) ON DELETE CASCADE,
  CONSTRAINT `fk_2` FOREIGN KEY (`id_sector`) REFERENCES `cat_sector_economico` (`id_sector`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `egresado`
--

DROP TABLE IF EXISTS `egresado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `egresado` (
  `id_egresado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `primer_apellido` varchar(100) NOT NULL,
  `segundo_apellido` varchar(100) DEFAULT NULL,
  `matricula` varchar(50) DEFAULT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `imagen_egresado` longtext DEFAULT NULL,
  `sinopsis` text DEFAULT NULL COMMENT 'Sinopsis profesional general del egresado',
  `fecha_nacimiento` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `id_estado` int NOT NULL,
  `id_programa_educativo` int DEFAULT NULL,
  `id_periodo` int DEFAULT NULL,
  PRIMARY KEY (`id_egresado`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_programa_educativo`),
  KEY `fk_2` (`id_periodo`),
  KEY `fk_egresado_estado` (`id_estado`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_programa_educativo`) REFERENCES `programa_educativo` (`id_programa_educativo`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_periodo`) REFERENCES `periodo_graduado` (`id_periodo`),
  CONSTRAINT `fk_egresado_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado_egresado` (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=210001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `egresado_logro_academico`
--

DROP TABLE IF EXISTS `egresado_logro_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `egresado_logro_academico` (
  `id_egresado` int NOT NULL,
  `id_logro_academico` int NOT NULL,
  PRIMARY KEY (`id_egresado`,`id_logro_academico`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_2` (`id_logro_academico`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_logro_academico`) REFERENCES `logro_academico` (`id_logro_academico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `egresado_logro_laboral`
--

DROP TABLE IF EXISTS `egresado_logro_laboral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `egresado_logro_laboral` (
  `id_egresado` int NOT NULL,
  `id_logro_laboral` int NOT NULL,
  PRIMARY KEY (`id_egresado`,`id_logro_laboral`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_2` (`id_logro_laboral`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_logro_laboral`) REFERENCES `logro_laboral` (`id_logro_laboral`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `encuesta`
--

DROP TABLE IF EXISTS `encuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encuesta` (
  `id_encuesta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `id_formulario` int DEFAULT NULL,
  `id_template` int DEFAULT NULL,
  PRIMARY KEY (`id_encuesta`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_formulario`),
  KEY `fk_2` (`id_template`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_formulario`) REFERENCES `formulario` (`id_formulario`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_template`) REFERENCES `template_correo` (`id_template`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=300001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `encuesta_egresados`
--

DROP TABLE IF EXISTS `encuesta_egresados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encuesta_egresados` (
  `id_encuesta_egresados` char(36) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `id_encuesta` int DEFAULT NULL,
  `id_egresado` int DEFAULT NULL,
  PRIMARY KEY (`id_encuesta_egresados`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_encuesta`),
  KEY `fk_2` (`id_egresado`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_encuesta`) REFERENCES `encuesta` (`id_encuesta`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `estado_egresado`
--

DROP TABLE IF EXISTS `estado_egresado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_egresado` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estado`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `estado_notificacion`
--

DROP TABLE IF EXISTS `estado_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_notificacion` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_estado`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `formulacion_pregunta`
--

DROP TABLE IF EXISTS `formulacion_pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formulacion_pregunta` (
  `id_formulario` int NOT NULL,
  `id_pregunta` int NOT NULL,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`id_formulario`,`id_pregunta`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_2` (`id_pregunta`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_formulario`) REFERENCES `formulario` (`id_formulario`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id_pregunta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `formulario`
--

DROP TABLE IF EXISTS `formulario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formulario` (
  `id_formulario` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_formulario`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grupo_egresado`
--

DROP TABLE IF EXISTS `grupo_egresado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo_egresado` (
  `id_grupo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_grupo`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=390001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grupo_miembro`
--

DROP TABLE IF EXISTS `grupo_miembro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo_miembro` (
  `id_grupo` int NOT NULL,
  `id_egresado` int NOT NULL,
  PRIMARY KEY (`id_grupo`,`id_egresado`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_2` (`id_egresado`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo_egresado` (`id_grupo`) ON DELETE CASCADE,
  CONSTRAINT `fk_2` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `historial_notificacion`
--

DROP TABLE IF EXISTS `historial_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_notificacion` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `fecha_envio` datetime DEFAULT NULL,
  `id_egresado` int DEFAULT NULL,
  `id_notificacion` int DEFAULT NULL,
  `id_estado` int DEFAULT NULL,
  PRIMARY KEY (`id_historial`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_egresado`),
  KEY `fk_2` (`id_notificacion`),
  KEY `fk_3` (`id_estado`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_notificacion`) REFERENCES `notificacion_programada` (`id_notificacion`),
  CONSTRAINT `fk_3` FOREIGN KEY (`id_estado`) REFERENCES `estado_notificacion` (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logro_academico`
--

DROP TABLE IF EXISTS `logro_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logro_academico` (
  `id_logro_academico` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) DEFAULT NULL,
  `institucion` varchar(150) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id_logro_academico`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logro_laboral`
--

DROP TABLE IF EXISTS `logro_laboral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logro_laboral` (
  `id_logro_laboral` int NOT NULL AUTO_INCREMENT,
  `empresa` varchar(150) DEFAULT NULL,
  `puesto` varchar(100) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id_logro_laboral`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=150001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificacion_programada`
--

DROP TABLE IF EXISTS `notificacion_programada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion_programada` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `ultimo_envio` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `id_template` int DEFAULT NULL,
  `id_encuesta` int DEFAULT NULL,
  `id_tipo_evento` int DEFAULT NULL,
  `id_frecuencia` int DEFAULT NULL,
  PRIMARY KEY (`id_notificacion`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_template`),
  KEY `fk_2` (`id_encuesta`),
  KEY `fk_3` (`id_tipo_evento`),
  KEY `fk_4` (`id_frecuencia`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_template`) REFERENCES `template_correo` (`id_template`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_encuesta`) REFERENCES `encuesta` (`id_encuesta`),
  CONSTRAINT `fk_3` FOREIGN KEY (`id_tipo_evento`) REFERENCES `cat_tipo_evento` (`id_tipo_evento`),
  CONSTRAINT `fk_4` FOREIGN KEY (`id_frecuencia`) REFERENCES `cat_frecuencia` (`id_frecuencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `opcion_pregunta`
--

DROP TABLE IF EXISTS `opcion_pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opcion_pregunta` (
  `id_opcion_pregunta` int NOT NULL AUTO_INCREMENT,
  `texto_opcion` varchar(255) DEFAULT NULL,
  `etiqueta` varchar(100) DEFAULT NULL,
  `id_pregunta` int DEFAULT NULL,
  PRIMARY KEY (`id_opcion_pregunta`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_opcion_pregunta_pregunta` (`id_pregunta`),
  CONSTRAINT `fk_opcion_pregunta_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=360001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `periodo_graduado`
--

DROP TABLE IF EXISTS `periodo_graduado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodo_graduado` (
  `id_periodo` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `cohorte` varchar(20) DEFAULT NULL,
  `periodo_id_externo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_periodo`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pregunta`
--

DROP TABLE IF EXISTS `pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pregunta` (
  `id_pregunta` int NOT NULL AUTO_INCREMENT,
  `texto_pregunta` varchar(255) NOT NULL,
  `es_obligatoria` tinyint(1) DEFAULT '0',
  `id_tipo_pregunta` int DEFAULT NULL,
  PRIMARY KEY (`id_pregunta`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_tipo_pregunta`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_tipo_pregunta`) REFERENCES `tipo_pregunta` (`id_tipo_pregunta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=480001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pregunta_grafica`
--

DROP TABLE IF EXISTS `pregunta_grafica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pregunta_grafica` (
  `id_pregunta_grafica` int NOT NULL AUTO_INCREMENT,
  `is_default` tinyint(1) DEFAULT '0',
  `id_tipo_pregunta` int DEFAULT NULL,
  `id_tipo_grafica` int DEFAULT NULL,
  PRIMARY KEY (`id_pregunta_grafica`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_tipo_pregunta`),
  KEY `fk_2` (`id_tipo_grafica`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_tipo_pregunta`) REFERENCES `tipo_pregunta` (`id_tipo_pregunta`),
  CONSTRAINT `fk_2` FOREIGN KEY (`id_tipo_grafica`) REFERENCES `tipo_grafica` (`id_tipo_grafica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `programa_educativo`
--

DROP TABLE IF EXISTS `programa_educativo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programa_educativo` (
  `id_programa_educativo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  PRIMARY KEY (`id_programa_educativo`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `respuesta`
--

DROP TABLE IF EXISTS `respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respuesta` (
  `id_respuesta` int NOT NULL AUTO_INCREMENT,
  `id_egresado` int NOT NULL,
  `id_formulario` int NOT NULL,
  `fecha_respuesta` timestamp DEFAULT CURRENT_TIMESTAMP,
  `respuestas_json` json NOT NULL,
  PRIMARY KEY (`id_respuesta`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_egresado`),
  KEY `fk_respuesta_formulario` (`id_formulario`),
  UNIQUE KEY `uk_egresado_formulario` (`id_egresado`,`id_formulario`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_egresado`) REFERENCES `egresado` (`id_egresado`),
  CONSTRAINT `fk_respuesta_formulario` FOREIGN KEY (`id_formulario`) REFERENCES `formulario` (`id_formulario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=90001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sys_api_client`
--

DROP TABLE IF EXISTS `sys_api_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_api_client` (
  `id_client` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  `api_key_hash` varchar(255) NOT NULL,
  `prefix` varchar(10) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_client`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `uk_client_name` (`client_name`),
  KEY `idx_prefix` (`prefix`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=90001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sys_email_account`
--

DROP TABLE IF EXISTS `sys_email_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_email_account` (
  `id_account` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `host` varchar(100) DEFAULT 'smtp.gmail.com',
  `port` int DEFAULT '587',
  `password_encrypted` varchar(255) NOT NULL,
  `daily_limit` int DEFAULT '500',
  `current_usage` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_account`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `template_correo`
--

DROP TABLE IF EXISTS `template_correo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_correo` (
  `id_template` int NOT NULL AUTO_INCREMENT,
  `asunto` varchar(255) DEFAULT NULL,
  `cuerpo` text DEFAULT NULL,
  `layout_html` text DEFAULT NULL,
  `id_tipo_correo` int DEFAULT NULL,
  PRIMARY KEY (`id_template`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_tipo_correo`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_tipo_correo`) REFERENCES `tipo_correo` (`id_tipo_correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=300001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo_correo`
--

DROP TABLE IF EXISTS `tipo_correo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_correo` (
  `id_tipo_correo` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_correo`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=180001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo_grafica`
--

DROP TABLE IF EXISTS `tipo_grafica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_grafica` (
  `id_tipo_grafica` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_grafica`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo_pregunta`
--

DROP TABLE IF EXISTS `tipo_pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_pregunta` (
  `id_tipo_pregunta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_pregunta`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=90001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario_interno`
--

DROP TABLE IF EXISTS `usuario_interno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_interno` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuario_interno_rol` (`id_rol`),
  CONSTRAINT `fk_usuario_interno_rol` FOREIGN KEY (`id_rol`) REFERENCES `cat_rol_usuario` (`id_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario_programa_educativo`
--

DROP TABLE IF EXISTS `usuario_programa_educativo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_programa_educativo` (
  `id_usuario` int NOT NULL,
  `id_programa_educativo` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_programa_educativo`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_usuario_programa_programa` (`id_programa_educativo`),
  CONSTRAINT `fk_usuario_programa_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario_interno` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_programa_programa` FOREIGN KEY (`id_programa_educativo`) REFERENCES `programa_educativo` (`id_programa_educativo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-02  8:18:56
