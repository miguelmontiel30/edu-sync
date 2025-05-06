'use client';

// React
import { useState, useEffect } from 'react';

// Components
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';

// Core Components
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';

// Tipos
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';

// Interfaz simplificada para el grupo en este contexto
interface GroupBasic {
    id: number;
    grade: number;
    group: string;
    schoolYear?: {
        id: number;
        name: string;
        status: string;
    };
    status_id: string;
    statusName?: string;
    studentsNumber?: number;
}

interface AssignGroupStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGroup: GroupBasic | null;
    isSaving: boolean;
    availableStudents: Student[];
    isLoadingStudents: boolean;
    onAddStudents: (studentIds: number[]) => void;
}

export default function AssignGroupStudentsModal({
    isOpen,
    onClose,
    selectedGroup,
    isSaving,
    availableStudents,
    isLoadingStudents,
    onAddStudents
}: AssignGroupStudentsModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    // Resetear los estudiantes seleccionados cuando se abre o cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setSelectedStudents([]);
            setSearchTerm('');
        }
    }, [isOpen]);

    // Función para manejar el cierre del modal
    const handleClose = () => {
        setSelectedStudents([]);
        onClose();
    };

    // Filtrar estudiantes según el término de búsqueda
    const filteredStudents = availableStudents.filter(student =>
        student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.father_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mother_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.curp?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        Añadir estudiantes al grupo
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        Selecciona los estudiantes que deseas añadir al grupo <strong>{selectedGroup?.grade}° {selectedGroup?.group}</strong>.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="Buscar estudiantes disponibles..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            startIcon={<IconFA icon="search" style="solid" className="text-gray-400" />}
                        />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoadingStudents ? (
                            <div className="flex items-center justify-center h-[200px]">
                                <IconFA icon="spinner" spin className="text-gray-400" />
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader>
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedStudents(filteredStudents.map(s => s.id));
                                                    } else {
                                                        setSelectedStudents([]);
                                                    }
                                                }}
                                                checked={selectedStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                                            />
                                        </TableCell>
                                        <TableCell isHeader>Nombre</TableCell>
                                        <TableCell isHeader>CURP</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <TableRow
                                                key={student.id}
                                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                onClick={() => {
                                                    if (selectedStudents.includes(student.id)) {
                                                        setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                                    } else {
                                                        setSelectedStudents([...selectedStudents, student.id]);
                                                    }
                                                }}
                                            >
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={selectedStudents.includes(student.id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            if (e.target.checked) {
                                                                setSelectedStudents([...selectedStudents, student.id]);
                                                            } else {
                                                                setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {student.first_name} {student.father_last_name} {student.mother_last_name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                        {student.curp}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                    No hay estudiantes disponibles para añadir.
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                    <Button
                        onClick={handleClose}
                        variant="outline"
                        className="sm:w-auto"
                        disabled={isSaving}
                    >
                        <span className="font-outfit">Cancelar</span>
                    </Button>

                    <Button
                        onClick={() => onAddStudents(selectedStudents)}
                        variant="primary"
                        className="sm:w-auto"
                        disabled={selectedStudents.length === 0 || isSaving}
                        startIcon={isSaving ? <IconFA icon="spinner" spin /> : undefined}
                    >
                        <span className="font-outfit">
                            {isSaving
                                ? 'Guardando...'
                                : `Añadir ${selectedStudents.length} Estudiantes`
                            }
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
}