import {SchoolCycle, SortField, SortDirection, Teacher} from './types';

// Función para ordenar los ciclos
export const sortCycles = (
    cycles: SchoolCycle[],
    sortField: SortField,
    sortDirection: SortDirection,
) => {
    return [...cycles].sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'startDate':
                comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                break;
            case 'endDate':
                comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                break;
            case 'groupsCount':
                comparison = a.groupsCount - b.groupsCount;
                break;
            case 'studentsCount':
                comparison = a.studentsCount - b.studentsCount;
                break;
            case 'averageGrade':
                comparison = a.averageGrade - b.averageGrade;
                break;
            case 'status':
                comparison = a.statusName.localeCompare(b.statusName);
                break;
            default:
                break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });
};

// Función para filtrar los ciclos
export const filterCycles = (cycles: SchoolCycle[], term: string) => {
    if (!term) return cycles;
    const searchTermLower = term.toLowerCase();
    return cycles.filter(
        cycle =>
            cycle.name.toLowerCase().includes(searchTermLower) ||
            cycle.statusName.toLowerCase().includes(searchTermLower),
    );
};

// Función para ordenar profesores
export const sortTeachers = (
    teachers: Teacher[],
    sortField: SortField,
    sortDirection: SortDirection,
) => {
    return [...teachers].sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'email':
                // Usar operador de coalescencia nula para manejar valores nulos
                comparison = (a.email ?? '').localeCompare(b.email ?? '');
                break;
            case 'phone':
                // Usar operador de coalescencia nula para manejar valores nulos
                comparison = (a.phone ?? '').localeCompare(b.phone ?? '');
                break;
            case 'groupsCount':
                comparison = a.groupsCount - b.groupsCount;
                break;
            case 'subjectsCount':
                comparison = a.subjectsCount - b.subjectsCount;
                break;
            case 'gender':
                comparison = a.gender.localeCompare(b.gender);
                break;
            default:
                break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });
};

// Función para filtrar profesores
export const filterTeachers = (teachers: Teacher[], term: string) => {
    if (!term) return teachers;
    const searchTermLower = term.toLowerCase();

    return teachers.filter(
        teacher =>
            // Buscar en nombre completo
            teacher.name.toLowerCase().includes(searchTermLower) ||
            // Buscar en email (si existe)
            teacher.email?.toLowerCase().includes(searchTermLower) ||
            // Buscar en teléfono (si existe)
            teacher.phone?.toLowerCase().includes(searchTermLower) ||
            // Buscar en CURP (si existe)
            teacher.curp?.toLowerCase().includes(searchTermLower) ||
            // Buscar en género
            teacher.gender.toLowerCase().includes(searchTermLower),
    );
};

// Función para obtener el color del badge según el estado
export const getStatusColor = (
    statusId: string,
): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark' => {
    // Estos valores deben corresponder con los IDs en la tabla status
    switch (statusId) {
        case '1': // Activo
            return 'success';
        case '2': // Inactivo
            return 'light';
        case '3': // Finalizado
            return 'primary';
        default:
            return 'info';
    }
};

// Función para mapear ID a código de estado
export const mapStatusIdToCode = (statusId: string): string => {
    switch (statusId) {
        case '1':
            return 'SCHOOL_YEAR_ACTIVE';
        case '2':
            return 'SCHOOL_YEAR_INACTIVE';
        case '3':
            return 'SCHOOL_YEAR_COMPLETED';
        default:
            return '';
    }
};

// Función para mapear código a ID de estado
export const mapStatusCodeToId = (code: string): string => {
    switch (code) {
        case 'SCHOOL_YEAR_ACTIVE':
            return '1';
        case 'SCHOOL_YEAR_INACTIVE':
            return '2';
        case 'SCHOOL_YEAR_COMPLETED':
            return '3';
        default:
            return '';
    }
};
