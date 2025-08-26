// Queries
import {
    getStudentById,
    getUserByStudentId,
    getAddressesByUserId,
    getTutorsByStudentId,
    getGradesByStudentId,
    getGroupsByStudentId,
    updateStudentInfo,
} from './queries';

// Types
import {StudentProfile, Address, StudentTutor, Grade, StudentGroup} from './types';

// Utilidades
import {
    mapStudentData,
    mapAddressData,
    mapTutorData,
    mapGradeData,
    mapGroupData,
    generateMockPayments,
    generateMockGrades,
    generateMockAttendance,
    generateMockBadges,
} from './utils';

/**
 * Interfaz del repositorio de estudiantes
 */
export interface IStudentRepository {
    /** Obtiene el perfil completo de un estudiante */
    getStudentProfile(studentId: string): Promise<StudentProfile>;

    /** Actualiza la información básica de un estudiante */
    updateStudentInfo(studentId: number, data: any): Promise<{success: boolean; error?: any}>;
}

/**
 * Implementación del repositorio de estudiantes utilizando Supabase
 */
export class SupabaseStudentRepository implements IStudentRepository {
    /**
     * Obtiene el perfil completo de un estudiante
     * @param studentId ID del estudiante
     * @returns Perfil completo del estudiante con todas sus relaciones
     */
    async getStudentProfile(studentId: string): Promise<StudentProfile> {
        try {
            // Convertir studentId a número
            const numericStudentId = parseInt(studentId);

            // Obtener datos del estudiante desde la base de datos
            const {data: studentData, error: studentError} = await getStudentById(numericStudentId);
            if (studentError) throw studentError;

            // Buscar el usuario asociado al estudiante para obtener sus direcciones
            const {data: userData, error: userError} = await getUserByStudentId(numericStudentId);

            // Inicializar colecciones vacías
            let addresses: Address[] = [];
            let tutors: StudentTutor[] = [];
            let grades: Grade[] = [];
            let groups: StudentGroup[] = [];

            // Obtener direcciones si existe usuario asociado
            if (userData && !userError) {
                const {data: addressData, error: addressError} = await getAddressesByUserId(
                    userData.user_id,
                );
                if (!addressError && addressData) {
                    addresses = mapAddressData(addressData);
                }
            }

            // Obtener tutores desde la base de datos
            const {data: tutorData, error: tutorError} =
                await getTutorsByStudentId(numericStudentId);
            if (!tutorError && tutorData) {
                tutors = mapTutorData(tutorData, studentId);
            }

            // Obtener calificaciones desde la base de datos
            const {data: gradeData, error: gradeError} =
                await getGradesByStudentId(numericStudentId);
            if (!gradeError && gradeData) {
                grades = mapGradeData(gradeData);
            }

            // Obtener grupos desde la base de datos
            const {data: groupData, error: groupError} =
                await getGroupsByStudentId(numericStudentId);
            if (!groupError && groupData) {
                groups = mapGroupData(groupData, studentId);
            }

            // Generar datos de prueba para entidades que no existen en la base de datos
            // o usar datos reales si están vacíos
            const mockPayments = generateMockPayments();
            const mockAttendance = generateMockAttendance(studentId, 30);
            const mockBadges = generateMockBadges(studentId);

            // Construir el objeto de perfil del estudiante
            const studentProfile: StudentProfile = {
                student: studentData ? mapStudentData(studentData) : null,
                addresses,
                tutors,
                payments: mockPayments,
                grades: grades.length > 0 ? grades : generateMockGrades(),
                attendance: mockAttendance,
                badges: mockBadges,
                groups,
            };

            return studentProfile;
        } catch (error) {
            console.error('Error fetching student data:', error);
            throw error;
        }
    }

    /**
     * Actualiza la información de un estudiante
     * @param studentId ID del estudiante
     * @param data Datos a actualizar
     * @returns Objeto indicando éxito o error
     */
    async updateStudentInfo(
        studentId: number,
        data: any,
    ): Promise<{success: boolean; error?: any}> {
        try {
            const {error} = await updateStudentInfo(studentId, data);
            if (error) throw error;
            return {success: true};
        } catch (error) {
            console.error('Error updating student info:', error);
            return {success: false, error};
        }
    }
}

// Instancia compartida del repositorio
export const studentRepository = new SupabaseStudentRepository();
