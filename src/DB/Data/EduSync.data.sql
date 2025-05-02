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
    );

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

-- Asignar rol de administrador al usuario de prueba
INSERT INTO
    user_roles (user_id, role_id)
SELECT
    user_id,
    role_id
FROM
    users,
    roles
WHERE
    email = 'test@email.com'
    AND name = 'admin';

INSERT INTO
    schools (
        name,
        code,
        address,
        phone,
        email,
        website,
        logo_url,
        delete_flag
    )
VALUES
    (
        'Escuela 1',
        'ESC123',
        'Calle Principal 123',
        '1234567890',
        'escuela1@example.com',
        'https://www.escuela1.com',
        'logo1.png',
        FALSE
    ),
    (
        'Escuela 2',
        'ESC456',
        'Avenida Central 456',
        '5551112222',
        'escuela2@example.com',
        'https://www.escuela2.com',
        'logo2.png',
        FALSE
    ),
    (
        'Escuela 3',
        'ESC789',
        'Boulevard Independencia 789',
        '5553334444',
        'escuela3@example.com',
        'https://www.escuela3.com',
        'logo3.png',
        FALSE
    );

-- Insertar grupos
INSERT INTO
    "groups" (
        "group_id",
        "school_id",
        "grade",
        "group_name",
        "school_year_id",
        "students_number",
        "subjects_number",
        "status",
        "general_average",
        "description",
        "group_image",
        "delete_flag",
        "created_at",
        "updated_at",
        "deleted_at"
    )
VALUES
    (
        '1',
        '1',
        '1',
        'A',
        '4',
        '0',
        '0',
        'active',
        null,
        null,
        null,
        'false',
        '2025-03-27 09:30:04.493446+00',
        '2025-03-27 09:30:04.493446+00',
        null
    ),
    (
        '2',
        '1',
        '2',
        'A',
        '4',
        '0',
        '0',
        'active',
        null,
        null,
        null,
        'false',
        '2025-03-27 09:39:07.687581+00',
        '2025-03-27 09:42:34.92+00',
        null
    ),
    (
        '3',
        '1',
        '1',
        'A',
        '2',
        '0',
        '0',
        'completed',
        null,
        null,
        null,
        'false',
        '2025-03-27 09:39:35.775707+00',
        '2025-03-27 09:41:26.6+00',
        null
    ),
    (
        '4',
        '1',
        '3',
        'A',
        '4',
        '0',
        '0',
        'active',
        null,
        null,
        null,
        'false',
        '2025-03-27 09:40:23.170817+00',
        '2025-03-27 09:40:23.170817+00',
        null
    ),
    (
        '5',
        '1',
        '1',
        'C',
        '4',
        '0',
        '0',
        'inactive',
        null,
        null,
        null,
        'true',
        '2025-03-27 09:41:06.152597+00',
        '2025-03-27 09:41:06.152597+00',
        '2025-03-27 09:41:09.799+00'
    ),
    (
        '6',
        '1',
        '4',
        'A',
        '4',
        '0',
        '0',
        'active',
        null,
        null,
        null,
        'false',
        '2025-03-27 09:50:38.574834+00',
        '2025-03-27 09:50:38.574834+00',
        null
    );

-- Insertar estudiantes en los grupos
INSERT INTO
    "student_groups" (
        "student_group_id",
        "student_id",
        "group_id",
        "enrollment_date",
        "status",
        "delete_flag",
        "created_at",
        "updated_at",
        "deleted_at"
    )
VALUES
    (
        '1',
        '1',
        '1',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 21:37:00.290896+00',
        '2025-03-27 21:37:00.290896+00',
        '2025-03-28 00:45:17.179+00'
    ),
    (
        '2',
        '3',
        '1',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 21:37:00.290896+00',
        '2025-03-27 21:37:00.290896+00',
        '2025-03-28 00:35:43.681+00'
    ),
    (
        '3',
        '4',
        '1',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 21:37:00.290896+00',
        '2025-03-27 21:37:00.290896+00',
        null
    ),
    (
        '5',
        '3',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 22:48:55.767934+00',
        '2025-03-27 22:48:55.767934+00',
        '2025-03-27 23:45:17.957+00'
    ),
    (
        '6',
        '8',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-28 00:32:55.966+00'
    ),
    (
        '7',
        '6',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-28 00:32:31.711+00'
    ),
    (
        '8',
        '7',
        '2',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-27 22:55:36.480376+00',
        null
    ),
    (
        '9',
        '21',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-28 00:32:55.966+00'
    ),
    (
        '10',
        '22',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-28 00:32:55.966+00'
    ),
    (
        '11',
        '1',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-28 00:45:17.179+00'
    ),
    (
        '12',
        '20',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-27 22:55:36.480376+00',
        '2025-03-28 00:33:34.635+00'
    ),
    (
        '13',
        '5',
        '1',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 23:52:16.326515+00',
        '2025-03-27 23:52:16.326515+00',
        null
    ),
    (
        '14',
        '9',
        '2',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 23:53:13.649874+00',
        '2025-03-27 23:53:13.649874+00',
        null
    ),
    (
        '15',
        '10',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 23:53:13.649874+00',
        '2025-03-27 23:53:13.649874+00',
        '2025-03-28 00:35:25.24+00'
    ),
    (
        '16',
        '11',
        '2',
        '2025-03-27',
        'active',
        'true',
        '2025-03-27 23:53:13.649874+00',
        '2025-03-27 23:53:13.649874+00',
        '2025-03-28 00:35:25.24+00'
    ),
    (
        '17',
        '12',
        '2',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 23:53:25.153906+00',
        '2025-03-27 23:53:25.153906+00',
        null
    ),
    (
        '18',
        '14',
        '2',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 23:53:25.153906+00',
        '2025-03-27 23:53:25.153906+00',
        null
    ),
    (
        '19',
        '13',
        '2',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 23:53:25.153906+00',
        '2025-03-27 23:53:25.153906+00',
        null
    ),
    (
        '20',
        '15',
        '2',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 23:53:25.153906+00',
        '2025-03-27 23:53:25.153906+00',
        null
    ),
    (
        '21',
        '17',
        '1',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:20:36.518793+00',
        '2025-03-28 00:20:36.518793+00',
        null
    ),
    (
        '22',
        '18',
        '1',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:20:36.518793+00',
        '2025-03-28 00:20:36.518793+00',
        null
    ),
    (
        '23',
        '19',
        '4',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:20:46.297775+00',
        '2025-03-28 00:20:46.297775+00',
        null
    ),
    (
        '24',
        '16',
        '4',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:20:55.549006+00',
        '2025-03-28 00:20:55.549006+00',
        null
    ),
    (
        '25',
        '6',
        '4',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:32:32.08057+00',
        '2025-03-28 00:32:32.08057+00',
        null
    ),
    (
        '26',
        '8',
        '6',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:32:56.329424+00',
        '2025-03-28 00:32:56.329424+00',
        null
    ),
    (
        '27',
        '21',
        '6',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:32:56.329424+00',
        '2025-03-28 00:32:56.329424+00',
        null
    ),
    (
        '28',
        '22',
        '6',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:32:56.329424+00',
        '2025-03-28 00:32:56.329424+00',
        null
    ),
    (
        '31',
        '20',
        '6',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:33:34.999746+00',
        '2025-03-28 00:33:34.999746+00',
        null
    ),
    (
        '32',
        '10',
        '6',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:35:25.682456+00',
        '2025-03-28 00:35:25.682456+00',
        null
    ),
    (
        '33',
        '11',
        '6',
        '2025-03-28',
        'active',
        'false',
        '2025-03-28 00:35:25.682456+00',
        '2025-03-28 00:35:25.682456+00',
        null
    );

-- Insertar profesores
INSERT INTO
    teachers (
        teacher_id,
        school_id,
        first_name,
        father_last_name,
        mother_last_name,
        birth_date,
        gender_id,
        curp,
        image_url,
        email,
        phone,
        delete_flag,
        created_at,
        updated_at,
        deleted_at
    )
VALUES
    -- Escuela 1 (IDs 1 a 9)
    (
        1,
        1,
        'Luis',
        'Hernández',
        'López',
        '1980-01-12',
        1,
        'HELO800112HDFXXX01',
        'luis.jpg',
        'luis.hernandez@example.com',
        '5551000001',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        2,
        1,
        'María',
        'González',
        'Ramírez',
        '1985-02-23',
        2,
        'GORA850223MDFXXX02',
        'maria.jpg',
        'maria.gonzalez@example.com',
        '5551000002',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        3,
        1,
        'Carlos',
        'Martínez',
        'Vega',
        '1979-03-15',
        1,
        'MAVE790315HDFXXX03',
        'carlos.jpg',
        'carlos.martinez@example.com',
        '5551000003',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        4,
        1,
        'Ana',
        'Fernández',
        'Duarte',
        '1982-04-28',
        2,
        'FEDU820428MDFXXX04',
        'ana.jpg',
        'ana.fernandez@example.com',
        '5551000004',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        5,
        1,
        'Javier',
        'Luna',
        'Mendoza',
        '1990-05-02',
        1,
        'LUME900502HDFXXX05',
        'javier.jpg',
        'javier.luna@example.com',
        '5551000005',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        6,
        1,
        'Sofía',
        'Pérez',
        'Campos',
        '1983-06-19',
        2,
        'PECA830619MDFXXX06',
        'sofia.jpg',
        'sofia.perez@example.com',
        '5551000006',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        7,
        1,
        'Miguel',
        'Santos',
        'Flores',
        '1977-07-14',
        1,
        'SAFL770714HDFXXX07',
        'miguel.jpg',
        'miguel.santos@example.com',
        '5551000007',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        8,
        1,
        'Laura',
        'Díaz',
        'Fuentes',
        '1988-08-30',
        2,
        'DIFU880830MDFXXX08',
        'laura.jpg',
        'laura.diaz@example.com',
        '5551000008',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        9,
        1,
        'Héctor',
        'Valdez',
        'Ortega',
        '1981-09-05',
        1,
        'VAOR810905HDFXXX09',
        'hector.jpg',
        'hector.valdez@example.com',
        '5551000009',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    -- Escuela 2 (IDs 10 a 17)
    (
        10,
        2,
        'Gabriela',
        'Moreno',
        'Pineda',
        '1992-10-10',
        2,
        'MOPI921010MDFXXX10',
        'gabriela.jpg',
        'gabriela.moreno@example.com',
        '5551000010',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        11,
        2,
        'Fernando',
        'Reyes',
        'Cortés',
        '1978-11-25',
        1,
        'RECO781125HDFXXX11',
        'fernando.jpg',
        'fernando.reyes@example.com',
        '5551000011',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        12,
        2,
        'Patricia',
        'Maldonado',
        'Arrieta',
        '1984-12-01',
        2,
        'MAAR841201MDFXXX12',
        'patricia.jpg',
        'patricia.maldonado@example.com',
        '5551000012',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        13,
        2,
        'Andrés',
        'Ortega',
        'Salazar',
        '1976-01-17',
        1,
        'ORSA760117HDFXXX13',
        'andres.jpg',
        'andres.ortega@example.com',
        '5551000013',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        14,
        2,
        'Mónica',
        'Rojas',
        'Martínez',
        '1987-02-02',
        2,
        'ROMA870202MDFXXX14',
        'monica.jpg',
        'monica.rojas@example.com',
        '5551000014',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        15,
        2,
        'Diego',
        'Núñez',
        'Castillo',
        '1979-03-11',
        1,
        'NUCA790311HDFXXX15',
        'diego.jpg',
        'diego.nunez@example.com',
        '5551000015',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        16,
        2,
        'Elena',
        'Vargas',
        'Jiménez',
        '1985-04-09',
        2,
        'VAJI850409MDFXXX16',
        'elena.jpg',
        'elena.vargas@example.com',
        '5551000016',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        17,
        2,
        'Adrián',
        'Solís',
        'Aguilar',
        '1990-05-27',
        1,
        'SOAG900527HDFXXX17',
        'adrian.jpg',
        'adrian.solis@example.com',
        '5551000017',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    -- Escuela 3 (IDs 18 a 25)
    (
        18,
        3,
        'Marisol',
        'Zamora',
        'Alonso',
        '1978-06-18',
        2,
        'ZAAL780618MDFXXX18',
        'marisol.jpg',
        'marisol.zamora@example.com',
        '5551000018',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        19,
        3,
        'Raúl',
        'Guerrero',
        'Campos',
        '1983-07-23',
        1,
        'GUCA830723HDFXXX19',
        'raul.jpg',
        'raul.guerrero@example.com',
        '5551000019',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        20,
        3,
        'Verónica',
        'Medina',
        'Pérez',
        '1991-08-05',
        2,
        'MEPE910805MDFXXX20',
        'veronica.jpg',
        'veronica.medina@example.com',
        '5551000020',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        21,
        3,
        'José',
        'Padilla',
        'Ledesma',
        '1977-09-28',
        1,
        'PALE770928HDFXXX21',
        'jose.jpg',
        'jose.padilla@example.com',
        '5551000021',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        22,
        3,
        'Adriana',
        'Garza',
        'Treviño',
        '1986-10-16',
        2,
        'GATR861016MDFXXX22',
        'adriana.jpg',
        'adriana.garza@example.com',
        '5551000022',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        23,
        3,
        'Pablo',
        'Montes',
        'Rosales',
        '1979-11-02',
        1,
        'MORO791102HDFXXX23',
        'pablo.jpg',
        'pablo.montes@example.com',
        '5551000023',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        24,
        3,
        'Daniela',
        'Huerta',
        'Sánchez',
        '1982-12-22',
        2,
        'HUSA821222MDFXXX24',
        'daniela.jpg',
        'daniela.huerta@example.com',
        '5551000024',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    ),
    (
        25,
        3,
        'Samuel',
        'Vázquez',
        'Rivera',
        '1991-01-07',
        1,
        'VARI910107HDFXXX25',
        'samuel.jpg',
        'samuel.vazquez@example.com',
        '5551000025',
        FALSE,
        '2025-04-01 16:14:09',
        '2025-04-01 16:14:09',
        NULL
    );

-- Insertar materias
INSERT INTO
    subjects (school_id, name, description)
VALUES
    (
        1,
        'Matemáticas I',
        'Introducción a operaciones básicas y razonamiento lógico.'
    ),
    (
        1,
        'Matemáticas II',
        'Resolución de problemas con suma, resta y conceptos de geometría.'
    ),
    (
        1,
        'Español I',
        'Desarrollo de la lectura, escritura y comprensión de textos.'
    ),
    (
        1,
        'Español II',
        'Producción de textos y análisis gramatical.'
    ),
    (
        1,
        'Ciencias Naturales I',
        'Observación del entorno natural y seres vivos.'
    ),
    (
        1,
        'Ciencias Naturales II',
        'Cuerpo humano, energía y ecosistemas.'
    ),
    (
        1,
        'Geografía I',
        'Ubicación espacial y características del entorno.'
    ),
    (
        1,
        'Historia I',
        'Conocimiento de hechos históricos relevantes en México.'
    ),
    (
        1,
        'Formación Cívica y Ética I',
        'Valores, normas y convivencia.'
    ),
    (
        1,
        'Educación Socioemocional',
        'Autoconocimiento, empatía y gestión emocional.'
    ),
    (
        1,
        'Educación Física I',
        'Desarrollo motor, juegos y actividades físicas.'
    ),
    (
        1,
        'Educación Física II',
        'Coordinación, trabajo en equipo y habilidades motrices.'
    ),
    (
        1,
        'Educación Artística I',
        'Expresión a través del dibujo, pintura y manualidades.'
    ),
    (
        1,
        'Educación Artística II',
        'Teatro, música y creatividad.'
    ),
    (
        1,
        'Inglés I',
        'Vocabulario básico y frases comunes en inglés.'
    ),
    (
        1,
        'Inglés II',
        'Comprensión oral, lectura y escritura de frases simples.'
    ),
    (
        1,
        'Computación I',
        'Uso básico de computadoras y programas educativos.'
    ),
    (
        1,
        'Computación II',
        'Procesadores de texto y exploración segura de internet.'
    ),
    (
        1,
        'Lectura y Redacción',
        'Fomento a la lectura y escritura de cuentos y relatos.'
    ),
    (
        1,
        'Valores y Convivencia',
        'Respeto, tolerancia y solución de conflictos.'
    ),
    (
        1,
        'Ciencias Sociales',
        'Relaciones familiares, escolares y comunitarias.'
    ),
    (
        1,
        'Biología Básica',
        'Animales, plantas y el cuerpo humano.'
    ),
    (
        1,
        'Aritmética',
        'Operaciones numéricas y problemas cotidianos.'
    ),
    (
        1,
        'Geometría Básica',
        'Figuras planas, cuerpos geométricos y medidas.'
    ),
    (
        1,
        'Ortografía',
        'Reglas básicas de escritura y puntuación.'
    ),
    (
        1,
        'Música',
        'Ritmo, instrumentos y apreciación musical.'
    ),
    (
        1,
        'Teatro',
        'Expresión escénica, improvisación y dramatización.'
    ),
    (
        1,
        'Manualidades',
        'Habilidades creativas con materiales diversos.'
    ),
    (
        1,
        'Medio Ambiente',
        'Cuidado del entorno y recursos naturales.'
    ),
    (
        1,
        'Expresión Corporal',
        'Comunicación no verbal y movimiento consciente.'
    );

-- Insertar asignaciones de grupos a materias y profesores
INSERT INTO
    "public"."group_subjects" (
        "group_subject_id",
        "group_id",
        "subject_id",
        "teacher_id",
        "delete_flag",
        "created_at",
        "deleted_at"
    )
VALUES
    (
        '1',
        '1',
        '1',
        '1',
        'true',
        '2025-04-01 16:42:42.539956+00',
        '2025-04-01 23:11:04.866+00'
    ),
    (
        '2',
        '2',
        '2',
        '3',
        'false',
        '2025-04-01 16:43:57.263795+00',
        null
    ),
    (
        '3',
        '1',
        '2',
        '8',
        'true',
        '2025-04-01 22:20:50.771287+00',
        '2025-04-01 23:10:31.278+00'
    ),
    (
        '4',
        '1',
        '3',
        '1',
        'false',
        '2025-04-01 22:53:03.863759+00',
        null
    ),
    (
        '5',
        '1',
        '5',
        '1',
        'false',
        '2025-04-01 22:53:03.863759+00',
        null
    ),
    (
        '6',
        '1',
        '7',
        '4',
        'false',
        '2025-04-01 22:53:03.863759+00',
        null
    ),
    (
        '7',
        '1',
        '9',
        '2',
        'false',
        '2025-04-01 22:53:03.863759+00',
        null
    ),
    (
        '8',
        '1',
        '10',
        '1',
        'false',
        '2025-04-01 22:55:09.461703+00',
        null
    ),
    (
        '9',
        '1',
        '13',
        '5',
        'false',
        '2025-04-01 23:17:22.943794+00',
        null
    ),
    (
        '10',
        '1',
        '15',
        '5',
        'false',
        '2025-04-01 23:17:22.943794+00',
        null
    ),
    (
        '11',
        '1',
        '17',
        '3',
        'false',
        '2025-04-01 23:17:22.943794+00',
        null
    ),
    (
        '12',
        '1',
        '19',
        '3',
        'false',
        '2025-04-01 23:17:22.943794+00',
        null
    ),
    (
        '13',
        '1',
        '31',
        '1',
        'false',
        '2025-04-02 01:10:37.664771+00',
        null
    ),
    (
        '14',
        '1',
        '30',
        '6',
        'false',
        '2025-04-02 01:10:37.664771+00',
        null
    ),
    (
        '15',
        '1',
        '29',
        '10',
        'false',
        '2025-04-02 01:10:37.664771+00',
        null
    );

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