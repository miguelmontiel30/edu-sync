/***
 * Triggers para crear usuarios a partir de entidades de estudiantes, profesores y tutores
 */
-- =============================================
-- Trigger para la tabla de estudiantes
-- Crea automáticamente un usuario cuando se inserta un nuevo estudiante
-- =============================================
DROP TRIGGER IF EXISTS create_user_from_student ON students;

CREATE TRIGGER create_user_from_student AFTER INSERT ON students FOR EACH ROW EXECUTE FUNCTION create_user_from_entity ();

-- =============================================
-- Trigger para la tabla de profesores
-- Crea automáticamente un usuario cuando se inserta un nuevo profesor
-- =============================================
DROP TRIGGER IF EXISTS create_user_from_teacher ON teachers;

CREATE TRIGGER create_user_from_teacher AFTER INSERT ON teachers FOR EACH ROW EXECUTE FUNCTION create_user_from_entity ();

-- =============================================
-- Trigger para la tabla de tutores
-- Crea automáticamente un usuario cuando se inserta un nuevo tutor
-- =============================================
DROP TRIGGER IF EXISTS create_user_from_tutor ON tutors;

CREATE TRIGGER create_user_from_tutor AFTER INSERT ON tutors FOR EACH ROW EXECUTE FUNCTION create_user_from_entity ();

-- =============================================
-- Triggers para actualización de updated_at
-- Actualiza automáticamente el campo updated_at cuando se modifica un registro
-- =============================================
-- Escuelas
DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;

CREATE TRIGGER update_schools_updated_at BEFORE
UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Usuarios
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Estudiantes
DROP TRIGGER IF EXISTS update_students_updated_at ON students;

CREATE TRIGGER update_students_updated_at BEFORE
UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Profesores
DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;

CREATE TRIGGER update_teachers_updated_at BEFORE
UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Tutores
DROP TRIGGER IF EXISTS update_tutors_updated_at ON tutors;

CREATE TRIGGER update_tutors_updated_at BEFORE
UPDATE ON tutors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Ciclos escolares
DROP TRIGGER IF EXISTS update_school_years_updated_at ON school_years;

CREATE TRIGGER update_school_years_updated_at BEFORE
UPDATE ON school_years FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Grupos
DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;

CREATE TRIGGER update_groups_updated_at BEFORE
UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Relación estudiantes-grupos
DROP TRIGGER IF EXISTS update_student_groups_updated_at ON student_groups;

CREATE TRIGGER update_student_groups_updated_at BEFORE
UPDATE ON student_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Materias
DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;

CREATE TRIGGER update_subjects_updated_at BEFORE
UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Materias por grupo
DROP TRIGGER IF EXISTS update_group_subjects_updated_at ON group_subjects;

CREATE TRIGGER update_group_subjects_updated_at BEFORE
UPDATE ON group_subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Periodos de evaluación
DROP TRIGGER IF EXISTS update_evaluation_periods_updated_at ON evaluation_periods;

CREATE TRIGGER update_evaluation_periods_updated_at BEFORE
UPDATE ON evaluation_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Calificaciones
DROP TRIGGER IF EXISTS update_grades_updated_at ON grades;

CREATE TRIGGER update_grades_updated_at BEFORE
UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Direcciones
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;

CREATE TRIGGER update_addresses_updated_at BEFORE
UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Direcciones de usuarios
DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON user_addresses;

CREATE TRIGGER update_user_addresses_updated_at BEFORE
UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Relación estudiantes-tutores
DROP TRIGGER IF EXISTS update_student_tutors_updated_at ON student_tutors;

CREATE TRIGGER update_student_tutors_updated_at BEFORE
UPDATE ON student_tutors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Estados
DROP TRIGGER IF EXISTS update_status_updated_at ON status;

CREATE TRIGGER update_status_updated_at BEFORE
UPDATE ON status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Tipos de dirección
DROP TRIGGER IF EXISTS update_address_types_updated_at ON address_types;

CREATE TRIGGER update_address_types_updated_at BEFORE
UPDATE ON address_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Géneros
DROP TRIGGER IF EXISTS update_genders_updated_at ON genders;

CREATE TRIGGER update_genders_updated_at BEFORE
UPDATE ON genders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Roles
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;

CREATE TRIGGER update_roles_updated_at BEFORE
UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Permisos
DROP TRIGGER IF EXISTS update_permissions_updated_at ON permissions;

CREATE TRIGGER update_permissions_updated_at BEFORE
UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();