// Supabase Client
import {supabaseClient} from '@/services/config/supabaseClient';

// Tipos
import {Student} from '@/app/admin-dashboard/admin-students/module-utils/types';

// Definición de la interfaz del repositorio
export interface IGroupStudentsRepository {
    getActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]>;
    assignStudentsToGroup(
        groupId: number,
        studentIds: number[],
    ): Promise<{success: boolean; error?: any}>;
    removeStudentFromGroup(studentGroupId: number): Promise<{success: boolean; error?: any}>;
    updateStudentGroupStatus(
        studentGroupId: number,
        statusId: number,
    ): Promise<{success: boolean; error?: any}>;
    getStudentCountInGroup(groupId: number): Promise<number>;
}

/**
 * Repositorio para gestionar asignaciones de estudiantes a grupos
 */
export class GroupStudentsRepository implements IGroupStudentsRepository {
    /**
     * Base query optimizada para obtener grupos con sus relaciones
     * @returns QueryBuilder
     */
    private baseGroupQuery() {
        return supabaseClient.from('groups').select(`
            *,
            school_year:school_year_id (
                id:school_year_id,
                name,
                status
            ),
            status:status_id (
                status_id,
                code,
                name
            ),
            student_groups:student_groups (
                student_group_id,
                student_id,
                enrollment_date,
                status_id
            )
        `);
    }

    /**
     * Base query para obtener estudiantes con sus relaciones
     * @returns QueryBuilder
     */
    private baseStudentQuery() {
        return supabaseClient.from('students').select(`
            *,
            gender:gender_id (
                gender_id,
                code,
                name
            ),
            status:status_id (
                status_id,
                code,
                name,
                category
            )
        `);
    }

    /**
     * Obtiene los estudiantes activos que están asignados a un grupo específico
     * @param groupId - El ID del grupo para el cual se desea obtener los estudiantes
     * @param schoolId - El ID de la escuela para la cual se desea obtener los estudiantes
     * @returns Un array de estudiantes activos asignados al grupo seleccionado
     */
    async getActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
        try {
            // Obtenemos los IDs de estudiantes asignados al grupo seleccionado
            const {data: assignedStudents, error: assignedError} = await supabaseClient
                .from('student_groups')
                .select('student_id')
                .eq('delete_flag', false)
                .eq('group_id', groupId);

            if (assignedError) throw assignedError;
            if (!assignedStudents || assignedStudents.length === 0) return [];

            // Extraemos los IDs de estudiantes asignados
            const studentIds = assignedStudents.map(sg => sg.student_id);

            // Consultamos los detalles completos de estos estudiantes
            const {data, error} = await this.baseStudentQuery()
                .eq('delete_flag', false)
                .eq('school_id', schoolId)
                .in('student_id', studentIds)
                .order('first_name', {ascending: true});

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Transformamos directamente los datos para el formato esperado Student
            return data.map(student => ({
                id: student.student_id,
                school_id: student.school_id,
                first_name: student.first_name,
                father_last_name: student.father_last_name,
                mother_last_name: student.mother_last_name,
                birth_date: student.birth_date,
                gender_id: student.gender_id,
                gender: student.gender
                    ? {
                          id: student.gender.gender_id,
                          code: student.gender.code,
                          name: student.gender.name,
                      }
                    : undefined,
                curp: student.curp,
                phone: student.phone,
                email: student.email,
                image_url: student.image_url,
                status_id: student.status_id,
                status: student.status
                    ? {
                          status_id: student.status.status_id,
                          code: student.status.code,
                          name: student.status.name,
                          category: student.status.category,
                      }
                    : undefined,
                delete_flag: student.delete_flag,
                created_at: student.created_at,
                updated_at: student.updated_at,
                deleted_at: student.deleted_at,
            }));
        } catch (error) {
            console.error('Error al obtener estudiantes disponibles:', error);
            throw error;
        }
    }

    /**
     * Asigna múltiples estudiantes a un grupo
     * @param groupId ID del grupo
     * @param studentIds IDs de los estudiantes a asignar
     * @returns Resultado de la operación
     */
    async assignStudentsToGroup(
        groupId: number,
        studentIds: number[],
    ): Promise<{success: boolean; error?: any}> {
        try {
            // Verificamos que haya estudiantes para asignar
            if (!studentIds || studentIds.length === 0) {
                return {success: false, error: 'No se proporcionaron estudiantes para asignar'};
            }

            // Preparamos los registros a insertar
            const currentDate = new Date().toISOString();
            const studentGroupRecords = studentIds.map(studentId => ({
                student_id: studentId,
                group_id: groupId,
                enrollment_date: currentDate.split('T')[0], // Formato YYYY-MM-DD
                status_id: 1, // Estado activo
                delete_flag: false,
                created_at: currentDate,
                updated_at: currentDate,
            }));

            // Insertamos los registros en la tabla student_groups
            const {error} = await supabaseClient.from('student_groups').insert(studentGroupRecords);

            if (error) {
                console.error('Error al asignar estudiantes al grupo:', error);
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al asignar estudiantes al grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Elimina un estudiante de un grupo (borrado lógico)
     * @param studentGroupId ID de la relación estudiante-grupo
     * @returns Resultado de la operación
     */
    async removeStudentFromGroup(studentGroupId: number): Promise<{success: boolean; error?: any}> {
        try {
            const currentDate = new Date().toISOString();

            const {error} = await supabaseClient
                .from('student_groups')
                .update({
                    delete_flag: true,
                    updated_at: currentDate,
                    deleted_at: currentDate,
                })
                .eq('student_group_id', studentGroupId);

            if (error) {
                console.error('Error al eliminar estudiante del grupo:', error);
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al eliminar estudiante del grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Actualiza el estado de un estudiante en un grupo
     * @param studentGroupId ID de la relación estudiante-grupo
     * @param statusId Nuevo ID de estado
     * @returns Resultado de la operación
     */
    async updateStudentGroupStatus(
        studentGroupId: number,
        statusId: number,
    ): Promise<{success: boolean; error?: any}> {
        try {
            const {error} = await supabaseClient
                .from('student_groups')
                .update({
                    status_id: statusId,
                    updated_at: new Date().toISOString(),
                })
                .eq('student_group_id', studentGroupId);

            if (error) {
                console.error('Error al actualizar estado del estudiante en el grupo:', error);
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al actualizar estado del estudiante en el grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Obtiene el conteo de estudiantes por grupo
     * @param groupId ID del grupo
     * @returns Número de estudiantes en el grupo
     */
    async getStudentCountInGroup(groupId: number): Promise<number> {
        try {
            const {count, error} = await supabaseClient
                .from('student_groups')
                .select('*', {count: 'exact', head: true})
                .eq('group_id', groupId)
                .eq('delete_flag', false)
                .eq('status_id', 1); // Estado activo

            if (error) throw error;

            return count || 0;
        } catch (error) {
            console.error('Error al obtener conteo de estudiantes:', error);
            return 0;
        }
    }
}

// Creamos una instancia única del repositorio
export const groupStudentsRepository = new GroupStudentsRepository();
