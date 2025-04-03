import { useState } from 'react';
import { SchoolCycle } from './types';
import { getStatusColor } from './utils';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import IconFA from '@/components/ui/IconFA';

interface DeletedCycleListProps {
    cycles: SchoolCycle[];
    isLoading: boolean;
    onRestore: (id: number) => void;
}

export default function DeletedCycleList({ cycles, isLoading, onRestore }: DeletedCycleListProps) {
    const [showDeleted, setShowDeleted] = useState(false);

    return (
        <div className="mt-6">
            <button
                onClick={() => setShowDeleted(!showDeleted)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left dark:border-gray-800 dark:bg-white/[0.03]"
            >
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                        Ciclos Eliminados
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        {cycles.length} ciclos en la papelera
                    </p>
                </div>
                <IconFA icon={showDeleted ? 'chevron-up' : 'chevron-down'} style="solid" className={`text-${showDeleted ? 'primary' : 'gray-400'}`} />
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
                                        <TableCell isHeader>Nombre</TableCell>
                                        <TableCell isHeader>Fecha de Inicio</TableCell>
                                        <TableCell isHeader>Fecha de Fin</TableCell>
                                        <TableCell isHeader>Grupos</TableCell>
                                        <TableCell isHeader>Alumnos</TableCell>
                                        <TableCell isHeader>Promedio</TableCell>
                                        <TableCell isHeader>Estado</TableCell>
                                        <TableCell isHeader>Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {cycles.map(cycle => (
                                        <TableRow key={cycle.id}>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                    {cycle.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {new Date(cycle.startDate).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {new Date(cycle.endDate).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {cycle.groupsCount}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {cycle.studentsCount}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {cycle.averageGrade.toFixed(2)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <Badge
                                                    size="sm"
                                                    color={getStatusColor(cycle.status)}
                                                >
                                                    <span className="font-outfit">
                                                        {cycle.statusName}
                                                    </span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<IconFA icon="rotate-left" style="duotone" />}
                                                    onClick={() => onRestore(cycle.id)}
                                                >
                                                    <span className="font-outfit">Restaurar</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {cycles.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                    No hay ciclos eliminados
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