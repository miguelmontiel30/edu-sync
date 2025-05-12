'use client';

// React
import { useState, useEffect, useMemo } from 'react';

// Components
import { Modal } from '@/components/ui/modal';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import Label from '@/components/form/Label';
import { Table, TableBody, TableRow, TableCell } from '@/components/core/table';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

// Utils
import { GroupSubjectAssignment } from '../module-utils/types';
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';

// Funciones auxiliares para generar colores
const generatePastelColor = (name: string): string => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 85%)`;
};

const generateTextColor = (name: string): string => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 30%)`;
};

interface AssignTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGroup: Group | null;
    selectedAssignment: GroupSubjectAssignment | null;
    availableTeachers: any[];
    isSaving: boolean;
    onAssignTeacher: (groupSubjectId: number, teacherId: number | null) => void;
}

interface Option {
    value: string;
    label: string;
    isCurrentTeacher?: boolean;
}

interface Category {
    label: string;
    options: Option[];
}

// Función para asegurar que el profesor tiene un ID válido
const ensureValidTeacher = (teacher: any): any => {
    if (!teacher) return null;

    // Asegurarnos de que el ID está definido
    const id = teacher.teacher_id || teacher.id || 0;
    const name = teacher.name ||
        `${teacher.first_name || ''} ${teacher.father_last_name || ''}`.trim() ||
        'Profesor sin nombre';

    return {
        ...teacher,
        id: id,
        name: name
    };
};

export default function AssignTeacherModal({
    isOpen,
    onClose,
    selectedGroup,
    selectedAssignment,
    availableTeachers,
    isSaving,
    onAssignTeacher,
}: AssignTeacherModalProps) {
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [removeTeacher, setRemoveTeacher] = useState<boolean>(false);

    // Limpiar selecciones cuando se abre o cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setSelectedTeacherId('');
            setRemoveTeacher(false);
        } else if (selectedAssignment?.teacherData) {
            // Pre-seleccionar el profesor actual si existe
            setSelectedTeacherId(selectedAssignment.teacher_id?.toString() || '');
        }
    }, [isOpen, selectedAssignment]);

    // Opciones para el selector de profesores con categorías
    const teacherCategories: Category[] = useMemo(() => {
        if (!availableTeachers || availableTeachers.length === 0) return [];

        // Identificar el profesor actual
        const currentTeacherId = selectedAssignment?.teacher_id?.toString();

        // Crear lista de profesores con indicador para el actual y asegurar que cada profesor tiene datos válidos
        const teacherOptions = availableTeachers
            .map(ensureValidTeacher)
            .filter(teacher => teacher !== null)
            .map(teacher => {
                const isCurrentTeacher = teacher.id.toString() === currentTeacherId;
                return {
                    value: teacher.id.toString(),
                    label: isCurrentTeacher
                        ? `${teacher.name} (Profesor actual)`
                        : teacher.name,
                    isCurrentTeacher
                };
            });

        // Ordenar para que el profesor actual aparezca primero
        teacherOptions.sort((a, b) => {
            if (a.isCurrentTeacher) return -1;
            if (b.isCurrentTeacher) return 1;
            return a.label.localeCompare(b.label);
        });

        return [{
            label: 'Profesores disponibles',
            options: teacherOptions
        }];
    }, [availableTeachers, selectedAssignment]);

    // Manejar la asignación del profesor
    const handleSave = () => {
        if (!selectedAssignment) return;

        // Si se marcó la opción de eliminar profesor, asignar null
        // Si no, usar el ID del profesor seleccionado
        const teacherId = removeTeacher
            ? null
            : selectedTeacherId
                ? parseInt(selectedTeacherId)
                : null;

        onAssignTeacher(selectedAssignment.group_subject_id!, teacherId);
    };

    if (!selectedGroup || !selectedAssignment) return null;

    // Determinar si el profesor seleccionado es diferente del actual
    const isChangingTeacher = selectedAssignment.teacher_id?.toString() !== selectedTeacherId && !removeTeacher;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[600px] p-6 lg:p-10 min-h-[500px]"
        >
            <div className="flex flex-col px-2 custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        {selectedAssignment.teacherData
                            ? 'Editar Asignación de Profesor'
                            : 'Asignar Profesor a Materia'}
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        {selectedAssignment.teacherData
                            ? 'Puedes cambiar el profesor asignado o eliminar la asignación actual.'
                            : 'Selecciona un profesor para asignar a esta materia.'}
                    </p>
                </div>

                <div className="mt-8 flex-1">
                    {/* Información del grupo y materia (solo lectura) */}
                    <div className="mb-6">
                        <Table className="min-w-full">
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="w-1/3">Grupo</TableCell>
                                    <TableCell>
                                        {selectedGroup ? `${selectedGroup.grade}° ${selectedGroup.group}` : ''}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell isHeader>Materia</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <IconFA icon="book" className="mr-2 text-indigo-600" />
                                            {selectedAssignment.subject?.name || 'Materia sin nombre'}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {selectedAssignment.teacherData && (
                                    <TableRow>
                                        <TableCell isHeader>Profesor Actual</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div
                                                    className="h-8 w-8 rounded-full flex items-center justify-center mr-2"
                                                    style={{
                                                        backgroundColor: generatePastelColor(selectedAssignment.teacherData.first_name),
                                                        color: generateTextColor(selectedAssignment.teacherData.first_name)
                                                    }}
                                                >
                                                    <span className="text-sm font-semibold">
                                                        {selectedAssignment.teacherData.first_name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                {`${selectedAssignment.teacherData.first_name} ${selectedAssignment.teacherData.father_last_name} ${selectedAssignment.teacherData.mother_last_name || ''}`}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Opción para eliminar la asignación actual si existe un profesor */}
                    {selectedAssignment.teacherData && (
                        <div className="mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remove-teacher"
                                    checked={removeTeacher}
                                    onChange={(e) => {
                                        setRemoveTeacher(e.target.checked);
                                        if (e.target.checked) {
                                            setSelectedTeacherId('');
                                        }
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="remove-teacher" className="ml-2 block text-sm text-gray-700 font-outfit">
                                    Quitar asignación de profesor
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Selector de profesor */}
                    {!removeTeacher && (
                        <div className="mb-8">
                            <Label htmlFor="teacher-select" className="font-outfit mb-2">
                                {selectedAssignment.teacherData
                                    ? 'Seleccionar Profesor'
                                    : 'Asignar Profesor'}
                            </Label>

                            {teacherCategories[0]?.options.length > 0 ? (
                                <>
                                    <SelectWithCategories
                                        options={teacherCategories}
                                        onChange={(value) => setSelectedTeacherId(value)}
                                        placeholder="Selecciona un profesor"
                                        defaultValue={selectedTeacherId}
                                    />

                                    {isChangingTeacher && (
                                        <div className="mt-3 p-2 bg-blue-50 rounded-md">
                                            <div className="flex items-center text-blue-700">
                                                <IconFA icon="info-circle" className="mr-2" />
                                                <span className="text-sm font-outfit">
                                                    Estás cambiando el profesor asignado a esta materia
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-yellow-500 flex items-center mt-2 p-3 bg-yellow-50 rounded-md">
                                    <IconFA icon="exclamation-triangle" className="mr-2" />
                                    No hay profesores disponibles para asignar.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Botones de acciones */}
                <div className="flex justify-end gap-2 mt-8">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="font-outfit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving || (!selectedTeacherId && !removeTeacher)}
                        className="font-outfit"
                    >
                        {isSaving ? (
                            <>
                                <IconFA icon="spinner" spin className="mr-2" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <IconFA icon="check" className="mr-2" />
                                {removeTeacher ? 'Quitar Profesor' : 'Guardar Cambios'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 