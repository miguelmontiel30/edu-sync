'use client';

import { useState } from 'react';
import { useAttendanceData } from './hooks';
import { AttendanceTable } from './components';
import { Student } from './module-utils/types';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';

export default function AttendancePage() {
    const {
        attendanceData,
        selectedDate,
        selectedGroup,
        isLoading,
        groups,
        handleDateChange,
        handleGroupChange,
        handleAttendanceChange,
        handleSaveAttendance,
        handleExportReport,
    } = useAttendanceData();

    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar estudiantes por búsqueda
    const filteredStudents = attendanceData.filter(
        (student: Student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            {/* Encabezado y Breadcrumb */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <PageBreadcrumb pageTitle="Registro de Asistencia" />
            </div>

            {/* Panel de control */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Filtros y controles - columna izquierda */}
                <div className="lg:col-span-1">
                    <ComponentCard title="Controles" className="h-full">
                        <div className="space-y-4">
                            {/* Selector de fecha */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha
                                </label>
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={e => handleDateChange(e.target.value)}
                                    className="w-full"
                                    startIcon={<IconFA icon="calendar" className="text-gray-400" />}
                                />
                            </div>

                            {/* Selector de grupo */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Grupo / Clase
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedGroup}
                                        onChange={e => handleGroupChange(e.target.value)}
                                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm focus:outline-none focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    >
                                        {groups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                        <IconFA icon="chevron-down" className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas rápidas */}
                            <div className="mt-6 space-y-3">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Resumen de Asistencia
                                </h4>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                                                <IconFA
                                                    icon="user-check"
                                                    className="text-green-600 dark:text-green-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Presentes
                                                </p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {
                                                        attendanceData.filter(
                                                            (s: Student) => s.status === 'present',
                                                        ).length
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                                                <IconFA
                                                    icon="user-xmark"
                                                    className="text-red-600 dark:text-red-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Ausentes
                                                </p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {
                                                        attendanceData.filter(
                                                            (s: Student) => s.status === 'absent',
                                                        ).length
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                                                <IconFA
                                                    icon="user-clock"
                                                    className="text-amber-600 dark:text-amber-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Tardanzas
                                                </p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {
                                                        attendanceData.filter(
                                                            (s: Student) => s.status === 'late',
                                                        ).length
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                                <IconFA
                                                    icon="percent"
                                                    className="text-blue-600 dark:text-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Asistencia
                                                </p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {Math.round(
                                                        (attendanceData.filter(
                                                            (s: Student) => s.status === 'present',
                                                        ).length /
                                                            attendanceData.length) *
                                                            100,
                                                    )}
                                                    %
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="mt-6 flex flex-col gap-3">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    startIcon={<IconFA icon="save" />}
                                    onClick={handleSaveAttendance}
                                >
                                    Guardar Asistencia
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    startIcon={<IconFA icon="file-export" />}
                                    onClick={handleExportReport}
                                >
                                    Exportar Reporte
                                </Button>
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                {/* Tabla de asistencia - columna derecha */}
                <div className="lg:col-span-2">
                    <ComponentCard title="Registro Diario de Asistencia" className="h-full">
                        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row">
                            {/* Buscador de estudiantes */}
                            <div className="relative w-full sm:w-64">
                                <Input
                                    type="text"
                                    placeholder="Buscar estudiante por nombre o código"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    startIcon={
                                        <IconFA
                                            icon="search"
                                            style="solid"
                                            className="text-gray-400"
                                        />
                                    }
                                />
                            </div>

                            {/* Información del grupo */}
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <IconFA icon="users-class" className="text-primary-500 mr-2" />
                                <span>
                                    {groups.find(g => g.id === selectedGroup)?.name} |{' '}
                                    {attendanceData.length} estudiantes
                                </span>
                            </div>
                        </div>

                        {/* Tabla de asistencia */}
                        <AttendanceTable
                            students={filteredStudents}
                            isLoading={isLoading}
                            onAttendanceChange={handleAttendanceChange}
                        />
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
