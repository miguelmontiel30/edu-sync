/************ Generar datos para las tablas ************/
-- =============================================
-- Datos iniciales para la tabla genders
-- =============================================
INSERT INTO
    genders (code, name, delete_flag, created_at, updated_at)
VALUES
    ('M', 'Masculino', FALSE, NOW (), NOW ()),
    ('F', 'Femenino', FALSE, NOW (), NOW ()),
    ('O', 'Otro', FALSE, NOW (), NOW ()),
    ('ND', 'No definido', FALSE, NOW (), NOW ()) ON CONFLICT (code) DO NOTHING;

-- Insertar datos iniciales en la tabla status
INSERT INTO
    status (code, name, category)
VALUES
    -- Estados para ciclos escolares
    ('SCHOOL_YEAR_ACTIVE', 'Activo', 'school_year'),
    ('SCHOOL_YEAR_INACTIVE', 'Inactivo', 'school_year'),
    (
        'SCHOOL_YEAR_COMPLETED',
        'Completado',
        'school_year'
    ),
    -- Estados para grupos
    ('GROUP_ACTIVE', 'Activo', 'group'),
    ('GROUP_INACTIVE', 'Inactivo', 'group'),
    ('GROUP_COMPLETED', 'Completado', 'group'),
    -- Estados para estudiantes
    ('STUDENT_ACTIVE', 'Activo', 'student'),
    ('STUDENT_INACTIVE', 'Inactivo', 'student'),
    ('STUDENT_GRADUATED', 'Graduado', 'student'),
    ('STUDENT_TRANSFERRED', 'Transferido', 'student'),
    -- Estados para estudiantes en grupos
    ('STUDENT_GROUP_ACTIVE', 'Activo', 'student_group'),
    (
        'STUDENT_GROUP_INACTIVE',
        'Inactivo',
        'student_group'
    ),
    (
        'STUDENT_GROUP_GRADUATED',
        'Graduado',
        'student_group'
    ),
    (
        'STUDENT_GROUP_TRANSFERRED',
        'Transferido',
        'student_group'
    ),
    -- Estados para periodos de evaluación
    (
        'EVALUATION_PERIOD_ACTIVE',
        'Activo',
        'evaluation_period'
    ),
    (
        'EVALUATION_PERIOD_INACTIVE',
        'Inactivo',
        'evaluation_period'
    ),
    (
        'EVALUATION_PERIOD_COMPLETED',
        'Completado',
        'evaluation_period'
    ),
    -- Estados para materias
    ('SUBJECT_ACTIVE', 'Activo', 'subject'),
    ('SUBJECT_INACTIVE', 'Inactivo', 'subject'),
    ('SUBJECT_COMPLETED', 'Completado', 'subject'),
    -- Estados para eventos
    ('EVENT_ACTIVE', 'Activo', 'event'),
    ('EVENT_INACTIVE', 'Inactivo', 'event'),
    ('EVENT_CANCELED', 'Cancelado', 'event'),
    ('EVENT_COMPLETED', 'Completado', 'event');

-- Generar datos para los roles y permisos
INSERT INTO
    roles (name, description)
VALUES
    ('admin', 'Administrador del sistema'),
    ('teacher', 'Profesor'),
    ('student', 'Estudiante'),
    ('tutor', 'Tutor');

-- Generar datos para los permisos
INSERT INTO
    permissions (name, description)
VALUES
    ('create_student', 'Crear estudiante'),
    ('edit_student', 'Editar estudiante'),
    ('delete_student', 'Eliminar estudiante'),
    ('view_student', 'Ver estudiante');

-- Generar datos para los roles y permisos
INSERT INTO
    role_permissions (role_id, permission_id)
VALUES
    (1, 1), -- Admin puede crear estudiante
    (1, 2), -- Admin puede editar estudiante
    (1, 3), -- Admin puede eliminar estudiante
    (1, 4);

-- Generar datos para los tipos de eventos
INSERT INTO
    event_types (school_id, name, color, icon, delete_flag)
VALUES
    -- Tipos del calendario oficial
    (1, 'Inicio de Clases', '#000000', 'school', FALSE),
    (1, 'Fin de Clases', '#000000', 'school', FALSE),
    (
        1,
        'Suspensión Labores Docentes',
        '#000000',
        'no_work',
        FALSE
    ),
    (1, 'Receso de Clases', '#2E7D32', 'beach', FALSE),
    (1, 'Vacaciones', '#9E9E9E', 'vacation', FALSE),
    (
        1,
        'Consejo Técnico (Intensiva)',
        '#8D1C16',
        'council',
        FALSE
    ),
    (
        1,
        'Consejo Técnico (Ordinaria)',
        '#EC407A',
        'council',
        FALSE
    ),
    (
        1,
        'Sesión Comité Salud/Limpieza',
        '#FFA000',
        'health',
        FALSE
    ),
    (
        1,
        'Jornadas de Limpieza',
        '#FFA000',
        'cleaning',
        FALSE
    ),
    (1, 'Entrega Boletas', '#000000', 'report', FALSE),
    (
        1,
        'Taller Dir. (Intensivo)',
        '#FFD600',
        'workshop',
        FALSE
    ),
    (
        1,
        'Taller Docente (Intensivo)',
        '#D7CCC8',
        'workshop',
        FALSE
    ),
    (
        1,
        'Preinscripción',
        '#D32F2F',
        'registration',
        FALSE
    ),
    (
        1,
        'Registro de Calificaciones',
        '#42A5F5',
        'grades',
        FALSE
    ),
    (1, 'Día Conmemorativo', '#000000', 'flag', FALSE),
    -- Tus tipos genéricos existentes
    (1, 'Examen', '#000000', 'exam', FALSE),
    (1, 'Reunión', '#000000', 'meeting', FALSE),
    (1, 'Curso', '#000000', 'course', FALSE),
    (1, 'Proyecto', '#000000', 'project', FALSE),
    (1, 'Tarea', '#000000', 'task', FALSE),
    (1, 'Otro', '#000000', 'other', FALSE);

-- =============================================
-- Configuración de tema para la escuela por defecto
-- =============================================
-- Insertar configuración de tema para la escuela con ID 1
INSERT INTO
    school_settings (
        school_id,
        key,
        value,
        description,
        is_system,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        'theme.settings',
        json_build_object (
            'primary_color',
            '#465FFF',
            'custom_color',
            '',
            'use_custom_color',
            false,
            'palette',
            json_build_object (
                '25',
                '#F2F7FF',
                '50',
                '#ECF3FF',
                '100',
                '#DDE9FF',
                '200',
                '#C2D6FF',
                '300',
                '#9CB9FF',
                '400',
                '#7592FF',
                '500',
                '#465FFF',
                '600',
                '#3641F5',
                '700',
                '#2A31D8',
                '800',
                '#252DAE',
                '900',
                '#262E89',
                '950',
                '#161950'
            )
        ),
        'Configuración del tema principal del sistema',
        TRUE,
        NOW (),
        NOW ()
    ) ON CONFLICT (school_id, key) DO
UPDATE
SET
    value = EXCLUDED.value,
    updated_at = NOW ();

-- Insertar configuraciones adicionales para los colores predefinidos
INSERT INTO
    school_settings (
        school_id,
        key,
        value,
        description,
        is_system,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        'theme.predefined_colors',
        json_build_array (
            json_build_object ('name', 'Azul (Default)', 'value', '#465FFF'),
            json_build_object ('name', 'Verde', 'value', '#10B981'),
            json_build_object ('name', 'Rojo', 'value', '#EF4444'),
            json_build_object ('name', 'Morado', 'value', '#8B5CF6'),
            json_build_object ('name', 'Naranja', 'value', '#F97316'),
            json_build_object ('name', 'Rosa', 'value', '#EC4899'),
            json_build_object ('name', 'Amarillo', 'value', '#F59E0B'),
            json_build_object ('name', 'Celeste', 'value', '#0EA5E9'),
            json_build_object ('name', 'Esmeralda', 'value', '#059669')
        ),
        'Colores predefinidos disponibles para personalización del tema',
        TRUE,
        NOW (),
        NOW ()
    ) ON CONFLICT (school_id, key) DO
UPDATE
SET
    value = EXCLUDED.value,
    updated_at = NOW ();