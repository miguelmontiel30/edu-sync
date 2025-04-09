import {SchoolCycle, SortField, SortDirection} from './types';

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
                comparison = 0;
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
            return 'warning';
        default:
            return 'info';
    }
};
