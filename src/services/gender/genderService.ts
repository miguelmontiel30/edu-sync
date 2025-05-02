// Services
import {supabaseClient} from '../config/supabaseClient';

// Cache
import cacheService from '../cache/cacheService';

export interface Gender {
    gender_id: number;
    name: string;
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Caché key para los géneros
 */
export const GENDER_CACHE_KEY = 'genders';

/**
 * Servicio para obtener géneros desde la base de datos
 * con implementación de caché para reducir llamadas a la API
 */
class GenderService {
    /**
     * Obtiene todos los géneros con caché
     * @returns Lista de géneros
     */
    async getGenders(): Promise<Gender[]> {
        // Intentar obtener desde caché primero
        const cachedData = cacheService.get<Gender[]>(GENDER_CACHE_KEY);

        if (cachedData) {
            return cachedData;
        }

        // Si no hay caché, obtener desde Supabase
        const {data, error} = await supabaseClient
            .from('genders')
            .select('*')
            .eq('delete_flag', false);

        if (error) {
            console.error('Error obteniendo géneros:', error);
            throw error;
        }

        // Guardar en caché por 5 minutos (valor predeterminado)
        cacheService.set(GENDER_CACHE_KEY, data);

        return data;
    }

    /**
     * Limpia la caché de géneros
     */
    clearGenderCache(): void {
        cacheService.remove(GENDER_CACHE_KEY);
    }
}

export default new GenderService();
