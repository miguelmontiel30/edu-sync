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