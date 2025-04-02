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

-- Trigger para actualizar el campo updated_at de la tabla schools
CREATE TRIGGER update_schools_updated_at BEFORE
UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para actualizar el campo updated_at de la tabla students
CREATE TRIGGER update_students_updated_at BEFORE
UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para actualizar el campo updated_at de la tabla teachers
CREATE TRIGGER update_teachers_updated_at BEFORE
UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para actualizar el campo updated_at de la tabla tutors
CREATE TRIGGER update_tutors_updated_at BEFORE
UPDATE ON tutors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para actualizar el campo updated_at de la tabla groups
CREATE TRIGGER update_groups_updated_at BEFORE
UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para actualizar el campo updated_at de la tabla group_subjects
CREATE TRIGGER update_group_subjects_updated_at BEFORE
UPDATE ON group_subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para actualizar el campo updated_at de la tabla evaluation_periods
CREATE TRIGGER update_evaluation_periods_updated_at BEFORE
UPDATE ON evaluation_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();