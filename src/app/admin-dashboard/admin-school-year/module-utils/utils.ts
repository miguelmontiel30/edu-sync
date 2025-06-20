import {
    SchoolCycle,
    SortField,
    SortDirection,
    CYCLE_STATUS,
    DatabaseGroup,
    DatabaseSchoolYear,
    CycleData,
} from './types';
import {calculateAverageGrade as calculateGradeFromService} from './services';

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

// Funciones utilitarias
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

// Función de validación de ciclos
export const validateCycleData = (
    cycleData: CycleData,
    currentCycles: SchoolCycle[] = [],
    selectedCycleId?: number,
): {isValid: boolean; errorMessage?: string} => {
    // Validar campos requeridos
    if (!cycleData.name || !cycleData.startDate || !cycleData.endDate || !cycleData.status) {
        return {
            isValid: false,
            errorMessage: 'Por favor, complete todos los campos requeridos.',
        };
    }

    // Validar fechas
    if (new Date(cycleData.startDate) >= new Date(cycleData.endDate)) {
        return {
            isValid: false,
            errorMessage: 'La fecha de inicio debe ser anterior a la fecha de fin.',
        };
    }

    // Validar que no haya más de un ciclo activo
    if (cycleData.status === CYCLE_STATUS.ACTIVE) {
        const hasActiveCycle = currentCycles.some(
            cycle =>
                cycle.status === CYCLE_STATUS.ACTIVE &&
                (!selectedCycleId || cycle.id !== selectedCycleId),
        );

        if (hasActiveCycle) {
            return {
                isValid: false,
                errorMessage:
                    'Lo sentimos, pero ya existe un ciclo escolar activo. No es posible tener más de un ciclo activo al mismo tiempo.',
            };
        }
    }

    return {isValid: true};
};

// Función auxiliar para extraer ids de grupos y estudiantes
export function extractGroupAndStudentData(groups: DatabaseGroup[]) {
    const groupIds: number[] = [];
    const studentIds = new Set<number>();

    groups.forEach(group => {
        groupIds.push(group.group_id);

        const studentGroups = group.student_groups || [];

        studentGroups.forEach(sg => {
            studentIds.add(sg.student_id);
        });
    });

    return {groupIds, studentIds};
}

// Función auxiliar para calcular la calificación promedio
// Utiliza el servicio que a su vez utiliza el repositorio
export const calculateAverageGrade = calculateGradeFromService;

// Función para formatear los datos del ciclo
export async function formatCycleData(cycle: DatabaseSchoolYear): Promise<SchoolCycle> {
    // Extraer datos de grupos y estudiantes
    const {groupIds, studentIds} =
        cycle.groups && cycle.groups.length > 0
            ? extractGroupAndStudentData(cycle.groups)
            : {groupIds: [], studentIds: new Set<number>()};

    // Calcular promedio de calificaciones
    const averageGrade = await calculateAverageGrade(groupIds);

    return {
        id: cycle.school_year_id,
        name: cycle.name,
        startDate: cycle.start_date,
        endDate: cycle.end_date,
        status: cycle.status_id.toString(),
        statusName: cycle.status?.name || '',
        groupsCount: groupIds.length,
        studentsCount: studentIds.size,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        deleteFlag: !!cycle.delete_flag,
    };
}
