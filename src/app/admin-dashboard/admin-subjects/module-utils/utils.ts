import { DatabaseSubject, Subject } from './types';

/**
 * Formatea los datos de una materia desde la base de datos para usar en la interfaz
 * @param subjectData - Datos de la materia desde la base de datos
 * @returns Datos formateados para la interfaz
 */
export function formatSubjectData(subjectData: DatabaseSubject): Subject {
    // Calcular contadores
    const groupsCount = subjectData.group_subjects?.length || 0;

    // Obtener conjunto único de profesores
    const uniqueTeachers = new Set(
        subjectData.group_subjects?.map(gs => gs.teacher_id).filter(Boolean) || [],
    );
    const teachersCount = uniqueTeachers.size;

    // Formatear datos para la interfaz
    return {
        id: subjectData.subject_id,
        name: subjectData.name,
        description: subjectData.description || '',
        groupsCount,
        teachersCount,
        averageGrade: 0, // Se calculará por separado mediante el servicio
        deleteFlag: subjectData.delete_flag || false,
        status_id: subjectData.status_id,
        status: subjectData.status,
    };
}

/**
 * Ordena un array de materias por un campo específico
 * @param subjects - Array de materias
 * @param field - Campo por el cual ordenar
 * @param direction - Dirección de ordenamiento ('asc' o 'desc')
 * @returns Array ordenado
 */
export function sortSubjects(
    subjects: Subject[],
    field: string,
    direction: 'asc' | 'desc' = 'asc',
): Subject[] {
    return [...subjects].sort((a, b) => {
        let comparison = 0;

        // Comparar basado en el campo
        if (field === 'name' || field === 'description') {
            comparison = String(a[field]).localeCompare(String(b[field]));
        } else {
            // Campos numéricos
            comparison = Number(a[field as keyof Subject]) - Number(b[field as keyof Subject]);
        }

        // Ajustar dirección
        return direction === 'asc' ? comparison : -comparison;
    });
}
