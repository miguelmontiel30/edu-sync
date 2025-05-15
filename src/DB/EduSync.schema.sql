BEGIN;

-- =============================================
-- Configuración inicial del schema
-- =============================================
DROP SCHEMA public CASCADE;

CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO public;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT
SELECT
,
    INSERT,
UPDATE,
DELETE ON TABLES TO public;

-- =============================================
-- Tablas de Catálogos y Configuración
-- =============================================
-- Tabla de estados del sistema
CREATE TABLE
    IF NOT EXISTS status (
        status_id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE status IS 'Catálogo de estados para diferentes entidades del sistema';

COMMENT ON COLUMN status.code IS 'Código único del estado (ej: ACTIVE, INACTIVE)';

COMMENT ON COLUMN status.name IS 'Nombre descriptivo del estado';

COMMENT ON COLUMN status.category IS 'Categoría del estado (ej: school_year, group, student)';

-- Tabla de tipos de dirección
CREATE TABLE
    IF NOT EXISTS address_types (
        type_id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE address_types IS 'Catálogo de tipos de direcciones disponibles';

COMMENT ON COLUMN address_types.code IS 'Código único del tipo de dirección';

COMMENT ON COLUMN address_types.name IS 'Nombre descriptivo del tipo de dirección';

-- Tabla de géneros
CREATE TABLE
    IF NOT EXISTS genders (
        gender_id SERIAL PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE genders IS 'Catálogo de géneros disponibles';

COMMENT ON COLUMN genders.code IS 'Código único del género';

COMMENT ON COLUMN genders.name IS 'Nombre descriptivo del género';

-- =============================================
-- Tablas de Seguridad y Autenticación
-- =============================================
-- Tabla de roles del sistema
CREATE TABLE
    IF NOT EXISTS roles (
        role_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

COMMENT ON TABLE roles IS 'Define los diferentes perfiles del sistema';

COMMENT ON COLUMN roles.name IS 'Nombre del rol (ej: teacher, admin, student, tutor)';

COMMENT ON COLUMN roles.description IS 'Descripción detallada del rol';

-- Tabla de permisos
CREATE TABLE
    IF NOT EXISTS permissions (
        permission_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

COMMENT ON TABLE permissions IS 'Define acciones o recursos accesibles en el sistema';

COMMENT ON COLUMN permissions.name IS 'Nombre del permiso (ej: create_student, edit_grade)';

COMMENT ON COLUMN permissions.description IS 'Descripción detallada del permiso';

-- Tabla de relación roles-permisos
CREATE TABLE
    IF NOT EXISTS role_permissions (
        role_id INTEGER REFERENCES roles (role_id) ON DELETE CASCADE,
        permission_id INTEGER REFERENCES permissions (permission_id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
    );

COMMENT ON TABLE role_permissions IS 'Relaciona roles con sus permisos correspondientes';

-- =============================================
-- Tablas Principales del Sistema
-- =============================================
-- Tabla de escuelas (sin la referencia a principal_user_id por ahora)
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
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE schools IS 'Almacena información de las escuelas del sistema';

COMMENT ON COLUMN schools.name IS 'Nombre completo de la escuela';

COMMENT ON COLUMN schools.code IS 'Código único de la escuela';

-- Tabla de usuarios
CREATE TABLE
    IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        plain_password TEXT,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        linked_id INTEGER,
        linked_type VARCHAR(20),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE users IS 'Almacena información de usuarios del sistema';

COMMENT ON COLUMN users.email IS 'Correo electrónico del usuario';

COMMENT ON COLUMN users.linked_id IS 'ID relacionado con el tipo de usuario (student_id, teacher_id, tutor_id)';

COMMENT ON COLUMN users.linked_type IS 'Tipo de usuario (student, teacher, tutor)';

-- Ahora podemos añadir la columna principal_user_id a schools
ALTER TABLE schools
ADD COLUMN principal_user_id INTEGER REFERENCES users (user_id);

COMMENT ON COLUMN schools.principal_user_id IS 'ID del usuario principal (director) de la escuela';

-- Tabla de roles de usuario
CREATE TABLE
    IF NOT EXISTS user_roles (
        user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
        role_id INTEGER REFERENCES roles (role_id) ON DELETE CASCADE,
        delete_flag BOOLEAN DEFAULT FALSE,
        assigned_at TIMESTAMPTZ DEFAULT NOW (),
        PRIMARY KEY (user_id, role_id)
    );

COMMENT ON TABLE user_roles IS 'Relaciona usuarios con sus roles asignados';

-- Tabla de relación roles-permisos
CREATE TABLE
    IF NOT EXISTS role_permissions (
        role_id INTEGER REFERENCES roles (role_id) ON DELETE CASCADE,
        permission_id INTEGER REFERENCES permissions (permission_id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
    );

COMMENT ON TABLE role_permissions IS 'Relaciona roles con sus permisos correspondientes';

-- =============================================
-- Tablas de Gestión Académica
-- =============================================
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

COMMENT ON TABLE school_years IS 'Define los ciclos escolares de cada escuela';

COMMENT ON COLUMN school_years.name IS 'Nombre del ciclo escolar';

COMMENT ON COLUMN school_years.start_date IS 'Fecha de inicio del ciclo';

COMMENT ON COLUMN school_years.end_date IS 'Fecha de fin del ciclo';

-- Tabla de estudiantes
CREATE TABLE
    IF NOT EXISTS students (
        student_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        first_name VARCHAR(100) NOT NULL,
        father_last_name VARCHAR(100) NOT NULL,
        mother_last_name VARCHAR(100),
        birth_date DATE NOT NULL,
        gender_id INTEGER REFERENCES genders (gender_id) NOT NULL,
        curp VARCHAR(18) NOT NULL,
        phone VARCHAR(15),
        email VARCHAR(100),
        image_url VARCHAR(255),
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (school_id, curp)
    );

COMMENT ON TABLE students IS 'Almacena información de los estudiantes';

COMMENT ON COLUMN students.curp IS 'Clave Única de Registro de Población';

COMMENT ON COLUMN students.birth_date IS 'Fecha de nacimiento del estudiante';

-- Tabla de profesores
CREATE TABLE
    IF NOT EXISTS teachers (
        teacher_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        first_name VARCHAR(255) NOT NULL,
        father_last_name VARCHAR(100) NOT NULL,
        mother_last_name VARCHAR(100),
        birth_date DATE NOT NULL,
        gender_id INTEGER REFERENCES genders (gender_id) NOT NULL,
        curp VARCHAR(18) NULL,
        image_url VARCHAR(255),
        email VARCHAR(100),
        phone VARCHAR(15),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE teachers IS 'Almacena información de los profesores';

COMMENT ON COLUMN teachers.curp IS 'Clave Única de Registro de Población';

COMMENT ON COLUMN teachers.birth_date IS 'Fecha de nacimiento del profesor';

-- Tabla de grupos
CREATE TABLE
    IF NOT EXISTS groups (
        group_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        school_year_id INTEGER REFERENCES school_years (school_year_id),
        teacher_id INTEGER REFERENCES teachers (teacher_id),
        grade INTEGER NOT NULL,
        group_name VARCHAR(10) NOT NULL,
        description TEXT,
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
        group_image VARCHAR(255),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE groups IS 'Define los grupos de estudiantes por grado';

COMMENT ON COLUMN groups.grade IS 'Grado escolar del grupo';

COMMENT ON COLUMN groups.group_name IS 'Nombre del grupo (ej: A, B, C)';

COMMENT ON COLUMN groups.teacher_id IS 'ID del profesor titular del grupo';

-- Relación entre estudiantes y grupos
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

COMMENT ON TABLE student_groups IS 'Relaciona estudiantes con grupos';

COMMENT ON COLUMN student_groups.enrollment_date IS 'Fecha de inscripción al grupo';

-- Crear índice único que solo considere registros activos
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
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE subjects IS 'Define las materias disponibles en el sistema';

COMMENT ON COLUMN subjects.name IS 'Nombre de la materia';

COMMENT ON COLUMN subjects.description IS 'Descripción detallada de la materia';

-- Tabla de materias por grupo
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

COMMENT ON TABLE group_subjects IS 'Relaciona grupos con sus materias y profesores';

COMMENT ON COLUMN group_subjects.teacher_id IS 'ID del profesor asignado a la materia en el grupo';

-- Tabla de periodos de evaluación
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

COMMENT ON TABLE evaluation_periods IS 'Define los periodos de evaluación por materia y grupo';

COMMENT ON COLUMN evaluation_periods.name IS 'Nombre del periodo de evaluación';

COMMENT ON COLUMN evaluation_periods.start_date IS 'Fecha de inicio del periodo';

COMMENT ON COLUMN evaluation_periods.end_date IS 'Fecha de fin del periodo';

-- Tabla de calificaciones
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
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE grades IS 'Almacena las calificaciones de los estudiantes';

COMMENT ON COLUMN grades.grade IS 'Calificación numérica del estudiante';

COMMENT ON COLUMN grades.comments IS 'Comentarios adicionales sobre la calificación';

-- Ajustar la restricción UNIQUE después de que todas las tablas están creadas
ALTER TABLE grades
DROP CONSTRAINT IF EXISTS grades_student_id_subject_id_period_school_year_id_key;

ALTER TABLE grades ADD CONSTRAINT grades_student_evaluation_unique UNIQUE (student_id, evaluation_period_id);

-- =============================================
-- Tablas de Gestión de Direcciones
-- =============================================
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

COMMENT ON TABLE addresses IS 'Almacena información de direcciones físicas';

COMMENT ON COLUMN addresses.street IS 'Nombre de la calle';

COMMENT ON COLUMN addresses.postal_code IS 'Código postal de la dirección';

-- Tabla de direcciones de usuario
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

COMMENT ON TABLE user_addresses IS 'Relaciona usuarios con sus direcciones';

COMMENT ON COLUMN user_addresses.is_current IS 'Indica si es la dirección actual del usuario';

COMMENT ON COLUMN user_addresses.address_type IS 'Tipo de dirección (casa, trabajo, otra)';

-- Restricción de dirección actual única por usuario y tipo de dirección
CREATE UNIQUE INDEX idx_current_address_per_user_type ON user_addresses (user_id, address_type)
WHERE
    is_current = TRUE
    AND delete_flag = FALSE
    AND deleted_at IS NULL;

-- =============================================
-- Tablas de Gestión de Tutores
-- =============================================
-- Tabla de tutores
CREATE TABLE
    IF NOT EXISTS tutors (
        tutor_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        father_last_name VARCHAR(100) NOT NULL,
        mother_last_name VARCHAR(100),
        relationship VARCHAR(50) NOT NULL,
        gender_id INTEGER REFERENCES genders (gender_id) NOT NULL,
        phone VARCHAR(15),
        alternative_phone VARCHAR(15),
        email VARCHAR(100),
        image_url VARCHAR(255),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

COMMENT ON TABLE tutors IS 'Almacena información de los tutores de estudiantes';

COMMENT ON COLUMN tutors.relationship IS 'Relación con el estudiante (padre, madre, etc.)';

COMMENT ON COLUMN tutors.alternative_phone IS 'Teléfono alternativo de contacto';

-- Tabla de relación estudiantes-tutores
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

COMMENT ON TABLE student_tutors IS 'Relaciona estudiantes con sus tutores';

COMMENT ON COLUMN student_tutors.is_primary IS 'Indica si es el tutor principal';

COMMENT ON COLUMN student_tutors.can_pickup IS 'Indica si puede recoger al estudiante';

-- Tabla para tipos de eventos
CREATE TABLE
    IF NOT EXISTS event_types (
        event_type_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        name VARCHAR(100) NOT NULL,
        color VARCHAR(50),
        icon VARCHAR(50),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla principal de eventos
CREATE TABLE
    IF NOT EXISTS events (
        event_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id),
        event_type_id INTEGER REFERENCES event_types (event_type_id),
        school_year_id INTEGER REFERENCES school_years (school_year_id),
        title VARCHAR(150) NOT NULL,
        description TEXT,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ,
        all_day BOOLEAN DEFAULT FALSE,
        status_id INTEGER REFERENCES status (status_id) NOT NULL,
        created_by INTEGER REFERENCES users (user_id),
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ
    );

-- Tabla para destinatarios de eventos
CREATE TABLE
    IF NOT EXISTS event_recipients (
        event_recipient_id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events (event_id) ON DELETE CASCADE,
        role_id INTEGER REFERENCES roles (role_id),
        recipient_id INTEGER,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        deleted_at TIMESTAMPTZ,
        UNIQUE (event_id, role_id, recipient_id)
    );

-- =============================================
-- Tablas de Configuración
-- =============================================
-- Tabla de configuración general del sistema
CREATE TABLE
    IF NOT EXISTS school_settings (
        setting_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools (school_id) NOT NULL,
        key VARCHAR(100) NOT NULL,
        value JSONB NOT NULL DEFAULT '{}',
        description TEXT,
        is_system BOOLEAN DEFAULT FALSE,
        delete_flag BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        UNIQUE (school_id, key)
    );

COMMENT ON TABLE school_settings IS 'Almacena configuraciones por escuela del sistema';

COMMENT ON COLUMN school_settings.key IS 'Nombre de la clave de configuración (ej: theme.colors, notifications.email)';

COMMENT ON COLUMN school_settings.value IS 'Valor de la configuración en formato JSON';

COMMENT ON COLUMN school_settings.is_system IS 'Indica si es una configuración de sistema que no debe modificarse';

-- =============================================
-- Índices
-- =============================================
-- Índices para búsqueda por nombre
CREATE INDEX IF NOT EXISTS idx_students_names ON students (first_name, father_last_name, mother_last_name);

CREATE INDEX IF NOT EXISTS idx_teachers_names ON teachers (first_name, father_last_name, mother_last_name);

CREATE INDEX IF NOT EXISTS idx_tutors_names ON tutors (first_name, father_last_name, mother_last_name);

-- Índices para búsqueda por identificadores únicos
CREATE INDEX IF NOT EXISTS idx_students_curp ON students (curp);

CREATE INDEX IF NOT EXISTS idx_teachers_curp ON teachers (curp);

CREATE INDEX IF NOT EXISTS idx_user_email ON users (email);

-- Índices para búsqueda por escuela
CREATE INDEX IF NOT EXISTS idx_students_school ON students (school_id);

CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers (school_id);

CREATE INDEX IF NOT EXISTS idx_groups_school ON groups (school_id);

CREATE INDEX IF NOT EXISTS idx_subjects_school ON subjects (school_id);

CREATE INDEX IF NOT EXISTS idx_school_years_school ON school_years (school_id);

-- Índices para búsqueda por estado
CREATE INDEX IF NOT EXISTS idx_school_years_status ON school_years (status_id);

CREATE INDEX IF NOT EXISTS idx_groups_status ON groups (status_id);

CREATE INDEX IF NOT EXISTS idx_student_groups_status ON student_groups (status_id);

CREATE INDEX IF NOT EXISTS idx_evaluation_periods_status ON evaluation_periods (status_id);

-- Índices para registros activos
CREATE INDEX IF NOT EXISTS idx_active_students ON students (delete_flag)
WHERE
    delete_flag = FALSE;

CREATE INDEX IF NOT EXISTS idx_active_teachers ON teachers (delete_flag)
WHERE
    delete_flag = FALSE;

CREATE INDEX IF NOT EXISTS idx_active_tutors ON tutors (delete_flag)
WHERE
    delete_flag = FALSE;

CREATE INDEX IF NOT EXISTS idx_active_schools ON schools (delete_flag)
WHERE
    delete_flag = FALSE;

-- Índices para relaciones
CREATE INDEX IF NOT EXISTS idx_student_groups_group ON student_groups (group_id);

CREATE INDEX IF NOT EXISTS idx_student_groups_student ON student_groups (student_id);

CREATE INDEX IF NOT EXISTS idx_student_tutors_student ON student_tutors (student_id);

CREATE INDEX IF NOT EXISTS idx_student_tutors_tutor ON student_tutors (tutor_id);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses (user_id);

CREATE INDEX IF NOT EXISTS idx_addresses_postal_code ON addresses (postal_code);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_events_school ON events (school_id);

CREATE INDEX IF NOT EXISTS idx_events_dates ON events (start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_events_status ON events (status_id);

CREATE INDEX IF NOT EXISTS idx_event_recipients_event ON event_recipients (event_id);

CREATE INDEX IF NOT EXISTS idx_events_school_year ON events (school_year_id);

CREATE INDEX IF NOT EXISTS idx_event_recipients_role ON event_recipients (role_id);

CREATE INDEX IF NOT EXISTS idx_event_recipients_recipient ON event_recipients (recipient_id, recipient_type)
WHERE
    recipient_id IS NOT NULL
    AND recipient_type IS NOT NULL;

-- =============================================
-- Seguridad y Permisos
-- =============================================
-- Habilitar Row Level Security (RLS)
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

ALTER TABLE student_groups ENABLE ROW LEVEL SECURITY;

ALTER TABLE group_subjects ENABLE ROW LEVEL SECURITY;

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

ALTER TABLE status ENABLE ROW LEVEL SECURITY;

ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

ALTER TABLE event_recipients ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Acceso total a user_addresses" ON user_addresses;

DROP POLICY IF EXISTS "Acceso total a profesores" ON teachers;

DROP POLICY IF EXISTS "Acceso total a grupos" ON groups;

DROP POLICY IF EXISTS "Acceso total a materias" ON subjects;

DROP POLICY IF EXISTS "Acceso total a student_groups" ON student_groups;

DROP POLICY IF EXISTS "Acceso total a group_subjects" ON group_subjects;

DROP POLICY IF EXISTS "Acceso total a calificaciones" ON grades;

-- Crear políticas de acceso
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

CREATE POLICY "Acceso total a tipos de eventos" ON event_types FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a eventos" ON events FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acceso total a destinatarios de eventos" ON event_recipients FOR ALL USING (true)
WITH
    CHECK (true);

-- Otorgar permisos
GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA public TO authenticated;

GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA public TO anon;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;

COMMIT;