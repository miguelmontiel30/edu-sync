import {supabaseClient} from '../config/supabaseClient';
import cacheService from '../cache/cacheService';

export interface Status {
    status_id: number;
    code: string;
    name: string;
    category: string;
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Caché keys para los diferentes tipos de estados
 */
export const STATUS_CACHE_KEYS = {
    SCHOOL_YEAR: 'status_school_year',
    GROUP: 'status_group',
    STUDENT_GROUP: 'status_student_group',
    EVALUATION_PERIOD: 'status_evaluation_period',
    STUDENT: 'status_student',
    SUBJECT: 'status_subject',
};

/**
 * Servicio para obtener estados desde la base de datos
 * con implementación de caché para reducir llamadas a la API
 */
class StatusService {
    /**
     * Método genérico para obtener estados por categoría
     * @param category Categoría de estados a obtener
     * @param cacheKey Clave para usar en la caché
     * @returns Lista de estados
     */
    async getStatusesByCategory(category: string, cacheKey: string): Promise<Status[]> {
        // Intentar obtener desde caché primero
        const cachedData = cacheService.get<Status[]>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        // Si no hay caché, obtener desde Supabase
        const {data, error} = await supabaseClient
            .from('status')
            .select('*')
            .eq('category', category);

        if (error) {
            console.error(`Error obteniendo estados de ${category}:`, error);
            throw error;
        }

        // Guardar en caché por 5 minutos (valor predeterminado)
        cacheService.set(cacheKey, data);

        return data;
    }

    /**
     * Obtiene los estados para ciclos escolares con caché
     * @returns Lista de estados para ciclos escolares
     */
    async getSchoolYearStatuses(): Promise<Status[]> {
        return await this.getStatusesByCategory('school_year', STATUS_CACHE_KEYS.SCHOOL_YEAR);
    }

    /**
     * Obtiene los estados para grupos con caché
     * @returns Lista de estados para grupos
     */
    async getGroupStatuses(): Promise<Status[]> {
        return await this.getStatusesByCategory('group', STATUS_CACHE_KEYS.GROUP);
    }

    /**
     * Obtiene los estados para estudiantes en grupos con caché
     * @returns Lista de estados para estudiantes en grupos
     */
    async getStudentGroupStatuses(): Promise<Status[]> {
        return await this.getStatusesByCategory('student_group', STATUS_CACHE_KEYS.STUDENT_GROUP);
    }

    /**
     * Obtiene los estados para periodos de evaluación con caché
     * @returns Lista de estados para periodos de evaluación
     */
    async getEvaluationPeriodStatuses(): Promise<Status[]> {
        return await this.getStatusesByCategory(
            'evaluation_period',
            STATUS_CACHE_KEYS.EVALUATION_PERIOD,
        );
    }

    /**
     * Obtiene los estados para estudiantes con caché
     * @returns Lista de estados para estudiantes
     */
    async getStudentStatuses(): Promise<Status[]> {
        return await this.getStatusesByCategory('student', STATUS_CACHE_KEYS.STUDENT);
    }

    /**
     * Limpia la caché de todos los estados
     */
    clearStatusCache(): void {
        Object.values(STATUS_CACHE_KEYS).forEach(key => {
            cacheService.remove(key);
        });
    }

    async getSubjectStatuses(): Promise<Status[]> {
        return await this.getStatusesByCategory('subject', STATUS_CACHE_KEYS.SUBJECT);
    }
}

export default new StatusService();
