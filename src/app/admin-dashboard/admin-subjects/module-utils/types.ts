export const SUBJECT_STATUS = {
    SUBJECT_ACTIVE: 18,
    SUBJECT_INACTIVE: 19,
    SUBJECT_COMPLETED: 20,
};

// Tipos principales para las materias
export interface Subject {
    id: number;
    name: string;
    description: string;
    groupsCount: number;
    teachersCount: number;
    averageGrade: number;
    status_id: number;
    status: {
        status_id: number;
        name: string;
    };
    deleteFlag?: boolean;
}

export interface SubjectData {
    name: string;
    description: string;
    status_id: string;
    id?: number;
}

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
    subjects: boolean;
    metrics: boolean;
    deleted: boolean;
    processing: boolean;
}

// Tipos para la base de datos
export interface DatabaseSubject {
    subject_id: number;
    name: string;
    description: string;
    school_id: number;
    group_subjects?: DatabaseGroupSubject[];
    status_id: number;
    status: {
        status_id: number;
        name: string;
    };
    delete_flag?: boolean;
    deleted_at?: string | null;
}

export interface DatabaseGroupSubject {
    group_subject_id: number;
    group_id: number;
    teacher_id: number;
}

// Hook principal
export interface SubjectManagementHook {
    // Data
    subjects: Subject[];
    deletedSubjects: Subject[];

    // UI States
    isModalOpen: boolean;
    isDeleteModalOpen: boolean;
    selectedSubject: Subject | null;
    subjectToDelete: Subject | null;
    errorAlert: ErrorAlert | null;
    loadingState: LoadingState;

    // Actions
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
    confirmDelete: () => Promise<void>;
    openModal: () => void;
    closeModal: () => void;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
    handleSaveSubject: (
        subjectData: SubjectData,
    ) => Promise<{success: boolean; errorMessage?: string}>;
    handleRestore: (id: number) => Promise<void>;
    loadAllSubjects: () => Promise<void>;
}
