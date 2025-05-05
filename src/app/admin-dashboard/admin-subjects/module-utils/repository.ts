// Supabase Client
import {supabaseClient} from '@/services/config/supabaseClient';

// Types
import {DatabaseSubject, Subject, SubjectData} from './types';

// Utils
import {formatSubjectData} from './utils';

// Definición de la interfaz del repositorio
export interface ISubjectRepository {
    getAllSubjectsBySchoolId(schoolId: number): Promise<{active: Subject[]; deleted: Subject[]}>;
    getCurrentSchoolId(userId?: string): Promise<number>;
    saveSubject(subject: SubjectData, subjectId?: number, userId?: string): Promise<void>;
    deleteSubject(id: number): Promise<void>;
    restoreSubject(id: number): Promise<void>;
    getSubjectGrades(subjectId: number): Promise<{
        averageGrade: number;
    }>;
}

// Implementación de Supabase
export class SupabaseSubjectRepository implements ISubjectRepository {
    /**
     * Base query para obtener las materias
     * @returns QueryBuilder
     */
    private baseQuery() {
        return supabaseClient.from('subjects').select(`
                *,
                status (
                    status_id,
                    name
                ),
                group_subjects (
                    group_subject_id,
                    group_id,
                    teacher_id
                )
            `);
    }

    /**
     * Obtener todas las materias de una escuela
     * @param schoolId - ID de la escuela
     * @returns Lista de materias activas y eliminadas
     */
    async getAllSubjectsBySchoolId(
        schoolId: number,
    ): Promise<{active: Subject[]; deleted: Subject[]}> {
        try {
            const {data, error} = await this.baseQuery()
                .eq('school_id', schoolId)
                .order('created_at', {ascending: false});

            if (error) throw error;
            if (!data) return {active: [], deleted: []};

            // Procesamos todas las materias en paralelo
            const formattedSubjects: Subject[] = await Promise.all(
                data.map((subject: DatabaseSubject) => formatSubjectData(subject)),
            );

            // Calculamos las calificaciones promedio para cada materia
            const subjectsWithGrades = await Promise.all(
                formattedSubjects.map(async subject => {
                    const {averageGrade} = await this.getSubjectGrades(subject.id);
                    return {...subject, averageGrade};
                }),
            );

            // Filtramos después de procesar
            return {
                active: subjectsWithGrades.filter(subject => !subject.deleteFlag),
                deleted: subjectsWithGrades.filter(subject => subject.deleteFlag),
            };
        } catch (error) {
            console.error('Error al cargar las materias:', error);
            throw error;
        }
    }

    /**
     * Obtener el ID de la escuela del usuario
     * @param userId - ID del usuario (opcional, se obtiene de la sesión si no se proporciona)
     * @returns ID de la escuela
     */
    async getCurrentSchoolId(userId?: string): Promise<number> {
        try {
            let userIdToUse = userId;

            // Si no se proporcionó un userId, intentamos obtenerlo de la sesión
            if (!userIdToUse) {
                const {data: sessionData} = await supabaseClient.auth.getSession();

                if (!sessionData?.session?.user) {
                    throw new Error('No hay una sesión activa o usuario válido');
                }

                userIdToUse = sessionData.session.user.id;
            }

            // Obtener el ID de la escuela del usuario
            const {data: userData, error: userError} = await supabaseClient
                .from('users')
                .select('school_id')
                .eq('user_id', userIdToUse)
                .single();

            if (userError || !userData?.school_id) {
                throw new Error('No se pudo obtener el ID de la escuela del usuario');
            }

            return userData.school_id;
        } catch (error) {
            console.error('Error al obtener el ID de la escuela:', error);
            throw error;
        }
    }

    /**
     * Guardar una materia
     * @param subject - Materia a guardar
     * @param subjectId - ID de la materia (opcional)
     * @param userId - ID del usuario (opcional)
     */
    async saveSubject(subject: SubjectData, subjectId?: number, userId?: string): Promise<void> {
        try {
            const schoolId = await this.getCurrentSchoolId(userId);

            if (subjectId) {
                // Actualizar materia existente
                const {error} = await supabaseClient
                    .from('subjects')
                    .update({
                        name: subject.name,
                        description: subject.description,
                        status_id: subject.status_id,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('subject_id', subjectId);

                if (error) throw error;
            } else {
                // Crear nueva materia
                const {error} = await supabaseClient
                    .from('subjects')
                    .insert([
                        {
                            name: subject.name,
                            description: subject.description,
                            school_id: schoolId,
                            status_id: subject.status_id,
                        },
                    ])
                    .select();

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error al guardar la materia:', error);
            throw error;
        }
    }

    /**
     * Eliminar una materia
     * @param id - ID de la materia
     */
    async deleteSubject(id: number): Promise<void> {
        try {
            const {error} = await supabaseClient
                .from('subjects')
                .update({
                    delete_flag: true,
                    deleted_at: new Date().toISOString(),
                })
                .eq('subject_id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error al eliminar la materia:', error);
            throw error;
        }
    }

    /**
     * Restaurar una materia
     * @param id - ID de la materia
     */
    async restoreSubject(id: number): Promise<void> {
        try {
            const {error} = await supabaseClient
                .from('subjects')
                .update({
                    delete_flag: false,
                    deleted_at: null,
                })
                .eq('subject_id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error al restaurar la materia:', error);
            throw error;
        }
    }

    /**
     * Obtener las calificaciones de una materia
     * @param subjectId - ID de la materia
     * @returns Objeto con el promedio de calificaciones
     */
    async getSubjectGrades(subjectId: number): Promise<{averageGrade: number}> {
        try {
            // Primero obtener los group_subject_id relacionados con esta materia
            const {data: groupSubjects} = await supabaseClient
                .from('group_subjects')
                .select('group_subject_id')
                .eq('subject_id', subjectId)
                .eq('delete_flag', false);

            if (!groupSubjects || groupSubjects.length === 0) {
                return {averageGrade: 0};
            }

            const groupSubjectIds = groupSubjects.map(gs => gs.group_subject_id);

            // Luego obtener los evaluation_period_id relacionados
            const {data: evaluationPeriods} = await supabaseClient
                .from('evaluation_periods')
                .select('evaluation_period_id')
                .in('group_subject_id', groupSubjectIds)
                .eq('delete_flag', false);

            if (!evaluationPeriods || evaluationPeriods.length === 0) {
                return {averageGrade: 0};
            }

            const evaluationPeriodIds = evaluationPeriods.map(ep => ep.evaluation_period_id);

            // Finalmente obtener las calificaciones
            const {data: gradesData, error} = await supabaseClient
                .from('grades')
                .select('grade')
                .in('evaluation_period_id', evaluationPeriodIds)
                .eq('delete_flag', false);

            if (error) throw error;
            if (!gradesData || gradesData.length === 0) return {averageGrade: 0};

            // Calcular promedio
            const totalGrade = gradesData.reduce(
                (sum, grade) => sum + (typeof grade.grade === 'number' ? grade.grade : 0),
                0,
            );

            return {averageGrade: Number((totalGrade / gradesData.length).toFixed(2))};
        } catch (error) {
            console.error('Error al obtener calificaciones:', error);
            return {averageGrade: 0};
        }
    }
}

// Creamos una instancia del repositorio de Supabase
export const subjectRepository = new SupabaseSubjectRepository();
