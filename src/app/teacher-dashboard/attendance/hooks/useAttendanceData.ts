import { useState, useEffect } from 'react';
import { Student, Group, AttendanceStatus } from '../module-utils/types';

// Función para formatear la fecha en formato YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Datos de ejemplo para estudiantes
const mockStudents: Student[] = [
    {
        id: '1',
        name: 'Noori El Mansur',
        code: 'ACAHM-02-1234-K5',
        avatar: '/images/user1.jpeg',
        status: 'present',
        absentDays: 2,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'absent' },
            { date: '07', status: 'absent' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'present' },
        ],
    },
    {
        id: '2',
        name: 'Terry Wallace',
        code: 'ACAHM-02-1234-K5',
        status: 'present',
        absentDays: 0,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'present' },
            { date: '07', status: 'present' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'present' },
        ],
    },
    {
        id: '3',
        name: 'Joel Knight',
        code: 'ACAHM-02-1234-K5',
        status: 'present',
        absentDays: 2,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'absent' },
            { date: '07', status: 'absent' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'present' },
        ],
    },
    {
        id: '4',
        name: 'Zachary Owens',
        code: 'ACAHM-02-1234-K5',
        status: 'present',
        absentDays: 0,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'present' },
            { date: '07', status: 'present' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'present' },
        ],
    },
    {
        id: '5',
        name: 'Joel Gonzalez',
        code: 'ACAHM-02-1234-K5',
        status: 'present',
        absentDays: 0,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'present' },
            { date: '07', status: 'present' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'present' },
        ],
    },
    {
        id: '6',
        name: 'Jerome Fisher',
        code: 'ACAHM-02-1234-K5',
        status: 'present',
        absentDays: 0,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'present' },
            { date: '07', status: 'present' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'present' },
        ],
    },
    {
        id: '7',
        name: 'Ernest Reese',
        code: 'ACAHM-02-1234-K5',
        status: 'present',
        absentDays: 3,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'present' },
            { date: '07', status: 'present' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'absent' },
        ],
    },
    {
        id: '8',
        name: 'Bradley Barker',
        code: 'ACAHM-02-1234-K5',
        status: 'present',
        absentDays: 2,
        history: [
            { date: '05', status: undefined },
            { date: '06', status: 'absent' },
            { date: '07', status: 'absent' },
            { date: '08', status: 'late' },
            { date: '09', status: 'present' },
            { date: '10', status: 'absent' },
            { date: '11', status: 'present' },
        ],
    },
];

// Datos de ejemplo para grupos
const mockGroups: Group[] = [
    {
        id: 'bhm-2',
        name: 'BHM / BHM-2 / Semestre 4 / B',
        description: 'Grupo de Matemáticas',
        studentCount: 8,
    },
    {
        id: 'bhm-3',
        name: 'BHM / BHM-3 / Semestre 4 / A',
        description: 'Grupo de Física',
        studentCount: 12,
    },
    {
        id: 'bhm-4',
        name: 'BHM / BHM-4 / Semestre 3 / C',
        description: 'Grupo de Química',
        studentCount: 10,
    },
];

export const useAttendanceData = () => {
    const [attendanceData, setAttendanceData] = useState<Student[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
    const [selectedGroup, setSelectedGroup] = useState<string>(mockGroups[0].id);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Cargar datos de asistencia cuando cambia la fecha o el grupo
    useEffect(() => {
        const loadAttendanceData = async () => {
            setIsLoading(true);

            // Simular una llamada a la API
            await new Promise(resolve => setTimeout(resolve, 500));

            // En una implementación real, aquí se haría una llamada a la API
            // para obtener los datos de asistencia para la fecha y grupo seleccionados
            setAttendanceData(mockStudents);

            setIsLoading(false);
        };

        loadAttendanceData();
    }, [selectedDate, selectedGroup]);

    // Manejar cambio de fecha
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    };

    // Manejar cambio de grupo
    const handleGroupChange = (groupId: string) => {
        setSelectedGroup(groupId);
    };

    // Manejar cambio de estado de asistencia
    const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
        setAttendanceData(prevData =>
            prevData.map(student => (student.id === studentId ? { ...student, status } : student)),
        );
    };

    // Manejar guardado de asistencia
    const handleSaveAttendance = async () => {
        setIsLoading(true);

        // Simular una llamada a la API para guardar los datos
        await new Promise(resolve => setTimeout(resolve, 1000));

        // En una implementación real, aquí se haría una llamada a la API
        // para guardar los datos de asistencia

        setIsLoading(false);

        // Mostrar notificación de éxito (en una implementación real)
        alert('Asistencia guardada con éxito');
    };

    // Manejar exportación de reporte
    const handleExportReport = () => {
        // En una implementación real, aquí se generaría un reporte para descargar
        alert('Exportando reporte de asistencia...');
    };

    return {
        attendanceData,
        selectedDate,
        selectedGroup,
        isLoading,
        groups: mockGroups,
        handleDateChange,
        handleGroupChange,
        handleAttendanceChange,
        handleSaveAttendance,
        handleExportReport,
    };
};
