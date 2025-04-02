/************ Generar datos para las tablas ************/
-- Insertar estados iniciales
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

-- Admin puede ver estudiante
-- Generar datos para escuelas
INSERT INTO
    schools (
        name,
        code,
        address,
        phone,
        email,
        website,
        logo_url,
        principal_name,
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
        'logo.png',
        'Juan Pérez',
        FALSE
    );

-- Insertar usuario de prueba
INSERT INTO
    users (email, password_hash, first_name, last_name)
VALUES
    (
        'test@email.com',
        crypt ('1234', gen_salt ('bf')),
        'Usuario',
        'Prueba'
    );

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

-- Insertar ciclos escolares
INSERT INTO
    "school_years" (
        "school_year_id",
        "school_id",
        "name",
        "start_date",
        "end_date",
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
        'Ciclo 2025-2026',
        '2025-07-18',
        '2026-07-30',
        'inactive',
        'false',
        '2025-03-27 00:35:22.175036+00',
        '2025-03-27 05:45:28.114+00',
        null
    ),
    (
        '2',
        '1',
        'Ciclo 2023-2024',
        '2023-07-13',
        '2024-07-30',
        'completed',
        'false',
        '2025-03-27 00:35:37.835517+00',
        '2025-03-27 07:53:50.918+00',
        null
    ),
    (
        '3',
        '1',
        'test 3',
        '2025-03-02',
        '2025-03-30',
        'inactive',
        'true',
        '2025-03-27 00:35:55.20988+00',
        '2025-03-27 00:48:34.986+00',
        '2025-03-27 05:51:30.572+00'
    ),
    (
        '4',
        '1',
        'Ciclo 2024-2025',
        '2024-07-27',
        '2025-07-13',
        'active',
        'false',
        '2025-03-27 01:35:10.229855+00',
        '2025-03-27 07:37:12.599+00',
        null
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

-- Insertar estudiantes
INSERT INTO
    "students" (
        "student_id",
        "school_id",
        "first_name",
        "father_last_name",
        "mother_last_name",
        "birth_date",
        "gender",
        "curp",
        "phone",
        "email",
        "grade_level",
        "delete_flag",
        "created_at",
        "updated_at",
        "deleted_at"
    )
VALUES
    (
        '1',
        '1',
        'Miguel',
        'Ortega',
        'Montiel',
        '2025-03-12',
        'Masculino',
        'OEMM89789DS2H08',
        '312312',
        'migueel.angelom@gmail.com',
        '1A',
        'false',
        '2025-03-27 10:29:24.891616+00',
        '2025-03-27 10:29:24.891616+00',
        null
    ),
    (
        '3',
        '1',
        'Juan',
        'Pérez',
        'López',
        '2010-05-12',
        'Masculino',
        'PEPJ100512HDFRZN09',
        '5551112233',
        'juan.perez@example.com',
        'Primero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '4',
        '1',
        'Ana',
        'García',
        'Martínez',
        '2011-08-21',
        'Femenino',
        'GAMA110821MDFRZN02',
        '5551112234',
        'ana.garcia@example.com',
        'Segundo',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '5',
        '1',
        'Luis',
        'Hernández',
        'Ramírez',
        '2012-01-03',
        'Masculino',
        'HERL120103HDFRZN04',
        '5551112235',
        'luis.hernandez@example.com',
        'Tercero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '6',
        '1',
        'Sofía',
        'Martínez',
        'Pérez',
        '2010-11-17',
        'Femenino',
        'MAPS101117MDFRZN08',
        '5551112236',
        'sofia.martinez@example.com',
        'Cuarto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '7',
        '1',
        'Carlos',
        'López',
        'Sánchez',
        '2009-07-09',
        'Masculino',
        'LOSJ090709HDFRZN00',
        '5551112237',
        'carlos.lopez@example.com',
        'Quinto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '8',
        '1',
        'Isabella',
        'Ramírez',
        'Flores',
        '2013-04-29',
        'Femenino',
        'RAFI130429MDFRZN03',
        '5551112238',
        'isabella.ramirez@example.com',
        'Primero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '9',
        '1',
        'Diego',
        'Sánchez',
        'Gómez',
        '2011-02-19',
        'Masculino',
        'SADG110219HDFRZN07',
        '5551112239',
        'diego.sanchez@example.com',
        'Segundo',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '10',
        '1',
        'Valentina',
        'Torres',
        'Cruz',
        '2010-09-15',
        'Femenino',
        'TOCV100915MDFRZN01',
        '5551112240',
        'valentina.torres@example.com',
        'Tercero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '11',
        '1',
        'Emiliano',
        'Flores',
        'Morales',
        '2009-06-03',
        'Masculino',
        'FLME090603HDFRZN05',
        '5551112241',
        'emiliano.flores@example.com',
        'Cuarto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '12',
        '1',
        'Camila',
        'Gómez',
        'Luna',
        '2012-12-27',
        'Femenino',
        'GOLC121227MDFRZN06',
        '5551112242',
        'camila.gomez@example.com',
        'Quinto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '13',
        '1',
        'Mateo',
        'Reyes',
        'Navarro',
        '2011-03-10',
        'Masculino',
        'REMN110310HDFRZN00',
        '5551112243',
        'mateo.reyes@example.com',
        'Primero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '14',
        '1',
        'Renata',
        'Morales',
        'Jiménez',
        '2013-07-22',
        'Femenino',
        'MOJR130722MDFRZN09',
        '5551112244',
        'renata.morales@example.com',
        'Segundo',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '15',
        '1',
        'Daniel',
        'Cruz',
        'Vega',
        '2010-10-05',
        'Masculino',
        'CRVD101005HDFRZN02',
        '5551112245',
        'daniel.cruz@example.com',
        'Tercero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '16',
        '1',
        'María',
        'Jiménez',
        'Ortiz',
        '2011-01-18',
        'Femenino',
        'JIOM110118MDFRZN07',
        '5551112246',
        'maria.jimenez@example.com',
        'Cuarto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '17',
        '1',
        'Andrés',
        'Navarro',
        'Castañeda',
        '2009-09-30',
        'Masculino',
        'NACA090930HDFRZN03',
        '5551112247',
        'andres.navarro@example.com',
        'Quinto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '18',
        '1',
        'Paola',
        'Castillo',
        'Reyes',
        '2012-02-06',
        'Femenino',
        'CARP120206MDFRZN04',
        '5551112248',
        'paola.castillo@example.com',
        'Primero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '19',
        '1',
        'Sebastián',
        'Ortiz',
        'López',
        '2013-05-01',
        'Masculino',
        'ORLS130501HDFRZN01',
        '5551112249',
        'sebastian.ortiz@example.com',
        'Segundo',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '20',
        '1',
        'Regina',
        'Vega',
        'Campos',
        '2010-12-13',
        'Femenino',
        'VECR101213MDFRZN06',
        '5551112250',
        'regina.vega@example.com',
        'Tercero',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '21',
        '1',
        'Fernando',
        'Castañeda',
        'Torres',
        '2011-04-08',
        'Masculino',
        'CATO110408HDFRZN08',
        '5551112251',
        'fernando.castaneda@example.com',
        'Cuarto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
        null
    ),
    (
        '22',
        '1',
        'Ximena',
        'Luna',
        'Mendoza',
        '2009-08-26',
        'Femenino',
        'LUMX090826MDFRZN05',
        '5551112252',
        'ximena.luna@example.com',
        'Quinto',
        'false',
        '2025-03-27 21:35:54.933352+00',
        '2025-03-27 21:35:54.933352+00',
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
    "public"."teachers" (
        "teacher_id",
        "school_id",
        "name",
        "role",
        "image",
        "email",
        "phone",
        "delete_flag",
        "created_at",
        "updated_at",
        "deleted_at"
    )
VALUES
    (
        '1',
        '1',
        'Luis Ernesto',
        'profesor',
        '',
        'luisernesto@mail.com',
        '321132432',
        'false',
        '2025-04-01 04:32:31.508109+00',
        '2025-04-01 04:32:31.508109+00',
        null
    ),
    (
        '2',
        '1',
        'Laura Ramírez',
        'Docente de Matemáticas',
        'laura.jpg',
        'laura.ramirez@example.com',
        '5552001001',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '3',
        '1',
        'Miguel Torres',
        'Docente de Ciencias',
        'miguel.jpg',
        'miguel.torres@example.com',
        '5552001002',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '4',
        '1',
        'Patricia Gómez',
        'Docente de Español',
        'patricia.jpg',
        'patricia.gomez@example.com',
        '5552001003',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '5',
        '1',
        'Andrés Navarro',
        'Docente de Historia',
        'andres.jpg',
        'andres.navarro@example.com',
        '5552001004',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '6',
        '1',
        'Rocío Sánchez',
        'Docente de Geografía',
        'rocio.jpg',
        'rocio.sanchez@example.com',
        '5552001005',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '7',
        '1',
        'Javier Martínez',
        'Docente de Educación Física',
        'javier.jpg',
        'javier.martinez@example.com',
        '5552001006',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '8',
        '1',
        'Claudia Vega',
        'Docente de Inglés',
        'claudia.jpg',
        'claudia.vega@example.com',
        '5552001007',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '9',
        '1',
        'Daniela Cruz',
        'Docente de Música',
        'daniela.jpg',
        'daniela.cruz@example.com',
        '5552001008',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '10',
        '1',
        'Fernando Morales',
        'Docente de Computación',
        'fernando.jpg',
        'fernando.morales@example.com',
        '5552001009',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
    ),
    (
        '11',
        '1',
        'Gabriela Jiménez',
        'Docente de Formación Cívica',
        'gabriela.jpg',
        'gabriela.jimenez@example.com',
        '5552001010',
        'false',
        '2025-04-01 16:14:09.459949+00',
        '2025-04-01 16:14:09.459949+00',
        null
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