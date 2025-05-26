'use client';

// React
import { useState, useEffect } from 'react';

// Components
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';

// Core Components
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import ProfileAvatar from '@/components/core/avatar/ProfileAvatar';
import { Table, TableBody, TableRow, TableCell } from '@/components/core/table';

// Types
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';

// Interfaz para el estado del estudiante en el grupo
export interface StudentGroupStatus {
    id: string;
    name: string;
}

// Interfaz para los datos del estudiante en el grupo
interface StudentGroupData {
    student: Student;
    status: StudentGroupStatus;
}

// Interfaz para las opciones de estado
interface StatusOption {
    value: string;
    label: string;
}

interface EditGroupStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentData: StudentGroupData | null;
    isSaving: boolean;
    onSave: (studentId: number, newStatus: string) => void;
    statusOptions?: StatusOption[];
}

// Opciones de estado por defecto
const defaultStatusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'graduated', label: 'Graduado' }
];

export default function EditGroupStudentModal({
    isOpen,
    onClose,
    studentData,
    isSaving,
    onSave,
    statusOptions = defaultStatusOptions
}: EditGroupStudentModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    // Actualizar el estado seleccionado cuando cambian los datos del estudiante
    useEffect(() => {
        if (studentData) {
            setSelectedStatus(studentData.status.id);
        }
    }, [studentData]);

    // Resetear el estado cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setSelectedStatus('');
        }
    }, [isOpen]);

    // Función para manejar el guardado
    const handleSave = () => {
        if (studentData && selectedStatus) {
            onSave(studentData.student.id, selectedStatus);
        }
    };

    if (!studentData) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[600px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        Editar Estado del Estudiante
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        Modifica el estado del estudiante en el grupo.
                    </p>
                </div>

                <div className="mt-8">
                    {/* Información del estudiante (solo lectura) */}
                    <div className="mb-6">
                        <Table className="min-w-full">
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="w-1/3">Nombre Completo</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <ProfileAvatar size="sm" name={`${studentData.student.first_name} ${studentData.student.father_last_name}`} showBorder={false} />

                                            <span className="text-sm font-outfit ml-2">
                                                {`${studentData.student.first_name} ${studentData.student.father_last_name} ${studentData.student.mother_last_name || ''}`}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell isHeader>CURP</TableCell>
                                    <TableCell>{studentData.student.curp}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell isHeader>Estado Actual</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${studentData.status.id === 'active' || studentData.status.id === '11' ? 'bg-green-100 text-green-800' :
                                                studentData.status.id === 'inactive' || studentData.status.id === '12' ? 'bg-red-100 text-red-800' :
                                                    studentData.status.id === 'graduated' || studentData.status.id === '13' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                            {studentData.status.name}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Selector de nuevo estado */}
                    <div className="mb-6">
                        <Label htmlFor="status-select" className="font-outfit mb-2">
                            Nuevo Estado
                        </Label>
                        <Select
                            options={statusOptions}
                            defaultValue={selectedStatus}
                            onChange={(value) => setSelectedStatus(value)}
                            placeholder="Selecciona un estado"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="sm:w-auto"
                        disabled={isSaving}
                    >
                        <span className="font-outfit">Cancelar</span>
                    </Button>

                    <Button
                        onClick={handleSave}
                        variant="primary"
                        className="sm:w-auto"
                        disabled={!selectedStatus || isSaving}
                        startIcon={isSaving ? <IconFA icon="spinner" spin /> : undefined}
                    >
                        <span className="font-outfit">
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 