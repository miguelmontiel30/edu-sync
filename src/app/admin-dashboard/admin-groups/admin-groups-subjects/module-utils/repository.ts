// Utils
import {formatTeacherData} from './utils';
// Queries
import {
    getAvailableSubjects,
    assignTeacherToGroupSubject,
    removeTeacherFromGroupSubject,
    createGroupSubjectAssignment,
    deleteGroupSubject,
    getAllTeachers,
    getGroupSubjectsWithRelations,
    getDeletedGroupSubjects,
    restoreGroupSubject,
} from './queries';
// Types
import {GroupSubjectAssignment, RepositoryResponse, DeletedGroupSubject} from './types';

// Interfaz del repositorio
export interface IGroupTeachersRepository {
    getGroupTeacherAssignments(
        groupId: number,
        schoolId: number,
    ): Promise<GroupSubjectAssignment[]>;
    getDeletedGroupSubjects(groupId: number): Promise<DeletedGroupSubject[]>;
    getAllTeachers(schoolId: number): Promise<any[]>;
    getAvailableSubjectsForGroup(schoolId: number): Promise<any[]>;
    assignTeacherToSubject(groupSubjectId: number, teacherId: number): Promise<RepositoryResponse>;
    removeTeacherFromSubject(groupSubjectId: number): Promise<RepositoryResponse>;
    createSubjectAssignment(
        groupId: number,
        subjectId: number,
        teacherId: number | null,
    ): Promise<RepositoryResponse>;
    deleteSubjectFromGroup(groupSubjectId: number, userId?: number): Promise<RepositoryResponse>;
    restoreSubjectToGroup(groupSubjectId: number): Promise<RepositoryResponse>;
}

/**
 * Repositorio para gestionar asignaciones de profesores a grupos y materias
 */
export class SupabaseGroupTeachersRepository implements IGroupTeachersRepository {
    /**
     * Obtiene las asignaciones de profesores a materias en un grupo
     */
    async getGroupTeacherAssignments(groupId: number): Promise<GroupSubjectAssignment[]> {
        try {
            const {data: groupSubjects, error} = await getGroupSubjectsWithRelations(groupId);

            if (error) throw error;
            if (!groupSubjects || groupSubjects.length === 0) return [];

            // Formatear datos para la estructura esperada
            return groupSubjects.map(
                (item: any): GroupSubjectAssignment => ({
                    id: item.group_subject_id,
                    group_subject_id: item.group_subject_id,
                    subject_id: item.subject_id,
                    teacher_id: item.teacher_id,
                    delete_flag: item.delete_flag,
                    student_count: item.student_count || 0,
                    group: {
                        id: item.groups.group_id,
                        grade: item.groups.grade,
                        group: item.groups.group_name,
                        status: {
                            id: item.groups.status_id,
                            name: item.groups.status.name,
                            code: item.groups.status.code,
                        },
                    },
                    subject: {
                        subject_id: item.subjects.subject_id,
                        name: item.subjects.name,
                        description: item.subjects.description,
                        status: {
                            id: item.subjects.status_id,
                            name: item.subjects.status?.name,
                            code: item.subjects.status?.code,
                        },
                    },
                    teacherData:
                        item.teacher_id && item.teachers
                            ? {
                                  teacher_id: item.teachers.teacher_id,
                                  first_name: item.teachers.first_name,
                                  father_last_name: item.teachers.father_last_name,
                                  mother_last_name: item.teachers.mother_last_name,
                                  gender_id: item.teachers.gender_id,
                                  email: item.teachers.email,
                                  phone: item.teachers.phone,
                                  image_url: item.teachers.image_url,
                                  curp: item.teachers.curp,
                              }
                            : null,
                }),
            );
        } catch (error) {
            console.error('Error al obtener asignaciones del grupo:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los profesores de una escuela
     */
    async getAllTeachers(schoolId: number): Promise<any[]> {
        try {
            const {data, error} = await getAllTeachers(schoolId);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            return data.map(teacher => formatTeacherData(teacher));
        } catch (error) {
            console.error('Error al obtener profesores:', error);
            throw error;
        }
    }

    /**
     * Obtiene materias disponibles para un grupo
     */
    async getAvailableSubjectsForGroup(schoolId: number): Promise<any[]> {
        try {
            const {data, error} = await getAvailableSubjects(schoolId);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            return data;
        } catch (error) {
            console.error('Error al obtener materias disponibles:', error);
            throw error;
        }
    }

    /**
     * Asigna un profesor a una materia en un grupo
     */
    async assignTeacherToSubject(
        groupSubjectId: number,
        teacherId: number,
    ): Promise<RepositoryResponse> {
        try {
            const {error} = await assignTeacherToGroupSubject(groupSubjectId, teacherId);
            if (error) throw error;
            return {success: true};
        } catch (error) {
            console.error('Error al asignar profesor a materia:', error);
            return {success: false, error};
        }
    }

    /**
     * Elimina la asignación de un profesor a una materia
     */
    async removeTeacherFromSubject(groupSubjectId: number): Promise<RepositoryResponse> {
        try {
            const {error} = await removeTeacherFromGroupSubject(groupSubjectId);
            if (error) throw error;
            return {success: true};
        } catch (error) {
            console.error('Error al eliminar profesor de materia:', error);
            return {success: false, error};
        }
    }

    /**
     * Crea una nueva asignación de materia a grupo
     */
    async createSubjectAssignment(
        groupId: number,
        subjectId: number,
        teacherId: number | null,
    ): Promise<RepositoryResponse> {
        try {
            const {error} = await createGroupSubjectAssignment(groupId, subjectId, teacherId);

            if (error) throw error;

            return {success: true};
        } catch (error) {
            console.error('Error al crear asignación de materia:', error);
            return {success: false, error};
        }
    }

    /**
     * Elimina la asignación de una materia a un grupo
     */
    async deleteSubjectFromGroup(
        groupSubjectId: number,
        userId?: number,
    ): Promise<RepositoryResponse> {
        try {
            const {error} = await deleteGroupSubject(groupSubjectId, userId);
            if (error) throw error;
            return {success: true};
        } catch (error) {
            console.error('Error al eliminar materia del grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Obtiene materias eliminadas de un grupo
     */
    async getDeletedGroupSubjects(groupId: number): Promise<DeletedGroupSubject[]> {
        try {
            const {data, error} = await getDeletedGroupSubjects(groupId);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Formatear los datos al tipo requerido
            return data.map(
                (item: any): DeletedGroupSubject => ({
                    id: item.group_subject_id,
                    group_subject_id: item.group_subject_id,
                    subject_id: item.subject_id,
                    teacher_id: item.teacher_id,
                    subject: {
                        subject_id: item.subjects.subject_id,
                        name: item.subjects.name,
                        description: item.subjects.description,
                        status: {
                            id: item.subjects.status_id || 0,
                            name: '',
                            code: '',
                        },
                    },
                    teacher: item.teachers
                        ? {
                              teacher_id: item.teachers.teacher_id,
                              first_name: item.teachers.first_name,
                              father_last_name: item.teachers.father_last_name,
                              mother_last_name: item.teachers.mother_last_name || '',
                              gender_id: 0,
                              email: item.teachers.email || '',
                              phone: '',
                              image_url: item.teachers.image_url || undefined,
                              curp: '',
                          }
                        : undefined,
                    student_count: item.student_count || 0,
                    deleted_at: item.deleted_at,
                    deleted_by: item.deleted_by
                        ? {
                              id: item.deleted_by.id || 0,
                              name: item.deleted_by.name || 'Usuario',
                              email: item.deleted_by.email || '',
                          }
                        : undefined,
                }),
            );
        } catch (error) {
            console.error('Error al obtener materias eliminadas del grupo:', error);
            throw error;
        }
    }

    /**
     * Restaura una materia eliminada a un grupo
     */
    async restoreSubjectToGroup(groupSubjectId: number): Promise<RepositoryResponse> {
        try {
            const {error} = await restoreGroupSubject(groupSubjectId);
            if (error) throw error;
            return {success: true};
        } catch (error) {
            console.error('Error al restaurar materia al grupo:', error);
            return {success: false, error};
        }
    }
}
