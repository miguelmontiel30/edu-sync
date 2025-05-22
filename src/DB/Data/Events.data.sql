-- 1) Insertar todos los eventos del calendario oficial para school_id=1, school_year_id=4
--    y con status_id=21 (Programado), created_by=1

-- 1.1 Receso de clases (verano)
INSERT INTO events (
  school_id, event_type_id, school_year_id,
  title, description,
  start_time, end_time, all_day,
  status_id, created_by
) VALUES (
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Receso de Clases' AND school_id = 1),
  4,
  'Receso de Verano 2024',
  'Período vacacional de verano antes del ciclo 2024-2025',
  '2024-08-01 00:00:00'::timestamptz,
  '2024-08-18 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.2 Consejo Técnico Escolar (fase intensiva)
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Fase Intensiva)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Fase Intensiva',
  'Capacitación intensiva de personal docente y directivo',
  '2024-08-19 00:00:00'::timestamptz,
  '2024-08-23 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.3 Inicio de Clases
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Inicio de Clases' AND school_id = 1),
  4,
  'Inicio de Clases Ciclo 2024-2025',
  'Primer día de clases de todos los niveles',
  '2024-08-26 00:00:00'::timestamptz,
  '2024-08-26 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.4 Consejos Técnicos Ordinarios
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
-- Septiembre
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2024-09-27 00:00:00'::timestamptz,
  '2024-09-27 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Octubre
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2024-10-25 00:00:00'::timestamptz,
  '2024-10-25 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Noviembre
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2024-11-29 00:00:00'::timestamptz,
  '2024-11-29 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Febrero
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2025-02-28 00:00:00'::timestamptz,
  '2025-02-28 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Marzo
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2025-03-28 00:00:00'::timestamptz,
  '2025-03-28 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Enero
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2025-01-31 00:00:00'::timestamptz,
  '2025-01-31 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Mayo
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2025-05-30 00:00:00'::timestamptz,
  '2025-05-30 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Junio
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Consejo Técnico (Sesión Ordinaria)' AND school_id = 1),
  4,
  'Consejo Técnico Escolar – Sesión Ordinaria',
  'Sesión ordinaria de Consejo Técnico Escolar',
  '2025-06-27 00:00:00'::timestamptz,
  '2025-06-27 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.5 Suspensiones de labores docentes (feriados y trasladados)
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
-- 18 Nov 2024 (Día de la Revolución, trasladado)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 18 Nov 2024',
  'Día de la Revolución (feriado, recorrido a lunes)',
  '2024-11-18 00:00:00'::timestamptz,
  '2024-11-18 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- 01 Ene 2025 (Año Nuevo)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 01 Ene 2025',
  'Año Nuevo',
  '2025-01-01 00:00:00'::timestamptz,
  '2025-01-01 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- 03 Feb 2025 (Día de la Constitución, recorrido)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 03 Feb 2025',
  'Día de la Constitución (feriado recorrido)',
  '2025-02-03 00:00:00'::timestamptz,
  '2025-02-03 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- 17 Mar 2025 (Natalicio de Benito Juárez, recorrido)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 17 Mar 2025',
  'Natalicio de Benito Juárez (feriado recorrido)',
  '2025-03-17 00:00:00'::timestamptz,
  '2025-03-17 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- 01 May 2025 (Día del Trabajo)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 01 May 2025',
  'Día del Trabajo',
  '2025-05-01 00:00:00'::timestamptz,
  '2025-05-01 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- 05 May 2025 (Batalla de Puebla)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 05 May 2025',
  'Batalla de Puebla',
  '2025-05-05 00:00:00'::timestamptz,
  '2025-05-05 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- 15 May 2025 (Día del Maestro)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 15 May 2025',
  'Día del Maestro',
  '2025-05-15 00:00:00'::timestamptz,
  '2025-05-15 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- 16 Jul 2025 (Suspensión extraordinaria)
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Suspensión de Labores Docentes' AND school_id = 1),
  4,
  'Suspensión de Labores – 16 Jul 2025',
  'Suspensión extraordinaria',
  '2025-07-16 00:00:00'::timestamptz,
  '2025-07-16 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.6 Entrega de boletas
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
-- Noviembre
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Entrega de Boletas' AND school_id = 1),
  4,
  'Entrega de Boletas – Noviembre 2024',
  'Entrega de boletas a madres, padres o tutores',
  '2024-11-25 00:00:00'::timestamptz,
  '2024-11-28 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Marzo
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Entrega de Boletas' AND school_id = 1),
  4,
  'Entrega de Boletas – Marzo 2025 (1a. ronda)',
  'Entrega de boletas a madres, padres o tutores',
  '2025-03-25 00:00:00'::timestamptz,
  '2025-03-27 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Entrega de Boletas' AND school_id = 1),
  4,
  'Entrega de Boletas – Marzo 2025 (2a. ronda)',
  'Entrega de boletas a madres, padres o tutores',
  '2025-03-31 00:00:00'::timestamptz,
  '2025-03-31 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.7 Registro de calificaciones
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
-- Noviembre
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Registro de Calificaciones' AND school_id = 1),
  4,
  'Registro de Calificaciones – Noviembre 2024',
  'Cierre de captura de calificaciones',
  '2024-11-22 00:00:00'::timestamptz,
  '2024-11-22 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Marzo
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Registro de Calificaciones' AND school_id = 1),
  4,
  'Registro de Calificaciones – Marzo 2025',
  'Cierre de captura de calificaciones',
  '2025-03-21 00:00:00'::timestamptz,
  '2025-03-21 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.8 Talleres intensivos
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
-- Enero: Dirección
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Taller Dir. (Intensivo)' AND school_id = 1),
  4,
  'Taller Intensivo – Personal con Funciones de Dirección',
  'Capacitación intensiva para directivos',
  '2025-01-06 00:00:00'::timestamptz,
  '2025-01-06 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Enero: Docente
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Taller Docente (Intensivo)' AND school_id = 1),
  4,
  'Taller Intensivo – Personal Docente',
  'Capacitación intensiva para docentes',
  '2025-01-07 00:00:00'::timestamptz,
  '2025-01-08 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Julio: Dirección
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Taller Dir. (Intensivo)' AND school_id = 1),
  4,
  'Taller Intensivo – Personal con Funciones de Dirección',
  'Capacitación intensiva para directivos',
  '2025-07-17 00:00:00'::timestamptz,
  '2025-07-17 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Julio: Docente
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Taller Docente (Intensivo)' AND school_id = 1),
  4,
  'Taller Intensivo – Personal Docente',
  'Capacitación intensiva para docentes',
  '2025-07-18 00:00:00'::timestamptz,
  '2025-07-18 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.9 Vacaciones institucionales
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
-- Invierno:
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Vacaciones' AND school_id = 1),
  4,
  'Vacaciones de Invierno 2024-2025',
  'Receso de fin de año',
  '2024-12-23 00:00:00'::timestamptz,
  '2025-01-03 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Primavera (Semana Santa):
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Vacaciones' AND school_id = 1),
  4,
  'Vacaciones de Semana Santa 2025',
  'Receso de Semana Santa',
  '2025-04-14 00:00:00'::timestamptz,
  '2025-04-25 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
-- Verano 2025:
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Receso de Clases' AND school_id = 1),
  4,
  'Receso de Verano 2025',
  'Período vacacional de verano',
  '2025-07-20 00:00:00'::timestamptz,
  '2025-07-31 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.10 Preinscripción
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Preinscripción' AND school_id = 1),
  4,
  'Preinscripción Ciclo 2025-2026',
  'Inscripción para nivel preescolar, primer grado de primaria y primer grado de secundaria',
  '2025-02-10 00:00:00'::timestamptz,
  '2025-02-14 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.11 Commemorativos (días de reflexión)
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Día Conmemorativo' AND school_id = 1),
  4,
  'Día Conmemorativo – 16 Sep 2024',
  'Grito de Independencia',
  '2024-09-16 00:00:00'::timestamptz,
  '2024-09-16 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Día Conmemorativo' AND school_id = 1),
  4,
  'Día Conmemorativo – 20 Nov 2024',
  'Día de la Revolución',
  '2024-11-20 00:00:00'::timestamptz,
  '2024-11-20 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Día Conmemorativo' AND school_id = 1),
  4,
  'Día Conmemorativo – 30 Abr 2025',
  'Día del Niño',
  '2025-04-30 00:00:00'::timestamptz,
  '2025-04-30 23:59:59'::timestamptz,
  TRUE,
  21,
  1
),
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Día Conmemorativo' AND school_id = 1),
  4,
  'Día Conmemorativo – 30 May 2025',
  'Día del Trabajador Social',
  '2025-05-30 00:00:00'::timestamptz,
  '2025-05-30 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

-- 1.12 Fin de Clases del Ciclo
INSERT INTO events (school_id, event_type_id, school_year_id, title, description, start_time, end_time, all_day, status_id, created_by) VALUES
(
  1,
  (SELECT event_type_id FROM event_types WHERE name = 'Fin de Clases' AND school_id = 1),
  4,
  'Fin de Clases Ciclo 2024-2025',
  'Último día de actividades académicas',
  '2025-07-11 00:00:00'::timestamptz,
  '2025-07-11 23:59:59'::timestamptz,
  TRUE,
  21,
  1
);

--------------------------------------------------------------------------------
-- 2) Asignar cada evento a todos los roles (admin=1, teacher=2, student=3, tutor=4)
--------------------------------------------------------------------------------

INSERT INTO event_recipients (event_id, role_id)
SELECT
  e.event_id,
  r.role_id
FROM
  events e
CROSS JOIN
  roles r
WHERE
  e.school_id = 1
  AND e.school_year_id = 4
  AND r.role_id IN (1,2,3,4)
  AND e.delete_flag = FALSE;
