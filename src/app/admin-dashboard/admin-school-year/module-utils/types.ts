// Tipos principales para el ciclo escolar
export interface SchoolCycle {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    statusName: string;
    groupsCount: number;
    studentsCount: number;
    averageGrade: number;
    deleteFlag?: boolean;
}

export interface CycleData {
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    id?: number;
}

// Constantes para estados de ciclos
export const CYCLE_STATUS = {
    ACTIVE: '1',
    INACTIVE: '2',
    COMPLETED: '3',
};

// Tipos para la interfaz de usuario
export interface AlertState {
    show: boolean;
    variant: 'warning' | 'error' | 'success' | 'info';
    title: string;
    message: string;
}

export interface ErrorAlert {
    title: string;
    message: string;
}

export interface LoadingState {
    cycles: boolean;
    metrics: boolean;
    deleted: boolean;
    processing: boolean;
}

// Tipos para ordenamiento y filtrado
export type SortField =
    | 'name'
    | 'startDate'
    | 'endDate'
    | 'groupsCount'
    | 'studentsCount'
    | 'averageGrade'
    | 'status';

export type SortDirection = 'asc' | 'desc';

// Tipos para la base de datos
export interface DatabaseSchoolYear {
    school_year_id: number;
    name: string;
    start_date: string;
    end_date: string;
    status_id: number;
    status?: {
        name: string;
        code: string;
    };
    groups?: DatabaseGroup[];
    delete_flag?: boolean;
    deleted_at?: string | null;
}

export interface DatabaseGroup {
    group_id: number;
    student_groups?: {
        student_id: number;
    }[];
}

// Hook principal
export interface CycleManagementHook {
    // Data
    cycles: SchoolCycle[];
    deletedCycles: SchoolCycle[];

    // UI States
    isModalOpen: boolean;
    isDeleteModalOpen: boolean;
    selectedCycle: SchoolCycle | null;
    cycleToDelete: SchoolCycle | null;
    errorAlert: ErrorAlert | null;
    loadingState: LoadingState;

    // Actions
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
    confirmDelete: () => Promise<void>;
    openModal: () => void;
    closeModal: () => void;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
    handleSaveCycle: (cycleData: CycleData) => Promise<{ success: boolean; errorMessage?: string }>;
    handleRestore: (id: number) => Promise<void>;
    loadAllCycles: () => Promise<void>;
}
