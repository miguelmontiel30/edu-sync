// Types
import {Category} from './types';
import {Student} from '@/app/admin-dashboard/admin-students/module-utils/types';
import {Group, GROUP_STATUS} from '@/app/admin-dashboard/admin-groups/module-utils/types';

/**
 * Calcula la edad de un estudiante basada en su fecha de nacimiento.
 * @param birthDate - Fecha de nacimiento en formato string.
 * @returns Edad calculada o 0 si la fecha es inválida.
 */
export const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0; // Manejar casos donde la fecha es nula o indefinida

    const today = new Date();
    const birth = new Date(birthDate);

    // Verificar si la fecha de nacimiento es válida
    if (isNaN(birth.getTime())) {
        console.warn('Fecha de nacimiento inválida:', birthDate);
        return 0;
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    // Asegurarse de que la edad no sea negativa
    return Math.max(0, age);
};

/**
 * Formatea los datos de un estudiante añadiendo nombre completo y edad.
 * @param student - Objeto Student original.
 * @returns Objeto Student formateado.
 */
export const formatStudentData = (student: Student): Student => {
    const fullName =
        `${student.first_name} ${student.father_last_name} ${student.mother_last_name}`.trim();
    const age = calculateAge(student.birth_date);
    return {
        ...student,
        full_name: fullName,
        age: age,
    };
};

/**
 * Filtra una lista de grupos para devolver solo los activos.
 * @param groups - Array de objetos Group.
 * @returns Array filtrado de grupos activos.
 */
export const filterActiveGroups = (groups: Group[]): Group[] => {
    return groups.filter(group => group.status_id.toString() === GROUP_STATUS.ACTIVE);
};

/**
 * Agrupa los grupos por ciclo escolar y los ordena internamente.
 * @param groups - Array de objetos Group.
 * @returns Objeto donde las claves son IDs de ciclo escolar y los valores son arrays de grupos ordenados.
 */
export const groupAndSortGroupsBySchoolYear = (groups: Group[]): Record<string, Group[]> => {
    const grouped: Record<string, Group[]> = {};

    groups.forEach(group => {
        const yearId = group.schoolYear.id.toString();
        if (!grouped[yearId]) {
            grouped[yearId] = [];
        }
        grouped[yearId].push(group);
    });

    // Ordenar grupos dentro de cada ciclo
    Object.keys(grouped).forEach(yearId => {
        grouped[yearId].sort((a, b) => {
            if (a.grade !== b.grade) {
                return a.grade - b.grade;
            }
            return a.group.localeCompare(b.group);
        });
    });

    return grouped;
};

/**
 * Crea las categorías para el componente SelectWithCategories a partir de grupos agrupados.
 * @param groupedGroups - Objeto de grupos agrupados por ciclo escolar.
 * @returns Array de objetos Category ordenados.
 */
export const createGroupCategories = (groupedGroups: Record<string, Group[]>): Category[] => {
    const categories: Category[] = Object.entries(groupedGroups).map(([_yearId, yearGroups]) => {
        const firstGroup = yearGroups[0]; // Asumimos que hay al menos un grupo por año
        return {
            label: firstGroup.schoolYear.name,
            isActive: firstGroup.schoolYear.status === 'active',
            options: yearGroups.map(group => ({
                value: group.id.toString(),
                label: `${group.grade}° ${group.group}`,
            })),
        };
    });

    // Ordenar categorías: activas primero, luego por nombre descendente
    categories.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return b.label.localeCompare(a.label);
    });

    return categories;
};

/**
 * Filtra estudiantes disponibles (todos los estudiantes activos menos los ya asignados al grupo).
 * @param allStudents - Array de todos los estudiantes activos.
 * @param assignedStudents - Array de estudiantes ya asignados al grupo.
 * @returns Array de estudiantes disponibles.
 */
export const filterAvailableStudents = (
    allStudents: Student[],
    assignedStudents: Student[],
): Student[] => {
    if (assignedStudents.length === 0) {
        return allStudents;
    }
    const assignedStudentIds = assignedStudents.map(student => student.id);

    return allStudents.filter(student => !assignedStudentIds.includes(student.id));
};
