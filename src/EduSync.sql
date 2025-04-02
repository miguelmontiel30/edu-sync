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
-- Tabla de estados (debe ir primero ya que otras tablas la referencian)
CREATE TABLE
    IF NOT EXISTS status (
        status_id SERIAL PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

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
        principal_user_id INTEGER REFERENCES users (user_id),
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
        plain_password TEXT, -- Contraseña sin hashear
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        linked_id INTEGER, -- ID relacionado con el tipo de usuario (student_id, teacher_id, tutor_id)
        linked_type VARCHAR(20), -- 'student', 'teacher', 'tutor'
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
        curp VARCHAR(18) NOT NULL,
        phone VARCHAR(15),
        email VARCHAR(100),
        image_url VARCHAR(255),
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
        father_last_name VARCHAR(100) NOT NULL,
        mother_last_name VARCHAR(100),
        relationship VARCHAR(50) NOT NULL,
        phone VARCHAR(15),
        alternative_phone VARCHAR(15),
        email VARCHAR(100),
        image_url VARCHAR(255),
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
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (student_id, tutor_id)
    );

-- Tabla de direcciones
CREATE TABLE
    IF NOT EXISTS addresses (
        address_id SERIAL PRIMARY KEY,
        street VARCHAR(255),
        neighborhood VARCHAR(100),
        interior_number VARCHAR(20),
        exterior_number VARCHAR(20),
        postal_code VARCHAR(10),
        reference TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla intermedia para relacionar usuarios con direcciones
CREATE TABLE
    IF NOT EXISTS user_addresses (
        user_address_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
        address_id INTEGER REFERENCES addresses (address_id) ON DELETE CASCADE,
        is_current BOOLEAN DEFAULT TRUE,
        address_type VARCHAR(20) CHECK (address_type IN ('home', 'work', 'other')),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Restricción de dirección actual única por usuario y tipo de dirección
CREATE UNIQUE INDEX IF NOT EXISTS idx_current_address_per_user_type ON user_addresses (user_id, address_type)
WHERE
    is_current = TRUE
    AND delete_flag = FALSE
    AND deleted_at IS NULL;

-- Tabla de ciclos escolares
CREATE TABLE
    IF NOT EXISTS school_years (
        school_year_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
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
        father_last_name VARCHAR(100) NOT NULL,
        mother_last_name VARCHAR(100),
        birth_date DATE NOT NULL,
        gender VARCHAR(20) NOT NULL,
        curp VARCHAR(18) NULL,
        image_url VARCHAR(255),
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
        school_year_id INTEGER REFERENCES school_years (school_year_id),
        primary_teacher INTEGER REFERENCES teachers (teacher_id),
        grade INTEGER NOT NULL,
        group_name VARCHAR(10) NOT NULL,
        description TEXT,
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
        group_image VARCHAR(255),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (school_id, school_year_id, grade, group_name)
    );

-- Relación entre estudiantes y grupos (muchos a muchos)
CREATE TABLE
    IF NOT EXISTS student_groups (
        student_group_id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students (student_id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES groups (group_id) ON DELETE CASCADE,
        enrollment_date DATE DEFAULT CURRENT_DATE,
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Crear índice único que solo considere registros activos y el ciclo escolar
CREATE UNIQUE INDEX student_groups_student_id_school_year_active_key ON student_groups (student_id, group_id)
WHERE
    delete_flag = FALSE;

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

-- Tabla para materias asignadas a grupos
CREATE TABLE
    IF NOT EXISTS group_subjects (
        group_subject_id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups (group_id) ON DELETE CASCADE,
        subject_id INTEGER REFERENCES subjects (subject_id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers (teacher_id),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (group_id, subject_id)
    );

-- Tabla para calificaciones de estudiantes
CREATE TABLE
    IF NOT EXISTS grades (
        grade_id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students (student_id) ON DELETE CASCADE,
        evaluation_period_id INTEGER REFERENCES evaluation_periods (evaluation_period_id) ON DELETE CASCADE,
        grade NUMERIC(4, 2) NOT NULL,
        comments TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (student_id, subject_id, period, school_year_id)
    );

--Tabla para definir los periodos de evaluación
CREATE TABLE
    IF NOT EXISTS evaluation_periods (
        evaluation_period_id SERIAL PRIMARY KEY,
        group_subject_id INTEGER REFERENCES group_subjects (group_subject_id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla de tipos de dirección
CREATE TABLE
    address_types (
        type_id SERIAL PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla de géneros
CREATE TABLE
    genders (
        gender_id SERIAL PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_students_names ON students (first_name, father_last_name, mother_last_name);

CREATE INDEX IF NOT EXISTS idx_students_curp ON students (curp);

CREATE INDEX IF NOT EXISTS idx_group_school_year ON groups (school_year_id);

CREATE INDEX IF NOT EXISTS idx_student_groups_group ON student_groups (group_id);

CREATE INDEX IF NOT EXISTS idx_student_groups_student ON student_groups (student_id);

CREATE INDEX IF NOT EXISTS idx_grades_student_subject ON grades (student_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses (user_id);

CREATE INDEX IF NOT EXISTS idx_addresses_postal_code ON addresses (postal_code);

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

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_school_years_status ON school_years (status_id);

CREATE INDEX IF NOT EXISTS idx_groups_status ON groups (status_id);

CREATE INDEX IF NOT EXISTS idx_student_groups_status ON student_groups (status_id);

CREATE INDEX IF NOT EXISTS idx_evaluation_periods_status ON evaluation_periods (status_id);

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

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Acceso total a user_addresses" ON user_addresses;

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

CREATE POLICY "Acceso total a user_addresses" ON user_addresses FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a estados" ON status FOR ALL USING (true)
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

COMMIT;