import {Student} from '@/app/admin-dashboard/admin-students/module-utils/types';

export const STUDENT_GROUP_STATUS = {
    STUDENT_GROUP_ACTIVE: 11,
    STUDENT_GROUP_INACTIVE: 12,
    STUDENT_GROUP_GRADUATED: 13,
    STUDENT_GROUP_TRANSFERRED: 14,
};

// Interfaz para categorías de SelectWithCategories
export interface Category {
    label: string;
    options: Array<{value: string; label: string}>;
    isActive?: boolean;
}

// Interfaz para los estados de carga
export interface LoadingStates {
    groups: boolean;
    groupStudents: boolean;
    availableStudents: boolean;
    saving: boolean;
}

// Interfaz para los estados de error
export interface ErrorStates {
    groups: string | null;
    students: string | null;
    saving: string | null;
}
