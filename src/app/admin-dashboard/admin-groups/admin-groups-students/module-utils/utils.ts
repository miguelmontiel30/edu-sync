// Services
import {Status} from '@/services/status/statusService';

// Types
import {Category, STUDENT_GROUP_STATUS} from './types';
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
 * Filtra estudiantes para asegurar que no estén ya en el grupo actual.
 * Se asume que `allAvailableStudents` ya contiene estudiantes que no tienen
 * ninguna otra asignación de grupo activa (filtrados previamente por el repositorio).
 * @param allAvailableStudents - Array de todos los estudiantes disponibles (pre-filtrados).
 * @param currentGroupStudents - Array de estudiantes ya asignados al grupo actual.
 * @returns Array de estudiantes disponibles para el grupo actual.
 */
export const filterAvailableStudents = (
    allAvailableStudents: Student[],
    currentGroupStudents: Student[],
): Student[] => {
    const currentGroupStudentIds = currentGroupStudents.map(student => student.id);

    return allAvailableStudents.filter(student => {
        // Condición: No debe estar en el grupo actual
        return !currentGroupStudentIds.includes(student.id);
    });
};

export function getStudentStatusColorById(
    statusId: number,
): 'success' | 'warning' | 'dark' | 'primary' {
    const colorMap: Record<string, 'success' | 'warning' | 'dark' | 'primary'> = {
        [STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE]: 'success',
        [STUDENT_GROUP_STATUS.STUDENT_GROUP_INACTIVE]: 'dark',
        [STUDENT_GROUP_STATUS.STUDENT_GROUP_GRADUATED]: 'primary',
        [STUDENT_GROUP_STATUS.STUDENT_GROUP_TRANSFERRED]: 'warning',
    };

    return colorMap[statusId] || 'dark';
}

/**
 * Crea un mapa de ID de estado a objeto Status para búsquedas eficientes
 * @param statuses Array de objetos Status
 * @returns Map con ID como clave y Status como valor
 */
export function createStatusMap(statuses: Status[]): Map<number, Status> {
    const map = new Map<number, Status>();
    statuses.forEach(status => {
        map.set(status.status_id, status);
    });
    return map;
}

/**
 * Transforma los datos de Supabase al formato Student
 * @param data Datos crudos de estudiante desde Supabase
 * @param studentGroupInfo Información opcional de la relación estudiante-grupo
 * @returns Objeto Student formateado
 */
export function mapToStudent(data: any, studentGroupInfo?: any): Student {
    return {
        id: data.student_id,
        school_id: data.school_id,
        first_name: data.first_name,
        father_last_name: data.father_last_name,
        mother_last_name: data.mother_last_name,
        birth_date: data.birth_date,
        gender_id: data.gender_id,
        gender: data.gender
            ? {
                  id: data.gender.gender_id,
                  code: data.gender.code,
                  name: data.gender.name,
              }
            : undefined,
        curp: data.curp,
        phone: data.phone,
        email: data.email,
        image_url: data.image_url,
        status_id: data.status_id,
        status: data.status
            ? {
                  status_id: data.status.status_id,
                  code: data.status.code,
                  name: data.status.name,
                  category: data.status.category,
              }
            : undefined,
        delete_flag: data.delete_flag,
        created_at: data.created_at,
        updated_at: data.updated_at,
        deleted_at: data.deleted_at,
        student_group_id: studentGroupInfo?.student_group_id,
        student_group_status_id: studentGroupInfo?.status_id,
        student_group_status: studentGroupInfo?.status,
    };
}

/**
 * Crea un mapa de asignación de estudiantes a grupos para búsquedas eficientes
 * @param studentGroupEntries Entradas de relación estudiante-grupo
 * @param statusMap Mapa de estados con sus IDs como clave
 * @returns Map con student_id como clave y detalles de grupo como valor
 */
export function createStudentGroupMap(
    studentGroupEntries: any[],
    statusMap: Map<number, Status>,
): Map<number, any> {
    return new Map(
        studentGroupEntries.map(entry => {
            const status = statusMap.get(entry.status_id);
            return [
                entry.student_id,
                {
                    student_group_id: entry.student_group_id,
                    status_id: entry.status_id,
                    status: status || null,
                },
            ];
        }),
    );
}

/**
 * Formatea la fecha actual en formato ISO para la base de datos
 * @returns Objeto con fecha completa y solo fecha (YYYY-MM-DD)
 */
export function getCurrentDateFormatted(): {isoDate: string; datePart: string} {
    const currentDate = new Date().toISOString();
    return {
        isoDate: currentDate,
        datePart: currentDate.split('T')[0], // Formato YYYY-MM-DD
    };
}

/**
 * Genera registros para insertar en la tabla student_groups
 * @param studentIds Array de IDs de estudiantes
 * @param groupId ID del grupo
 * @param statusId ID del estado a asignar
 * @returns Array de registros listos para insertar
 */
export function generateStudentGroupRecords(
    studentIds: number[],
    groupId: number,
    statusId: number,
): any[] {
    const {isoDate, datePart} = getCurrentDateFormatted();

    return studentIds.map(studentId => ({
        student_id: studentId,
        group_id: groupId,
        enrollment_date: datePart,
        status_id: statusId,
        delete_flag: false,
        created_at: isoDate,
        updated_at: isoDate,
    }));
}
