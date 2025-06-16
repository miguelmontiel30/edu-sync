/**
 * Enumeración de estados posibles para un grupo
 */
export enum GROUP_STATUS {
    ACTIVE = '4',
    INACTIVE = '5',
    COMPLETED = '6',
}

/**
 * Interfaces de entidades principales
 */
export interface Teacher {
    id: number;
    name: string;
    role: string;
    image?: string;
}

export interface SchoolYear {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    statusId?: string;
}

export interface Group {
    id: number;
    grade: number;
    group: string;
    teachers: Teacher[];
    schoolYear: SchoolYear;
    studentsNumber: number;
    subjectsNumber: number;
    status_id: string;
    statusName?: string;
    generalAverage: number;
    attendancePercentage?: number;
    recentStudents?: number;
    createdAt?: string;
    updatedAt?: string;
    deleteFlag?: boolean;
    deletedAt?: string | null;
}

/**
 * Interfaces para formularios y estados
 */
export interface GroupFormData {
    grade: string;
    group: string;
    schoolYearId: string;
    statusId: string;
}

export interface ErrorAlert {
    title: string;
    message: string;
}

export interface LoadingState {
    groups: boolean;
    metrics: boolean;
    deleted: boolean;
    processing: boolean;
}

/**
 * Interfaces para métricas y análisis
 */
export interface GroupMetrics {
    totalGroups: number;
    activeGroups: number;
    totalStudents: number;
    averageGrade: number;
}

/**
 * Tipos para ordenamiento y filtrado
 */
export type SortField =
    | 'grade'
    | 'group'
    | 'studentsNumber'
    | 'subjectsNumber'
    | 'generalAverage'
    | 'status';
export type SortDirection = 'asc' | 'desc';

/**
 * Interfaces para integración con base de datos
 */
export interface DatabaseGroup {
    // Propiedades principales
    group_id: number;
    school_id: number;
    school_year_id: number;
    grade: number;
    group_name: string;
    status_id?: string;
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    // Relaciones
    school_years?: {
        school_year_id: number;
        name: string;
        start_date: string;
        end_date: string;
        status_id?: string;
    };
    teacher?: {
        teacher_id: number;
        first_name: string;
        father_last_name: string;
        mother_last_name?: string;
        image_url?: string;
    };
    student_groups?: Array<{ students: any }>;
}

/**
 * Interfaces para hooks y gestor de estado
 */
export interface GroupManagementHook {
    // Datos
    groups: Group[];
    deletedGroups: Group[];
    schoolYears: Array<{ id: number; name: string; status: string }>;

    // Estados de UI
    isModalOpen: boolean;
    isDeleteModalOpen: boolean;
    selectedGroup: Group | null;
    groupToDelete: Group | null;
    searchTerm: string;
    showOnlyActiveCycles: boolean;
    sortField: SortField;
    sortDirection: SortDirection;
    errorAlert: ErrorAlert | null;
    loadingState: LoadingState;

    // Métricas
    metricsData: GroupMetrics;

    // Acciones
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
    confirmDelete: () => Promise<void>;
    openModal: () => void;
    closeModal: () => void;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSaveGroup: (groupData: GroupFormData) => Promise<void>;
    handleRestore: (id: number) => Promise<void>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    setShowOnlyActiveCycles: React.Dispatch<React.SetStateAction<boolean>>;
    handleSort: (field: SortField) => void;
    loadGroups: () => Promise<void>;
    loadSchoolYears: () => Promise<void>;
}
