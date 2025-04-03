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
}

export type SortField =
    | 'name'
    | 'startDate'
    | 'endDate'
    | 'groupsCount'
    | 'studentsCount'
    | 'averageGrade'
    | 'status';

export type SortDirection = 'asc' | 'desc';
