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

export type SortField =
    | 'name'
    | 'startDate'
    | 'endDate'
    | 'groupsCount'
    | 'studentsCount'
    | 'averageGrade'
    | 'status';

export interface CycleData {
    name: string;
    startDate: string;
    endDate: string;
    status: string;
}

// Constantes para estados de ciclos
export const CYCLE_STATUS = {
    ACTIVE: '1',
    INACTIVE: '2',
    COMPLETED: '3',
};

export type ErrorAlert = {
    title: string;
    message: string;
};

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

export type SortDirection = 'asc' | 'desc';
