BEGIN;

-- Elimina todo lo que haya en el schema public
DROP SCHEMA public CASCADE;

-- Recrea el schema public
CREATE SCHEMA public;

-- Permite que el usuario public tenga acceso a todo el schema public
GRANT ALL ON SCHEMA public TO public;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT
SELECT
,
    INSERT,
UPDATE,
DELETE ON TABLES TO public;

-- ---------------------------
-- Nuevas definiciones de la DB
-- ---------------------------
-- Tabla de escuelas
CREATE TABLE
    IF NOT EXISTS schools (
        school_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE,
        address TEXT,
        phone VARCHAR(15),
        email VARCHAR(100),
        website VARCHAR(255),
        logo_url VARCHAR(255),
        principal_name VARCHAR(100),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla de roles: define los diferentes perfiles del sistema
CREATE TABLE
    IF NOT EXISTS roles (
        role_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE, -- Ejemplo: 'teacher', 'admin', 'student', 'tutor'
        description TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

-- Tabla de permisos: define acciones o recursos a los que se puede acceder
CREATE TABLE
    IF NOT EXISTS permissions (
        permission_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE, -- Ejemplo: 'create_student', 'edit_grade', etc.
        description TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

-- Tabla intermedia para relacionar roles y permisos (relación muchos a muchos)
CREATE TABLE
    IF NOT EXISTS role_permissions (
        role_id INTEGER REFERENCES roles (role_id) ON DELETE CASCADE,
        permission_id INTEGER REFERENCES permissions (permission_id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
    );

-- Tabla de usuarios: aquí se registran las credenciales y datos básicos.
-- Se relaciona opcionalmente a una escuela mediante school_id.
CREATE TABLE
    IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id), -- Puede ser NULL si el usuario es global (p.ej., admin del sistema)
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL, -- Contraseña hasheada
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla intermedia para relacionar usuarios y roles (relación muchos a muchos)
CREATE TABLE
    IF NOT EXISTS user_roles (
        user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
        role_id INTEGER REFERENCES roles (role_id) ON DELETE CASCADE,
        delete_flag BOOLEAN DEFAULT FALSE,
        assigned_at TIMESTAMPTZ DEFAULT NOW (),
        PRIMARY KEY (user_id, role_id)
    );

-- Tabla principal de estudiantes
CREATE TABLE
    IF NOT EXISTS students (
        student_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        first_name VARCHAR(100) NOT NULL,
        father_last_name VARCHAR(100) NOT NULL,
        mother_last_name VARCHAR(100),
        birth_date DATE NOT NULL,
        gender VARCHAR(20) NOT NULL,
        curp VARCHAR(18),
        phone VARCHAR(15),
        email VARCHAR(100),
        grade_level VARCHAR(50),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (school_id, curp)
    );

-- Tabla de tutores
CREATE TABLE
    IF NOT EXISTS tutors (
        tutor_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        relationship VARCHAR(50) NOT NULL,
        phone VARCHAR(15),
        alternative_phone VARCHAR(15),
        email VARCHAR(100),
        address TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla de relación entre estudiantes y tutores
CREATE TABLE
    IF NOT EXISTS student_tutors (
        student_tutor_id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students (student_id) ON DELETE CASCADE,
        tutor_id INTEGER REFERENCES tutors (tutor_id) ON DELETE CASCADE,
        is_primary BOOLEAN DEFAULT FALSE,
        can_pickup BOOLEAN DEFAULT TRUE,
        notes TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (student_id, tutor_id)
    );

-- Restricción para asegurar que cada estudiante tenga al menos un tutor primario
CREATE UNIQUE INDEX IF NOT EXISTS idx_primary_tutor_per_student ON student_tutors (student_id)
WHERE
    is_primary = TRUE
    AND delete_flag = FALSE
    AND deleted_at IS NULL;

-- Tabla de direcciones
CREATE TABLE
    IF NOT EXISTS addresses (
        address_id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students (student_id) ON DELETE CASCADE,
        street VARCHAR(255),
        neighborhood VARCHAR(100),
        interior_number VARCHAR(20),
        exterior_number VARCHAR(20),
        postal_code VARCHAR(10),
        reference TEXT,
        is_current BOOLEAN DEFAULT TRUE,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Restricción de dirección actual única por estudiante
CREATE UNIQUE INDEX IF NOT EXISTS idx_current_address_per_student ON addresses (student_id)
WHERE
    is_current = TRUE
    AND delete_flag = FALSE;

-- Tabla de ciclos escolares
CREATE TABLE
    IF NOT EXISTS school_years (
        school_year_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'completed')),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla de profesores
CREATE TABLE
    IF NOT EXISTS teachers (
        teacher_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        email VARCHAR(100),
        phone VARCHAR(15),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla de grupos
CREATE TABLE
    IF NOT EXISTS groups (
        group_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        grade INTEGER NOT NULL,
        group_name VARCHAR(10) NOT NULL,
        school_year_id INTEGER REFERENCES school_years (school_year_id),
        students_number INTEGER DEFAULT 0,
        subjects_number INTEGER DEFAULT 0,
        status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'completed')),
        general_average NUMERIC(4, 2),
        description TEXT,
        group_image VARCHAR(255),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (school_id, school_year_id, grade, group_name)
    );

-- Tabla de materias
CREATE TABLE
    IF NOT EXISTS subjects (
        subject_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Relación entre grupos y profesores (muchos a muchos)
CREATE TABLE
    IF NOT EXISTS group_teachers (
        group_teacher_id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups (group_id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers (teacher_id) ON DELETE CASCADE,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (group_id, teacher_id)
    );

-- Relación entre estudiantes y grupos (muchos a muchos)
CREATE TABLE
    IF NOT EXISTS student_groups (
        student_group_id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students (student_id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES groups (group_id) ON DELETE CASCADE,
        enrollment_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'active' CHECK (
            status IN ('active', 'inactive', 'graduated', 'transferred')
        ),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (student_id, group_id)
    );

-- Tabla para materias asignadas a grupos
CREATE TABLE
    IF NOT EXISTS group_subjects (
        group_subject_id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups (group_id) ON DELETE CASCADE,
        subject_id INTEGER REFERENCES subjects (subject_id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers (teacher_id),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (group_id, subject_id)
    );

-- Tabla para calificaciones de estudiantes
CREATE TABLE
    IF NOT EXISTS grades (
        grade_id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students (student_id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES groups (group_id) ON DELETE CASCADE,
        subject_id INTEGER REFERENCES subjects (subject_id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers (teacher_id),
        school_year_id INTEGER REFERENCES school_years (school_year_id),
        period VARCHAR(50) NOT NULL,
        grade NUMERIC(4, 2) NOT NULL,
        comments TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (student_id, subject_id, period, school_year_id)
    );

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_students_names ON students (first_name, father_last_name, mother_last_name);

CREATE INDEX IF NOT EXISTS idx_students_curp ON students (curp);

CREATE INDEX IF NOT EXISTS idx_group_school_year ON groups (school_year_id);

CREATE INDEX IF NOT EXISTS idx_student_groups_group ON student_groups (group_id);

CREATE INDEX IF NOT EXISTS idx_student_groups_student ON student_groups (student_id);

CREATE INDEX IF NOT EXISTS idx_grades_student_subject ON grades (student_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_addresses_student_id ON addresses (student_id);

CREATE INDEX IF NOT EXISTS idx_active_students ON students (delete_flag)
WHERE
    delete_flag = FALSE;

CREATE INDEX IF NOT EXISTS idx_active_teachers ON teachers (delete_flag)
WHERE
    delete_flag = FALSE;

CREATE INDEX IF NOT EXISTS idx_active_tutors ON tutors (delete_flag)
WHERE
    delete_flag = FALSE;

CREATE INDEX IF NOT EXISTS idx_student_tutors_student ON student_tutors (student_id);

CREATE INDEX IF NOT EXISTS idx_student_tutors_tutor ON student_tutors (tutor_id);

CREATE INDEX IF NOT EXISTS idx_students_school ON students (school_id);

CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers (school_id);

CREATE INDEX IF NOT EXISTS idx_groups_school ON groups (school_id);

CREATE INDEX IF NOT EXISTS idx_subjects_school ON subjects (school_id);

CREATE INDEX IF NOT EXISTS idx_school_years_school ON school_years (school_id);

CREATE INDEX IF NOT EXISTS idx_active_schools ON schools (delete_flag)
WHERE
    delete_flag = FALSE;

CREATE INDEX IF NOT EXISTS idx_user_email ON users (email);

-- Índice para buscar usuario por email
CREATE INDEX IF NOT EXISTS idx_user_email ON users (email);

-- Habilitar Row Level Security (RLS) en todas las tablas
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

ALTER TABLE student_tutors ENABLE ROW LEVEL SECURITY;

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

ALTER TABLE school_years ENABLE ROW LEVEL SECURITY;

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

ALTER TABLE group_teachers ENABLE ROW LEVEL SECURITY;

ALTER TABLE student_groups ENABLE ROW LEVEL SECURITY;

ALTER TABLE group_subjects ENABLE ROW LEVEL SECURITY;

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Acceso total a usuarios" ON users;

DROP POLICY IF EXISTS "Acceso total a roles de usuario" ON user_roles;

DROP POLICY IF EXISTS "Permitir acceso a ciclos escolares" ON school_years;

DROP POLICY IF EXISTS "Acceso total a escuelas" ON schools;

DROP POLICY IF EXISTS "Acceso total a roles" ON roles;

DROP POLICY IF EXISTS "Acceso total a permisos" ON permissions;

DROP POLICY IF EXISTS "Acceso total a role_permissions" ON role_permissions;

DROP POLICY IF EXISTS "Acceso total a estudiantes" ON students;

DROP POLICY IF EXISTS "Acceso total a tutores" ON tutors;

DROP POLICY IF EXISTS "Acceso total a student_tutors" ON student_tutors;

DROP POLICY IF EXISTS "Acceso total a direcciones" ON addresses;

DROP POLICY IF EXISTS "Acceso total a profesores" ON teachers;

DROP POLICY IF EXISTS "Acceso total a grupos" ON groups;

DROP POLICY IF EXISTS "Acceso total a materias" ON subjects;

DROP POLICY IF EXISTS "Acceso total a group_teachers" ON group_teachers;

DROP POLICY IF EXISTS "Acceso total a student_groups" ON student_groups;

DROP POLICY IF EXISTS "Acceso total a group_subjects" ON group_subjects;

DROP POLICY IF EXISTS "Acceso total a calificaciones" ON grades;

-- Crear políticas para todas las tablas
CREATE POLICY "Acceso total a escuelas" ON schools FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a roles" ON roles FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a permisos" ON permissions FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a role_permissions" ON role_permissions FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a usuarios" ON users FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a roles de usuario" ON user_roles FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a estudiantes" ON students FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a tutores" ON tutors FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a student_tutors" ON student_tutors FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a direcciones" ON addresses FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a ciclos escolares" ON school_years FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a profesores" ON teachers FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a grupos" ON groups FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a materias" ON subjects FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a group_teachers" ON group_teachers FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a student_groups" ON student_groups FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a group_subjects" ON group_subjects FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a calificaciones" ON grades FOR ALL USING (true)
WITH
    CHECK (true);

-- Otorgar permisos a todas las secuencias
GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA public TO authenticated;

GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Otorgar permisos a todas las tablas
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;

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

INSERT INTO
    "public"."student_groups" (
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
        '2025-03-28 00:10:10.701+00'
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
        '2025-03-27 22:48:14.072+00'
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
        '2025-03-28 00:02:41.714+00'
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
        '2025-03-27 23:45:14.658+00'
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
        '2025-03-27 23:44:53.578+00'
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
        '2025-03-27 23:45:13.238+00'
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
        '2025-03-27 23:45:16.654+00'
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
        '2025-03-27 23:45:15.604+00'
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
        'false',
        '2025-03-27 23:53:13.649874+00',
        '2025-03-27 23:53:13.649874+00',
        null
    ),
    (
        '16',
        '11',
        '2',
        '2025-03-27',
        'active',
        'false',
        '2025-03-27 23:53:13.649874+00',
        '2025-03-27 23:53:13.649874+00',
        null
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
    );

COMMIT;