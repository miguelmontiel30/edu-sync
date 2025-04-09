import {useState, useEffect} from 'react';
import statusService, {Status} from '../services/status/statusService';

type StatusCategory = 'school_year' | 'group' | 'student_group' | 'evaluation_period';

/**
 * Hook para obtener datos de estado desde el servicio con caché
 * @param category Categoría de estados a obtener
 * @returns Estados, estado de carga y error si existe
 */
export function useStatusData(category: StatusCategory) {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let data: Status[] = [];

                switch (category) {
                    case 'school_year':
                        data = await statusService.getSchoolYearStatuses();
                        break;
                    case 'group':
                        data = await statusService.getGroupStatuses();
                        break;
                    case 'student_group':
                        data = await statusService.getStudentGroupStatuses();
                        break;
                    case 'evaluation_period':
                        data = await statusService.getEvaluationPeriodStatuses();
                        break;
                }

                setStatuses(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error('Error desconocido al obtener estados'),
                );
                console.error('Error en useStatusData:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [category]);

    return {statuses, isLoading, error};
}

/**
 * Hook para obtener un mapa de código a objeto Status para búsquedas rápidas
 * @param category Categoría de estados a obtener
 * @returns Mapa de códigos a objetos Status, estado de carga y error si existe
 */
export function useStatusMap(category: StatusCategory) {
    const {statuses, isLoading, error} = useStatusData(category);
    const [statusMap, setStatusMap] = useState<Record<string, Status>>({});

    useEffect(() => {
        if (statuses.length > 0) {
            const map = statuses.reduce<Record<string, Status>>((acc, status) => {
                acc[status.code] = status;
                return acc;
            }, {});

            setStatusMap(map);
        }
    }, [statuses]);

    return {statusMap, isLoading, error};
}

/**
 * Hook para obtener opciones de estado listas para usar en componentes select
 * @param category Categoría de estados a obtener
 * @returns Array de opciones { value, label }, estado de carga y error si existe
 */
export function useStatusOptions(category: StatusCategory) {
    const {statuses, isLoading, error} = useStatusData(category);
    const [options, setOptions] = useState<Array<{value: string; label: string}>>([]);

    useEffect(() => {
        if (statuses.length > 0) {
            const statusOptions = statuses.map(status => ({
                value: status.code,
                label: status.name,
            }));

            setOptions(statusOptions);
        }
    }, [statuses]);

    return {options, isLoading, error};
}

export default useStatusData;
