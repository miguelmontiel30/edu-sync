// Types
import {
    Student,
    StudentFormData,
    StudentGroup,
    StudentFilterOptions,
    StudentMetrics,
} from './types';

// Utils
import { calculateStudentMetrics, filterStudents, sortStudents, prepareStudentData } from './utils';

// Supabase Client
import { supabaseClient } from '@/services/config/supabaseClient';

// Definición de la interfaz del repositorio
export interface IStudentRepository {
    getActiveStudents(schoolId: number): Promise<Student[]>;
    getDeletedStudents(): Promise<Student[]>;
    saveStudent(studentData: StudentFormData): Promise<number>;
    deleteStudent(studentId: number): Promise<void>;
    restoreStudent(studentId: number): Promise<void>;
    getStudentGroups(studentId: number): Promise<StudentGroup[]>;
    getAllActiveStudentGroups(): Promise<StudentGroup[]>;
    filterStudentsList(students: Student[], filterOptions: StudentFilterOptions): Student[];
    sortStudentsList(
        students: Student[],
        sortField: keyof Student,
        sortDirection: 'asc' | 'desc',
    ): Student[];
    calculateMetrics(students: Student[], studentGroups?: StudentGroup[]): StudentMetrics;
}

// Implementación de Supabase
export class SupabaseStudentRepository implements IStudentRepository {
    /**
     * Base query optimizada para obtener estudiantes con sus relaciones
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
     * Obtiene la lista de estudiantes activos (no eliminados)
     */
    async getActiveStudents(schoolId: number): Promise<Student[]> {
        try {
            // Consulta optimizada usando join en vez de consultas separadas
            const { data, error } = await this.baseStudentQuery()
                .eq('delete_flag', false)
                .eq('school_id', schoolId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Procesamos los datos recibidos
            return data.map((student: any) =>
                prepareStudentData({
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
                }),
            );
        } catch (error) {
            console.error('Error al cargar los estudiantes activos:', error);
            throw error;
        }
    }

    /**
     * Obtiene la lista de estudiantes eliminados lógicamente
     */
    async getDeletedStudents(): Promise<Student[]> {
        try {
            // Consulta optimizada usando join en vez de consultas separadas
            const { data, error } = await this.baseStudentQuery()
                .eq('delete_flag', true)
                .order('deleted_at', { ascending: false });

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Procesamos los datos recibidos
            return data.map((student: any) =>
                prepareStudentData({
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
                }),
            );
        } catch (error) {
            console.error('Error al cargar los estudiantes eliminados:', error);
            throw error;
        }
    }

    /**
     * Guarda un estudiante (crear o actualizar)
     */
    async saveStudent(studentData: StudentFormData): Promise<number> {
        try {
            // Verificar si el estudiante ya existe por CURP (solo para nuevos estudiantes)
            if (!studentData.id) {
                const { data: existingStudent } = await supabaseClient
                    .from('students')
                    .select('student_id')
                    .eq('curp', studentData.curp)
                    .eq('delete_flag', false)
                    .maybeSingle();

                if (existingStudent) {
                    throw new Error(`Ya existe un estudiante con la CURP ${studentData.curp}`);
                }
            }

            const dataToSave = {
                school_id: 1, // TODO: Obtener de contexto/session
                first_name: studentData.first_name,
                father_last_name: studentData.father_last_name,
                mother_last_name: studentData.mother_last_name,
                birth_date: studentData.birth_date,
                gender_id: studentData.gender_id,
                curp: studentData.curp,
                phone: studentData.phone || null,
                email: studentData.email || null,
                image_url: studentData.image_url || null,
                ...(studentData.status_id ? { status_id: studentData.status_id } : {}),
                updated_at: new Date().toISOString(),
            };

            if (studentData.id) {
                // Actualizar
                const { error } = await supabaseClient
                    .from('students')
                    .update(dataToSave)
                    .eq('student_id', studentData.id);

                if (error) throw error;
                return studentData.id;
            } else {
                // Valor por defecto para status_id si no se proporciona (7 = STUDENT_ACTIVE)
                if (!dataToSave.status_id) {
                    dataToSave.status_id = 7;
                }

                // Crear
                const { data, error } = await supabaseClient
                    .from('students')
                    .insert(dataToSave)
                    .select('student_id');

                if (error) throw error;
                return data?.[0]?.student_id;
            }
        } catch (error) {
            console.error('Error al guardar el estudiante:', error);
            throw error;
        }
    }

    /**
     * Elimina lógicamente un estudiante
     */
    async deleteStudent(studentId: number): Promise<void> {
        try {
            const { error } = await supabaseClient
                .from('students')
                .update({
                    delete_flag: true,
                    deleted_at: new Date().toISOString(),
                })
                .eq('student_id', studentId);

            if (error) throw error;
        } catch (error) {
            console.error('Error al eliminar el estudiante:', error);
            throw error;
        }
    }

    /**
     * Restaura un estudiante eliminado
     */
    async restoreStudent(studentId: number): Promise<void> {
        try {
            const { error } = await supabaseClient
                .from('students')
                .update({
                    delete_flag: false,
                    deleted_at: null,
                })
                .eq('student_id', studentId);

            if (error) throw error;
        } catch (error) {
            console.error('Error al restaurar el estudiante:', error);
            throw error;
        }
    }

    /**
     * Obtiene los grupos asignados a un estudiante
     */
    async getStudentGroups(studentId: number): Promise<StudentGroup[]> {
        try {
            // Una sola consulta con joins anidados en vez de múltiples consultas
            const { data, error } = await supabaseClient
                .from('student_groups')
                .select(
                    `
                    *,
                    status:status_id (
                        status_id,
                        name,
                        code,
                        category
                    ),
                    group:group_id (
                        group_id,
                        grade,
                        group_name,
                        school_year_id,
                        school_year:school_year_id (
                            school_year_id,
                            name
                        )
                    )
                `,
                )
                .eq('student_id', studentId)
                .eq('delete_flag', false);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Procesamos los datos ya estructurados
            return data.map(sg => ({
                id: sg.student_group_id,
                student_id: sg.student_id,
                group_id: sg.group_id,
                enrollment_date: sg.enrollment_date,
                status_id: sg.status_id,
                status: sg.status,
                group: sg.group,
                delete_flag: sg.delete_flag,
                created_at: sg.created_at,
                updated_at: sg.updated_at,
                deleted_at: sg.deleted_at,
            }));
        } catch (error) {
            console.error('Error al cargar los grupos del estudiante:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los grupos de estudiantes activos
     */
    async getAllActiveStudentGroups(): Promise<StudentGroup[]> {
        try {
            // Consulta optimizada con joins anidados
            const { data, error } = await supabaseClient
                .from('student_groups')
                .select(
                    `
                    *,
                    student:student_id(
                        student_id, 
                        first_name, 
                        father_last_name, 
                        mother_last_name
                    ),
                    group:group_id(
                        group_id, 
                        grade, 
                        group_name, 
                        school_year_id, 
                        school_year:school_year_id(
                            school_year_id, 
                            name
                        )
                    ),
                    status:status_id(
                        status_id, 
                        name, 
                        code,
                        category
                    )
                `,
                )
                .eq('delete_flag', false);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Procesamos los datos para el formato correcto
            return data.map(item => ({
                id: item.student_group_id,
                student_id: item.student_id,
                group_id: item.group_id,
                enrollment_date: item.enrollment_date,
                status_id: item.status_id,
                status: item.status,
                group: item.group,
                delete_flag: item.delete_flag,
                created_at: item.created_at,
                updated_at: item.updated_at,
                deleted_at: item.deleted_at,
            }));
        } catch (error) {
            console.error('Error al cargar todos los grupos de estudiantes:', error);
            throw error;
        }
    }

    /**
     * Filtra una lista de estudiantes según las opciones especificadas
     */
    filterStudentsList(students: Student[], filterOptions: StudentFilterOptions = {}): Student[] {
        return filterStudents(students, filterOptions);
    }

    /**
     * Ordena una lista de estudiantes según el campo y dirección
     */
    sortStudentsList(
        students: Student[],
        sortField: keyof Student,
        sortDirection: 'asc' | 'desc',
    ): Student[] {
        return sortStudents(students, sortField, sortDirection);
    }

    /**
     * Calcula métricas de estudiantes para los tableros
     */
    calculateMetrics(students: Student[], studentGroups?: StudentGroup[]): StudentMetrics {
        return calculateStudentMetrics(students, studentGroups);
    }
}

// Creamos una instancia del repositorio de Supabase
export const studentRepository = new SupabaseStudentRepository();
