import {GroupStatus} from '../enums/Group.enum';
import {SchoolYear} from './SchoolYear.interface';
import {Teacher} from './Teacher.interface';

export interface Group {
    id: number;
    grade: number;
    group: string;
    teachers: Teacher[];
    schoolYear: SchoolYear;
    studentsNumber: number;
    subjectsNumber: number;
    status: GroupStatus;
    generalAverage: number;
    description?: string | null; // Opcional
    createdAt: string; // Fecha de creación
    updatedAt: string; // Fecha de última actualización
    groupImage?: string;
}
