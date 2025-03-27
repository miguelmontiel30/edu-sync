import {GroupStatus} from '../enums/Group.enum';
import {SchoolYear} from './SchoolYear.interface';
import {Teacher} from './Teacher.interface';

export interface Group {
    id: number;
    grade: number;
    group: string;
    teachers: Array<{
        id: number;
        name: string;
        role: string;
        image?: string;
    }>;
    schoolYear: {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
        status: string;
    };
    studentsNumber: number;
    subjectsNumber: number;
    status: string;
    generalAverage: number;
    attendancePercentage: number;
    recentStudents: number;
    createdAt: string;
    updatedAt: string;
}
