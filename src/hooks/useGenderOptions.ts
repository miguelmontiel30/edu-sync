// React
import {useState, useEffect} from 'react';

// Services
import genderService, {Gender} from '../services/gender/genderService';

/**
 * Hook para obtener datos de género desde el servicio con caché
 * @returns Lista de géneros, estado de carga y error si existe
 */
export function useGenderData() {
    const [genders, setGenders] = useState<Gender[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await genderService.getGenders();
                setGenders(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error('Error desconocido al obtener géneros'),
                );
                console.error('Error en useGenderData:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return {genders, isLoading, error};
}

/**
 * Hook para obtener un mapa de id a objeto Gender para búsquedas rápidas
 * @returns Mapa de ids a objetos Gender, estado de carga y error si existe
 */
export function useGenderMap() {
    const {genders, isLoading, error} = useGenderData();
    const [genderMap, setGenderMap] = useState<Record<string, Gender>>({});

    useEffect(() => {
        if (genders.length > 0) {
            const map = genders.reduce<Record<string, Gender>>((acc, gender) => {
                acc[gender.gender_id.toString()] = gender;
                return acc;
            }, {});

            setGenderMap(map);
        }
    }, [genders]);

    return {genderMap, isLoading, error};
}

/**
 * Hook para obtener opciones de género listas para usar en componentes select
 * @returns Array de opciones { value, label }, estado de carga y error si existe
 */
export function useGenderOptions() {
    const {genders, isLoading, error} = useGenderData();
    const [options, setOptions] = useState<Array<{value: string; label: string}>>([]);

    useEffect(() => {
        if (genders.length > 0) {
            const genderOptions = genders.map(gender => ({
                value: gender.gender_id.toString(),
                label: gender.name,
            }));

            setOptions(genderOptions);
        }
    }, [genders]);

    return {options, isLoading, error};
}

export default useGenderOptions;
