'use client';

import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import IconFA from '@/components/ui/IconFA';
import { Student, AttendanceStatus, AttendanceDay } from '../module-utils/types';

interface AttendanceTableProps {
    students: Student[];
    isLoading: boolean;
    onAttendanceChange: (studentId: string, status: AttendanceStatus) => void;
}

export default function AttendanceTable({
    students,
    isLoading,
    onAttendanceChange,
}: AttendanceTableProps) {
    // Estado para rastrear el historial de asistencia de los últimos 7 días
    const [showHistory, setShowHistory] = useState(true);

    // Función para renderizar los botones de estado de asistencia
    const renderStatusButtons = (student: Student) => {
        return (
            <div className="flex items-center justify-center space-x-2">
                <button
                    type="button"
                    onClick={() => onAttendanceChange(student.id, 'present')}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                        student.status === 'present'
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                    aria-label="Marcar presente"
                >
                    <IconFA icon="check" />
                </button>
                <button
                    type="button"
                    onClick={() => onAttendanceChange(student.id, 'absent')}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                        student.status === 'absent'
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                    aria-label="Marcar ausente"
                >
                    <IconFA icon="xmark" />
                </button>
                <button
                    type="button"
                    onClick={() => onAttendanceChange(student.id, 'late')}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                        student.status === 'late'
                            ? 'border-amber-500 bg-amber-500 text-white'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                    aria-label="Marcar tarde"
                >
                    <IconFA icon="clock" />
                </button>
            </div>
        );
    };

    // Función para renderizar el indicador de estado de asistencia
    const renderStatusIndicator = (status: AttendanceStatus | undefined) => {
        if (!status) return <span className="inline-block h-3 w-3 rounded-full bg-gray-300"></span>;

        switch (status) {
            case 'present':
                return (
                    <span
                        className="inline-block h-3 w-3 rounded-full bg-green-500"
                        title="Presente"
                    ></span>
                );
            case 'absent':
                return (
                    <span
                        className="inline-block h-3 w-3 rounded-full bg-red-500"
                        title="Ausente"
                    ></span>
                );
            case 'late':
                return (
                    <span
                        className="inline-block h-3 w-3 rounded-full bg-amber-500"
                        title="Tarde"
                    ></span>
                );
            default:
                return <span className="inline-block h-3 w-3 rounded-full bg-gray-300"></span>;
        }
    };

    // Función para renderizar el estado textual de asistencia
    const renderStatusText = (status: AttendanceStatus | undefined) => {
        if (!status) return '—';

        switch (status) {
            case 'present':
                return (
                    <span className="font-medium text-green-600 dark:text-green-400">PRESENTE</span>
                );
            case 'absent':
                return <span className="font-medium text-red-600 dark:text-red-400">AUSENTE</span>;
            case 'late':
                return (
                    <span className="font-medium text-amber-600 dark:text-amber-400">TARDE</span>
                );
            default:
                return '—';
        }
    };

    // Renderizar el historial de asistencia de los últimos 7 días
    const renderAttendanceHistory = (student: Student) => {
        if (!student.history || !showHistory) return null;

        return (
            <div className="flex items-center space-x-2">
                {student.history.map((day: AttendanceDay, index: number) => (
                    <div
                        key={index}
                        className="flex flex-col items-center"
                        title={`Día ${index + 1}: ${day.status === 'present' ? 'Presente' : day.status === 'absent' ? 'Ausente' : day.status === 'late' ? 'Tarde' : 'No registrado'}`}
                    >
                        <span className="text-xs text-gray-500">{day.date}</span>
                        {renderStatusIndicator(day.status)}
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <IconFA icon="spinner" spin className="text-primary-500" size="2xl" />
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center">
                <IconFA icon="user-slash" className="mb-2 text-gray-400" size="2xl" />
                <p className="text-gray-500">No se encontraron estudiantes</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader className="w-12 px-3 py-3 text-center">
                            #
                        </TableCell>
                        <TableCell isHeader className="px-3 py-3">
                            Estudiante
                        </TableCell>
                        <TableCell isHeader className="px-3 py-3 text-center">
                            <div className="flex items-center justify-center">
                                <span>Estado</span>
                                <button
                                    className="ml-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => setShowHistory(!showHistory)}
                                    title={showHistory ? 'Ocultar historial' : 'Mostrar historial'}
                                >
                                    <IconFA
                                        icon={showHistory ? 'eye-slash' : 'eye'}
                                        className="text-gray-500"
                                        size="sm"
                                    />
                                </button>
                            </div>
                        </TableCell>
                        <TableCell isHeader className="px-3 py-3 text-center">
                            Acciones
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student, index) => (
                        <TableRow key={student.id}>
                            <TableCell className="w-12 px-3 py-4 text-center">
                                {index + 1}
                            </TableCell>
                            <TableCell className="px-3 py-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        {student.avatar ? (
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                <IconFA
                                                    icon="user"
                                                    className="text-gray-500 dark:text-gray-400"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {student.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {student.code}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-3 py-4">
                                <div className="flex flex-col items-center space-y-2">
                                    {renderStatusText(student.status)}
                                    {showHistory && (
                                        <div className="mt-2 flex items-center space-x-3">
                                            <span className="text-xs text-gray-500">
                                                Historial:
                                            </span>
                                            {renderAttendanceHistory(student)}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="px-3 py-4 text-center">
                                {renderStatusButtons(student)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
