import React, { useState } from 'react';
import Button from '@/components/core/button/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import IconFA from '@/components/ui/IconFA';
import { Teacher } from './types';

interface DeletedTeacherListProps {
    teachers: Teacher[];
    isLoading: boolean;
    onRestore: (id: number) => void;
}

export default function DeletedTeacherList({ teachers, isLoading, onRestore }: DeletedTeacherListProps) {
    const [showDeleted, setShowDeleted] = useState(false);

    return (
        <div className="mt-6">
            <button
                onClick={() => setShowDeleted(!showDeleted)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left dark:border-gray-800 dark:bg-white/[0.03]"
            >
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                        Profesores Eliminados
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        {teachers.length} profesores en la papelera
                    </p>
                </div>
                <IconFA
                    icon={showDeleted ? 'chevron-up' : 'chevron-down'}
                    className="text-gray-500 dark:text-gray-400"
                />
            </button>

            {showDeleted && (
                <div className="mt-4">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-[200px]">
                                <IconFA icon="spinner" spin className="text-gray-400" />
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit">Nombre</TableCell>
                                        <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit">Email</TableCell>
                                        <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit">Fecha de eliminación</TableCell>
                                        <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit">Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {teachers.map((teacher) => (
                                        <TableRow key={teacher.teacher_id}>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <div className="flex items-center justify-center">
                                                    {teacher.image_url ? (
                                                        <img
                                                            src={teacher.image_url}
                                                            alt={teacher.name}
                                                            className="h-8 w-8 rounded-full mr-2"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                            <IconFA icon="user" className="text-gray-500" />
                                                        </div>
                                                    )}
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {teacher.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {teacher.email || 'No disponible'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {teacher.deleted_at
                                                        ? new Date(teacher.deleted_at).toLocaleDateString('es-MX', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : 'Desconocida'
                                                    }
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<IconFA icon="rotate-left" />}
                                                    onClick={() => onRestore(teacher.teacher_id)}
                                                >
                                                    <span className="font-outfit">Restaurar</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {teachers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                    No hay profesores eliminados
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 