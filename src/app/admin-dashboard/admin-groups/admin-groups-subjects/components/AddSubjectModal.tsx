'use client';

// React
import { useState, useEffect, useMemo } from 'react';

// Components
import Label from '@/components/form/Label';
import IconFA from '@/components/ui/IconFA';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/core/button/Button';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

// Utils
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';
import { Table, TableBody, TableRow, TableCell } from '@/components/core/table';

// Utils
import { GroupSubjectAssignment } from '../module-utils/types';

interface AddSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGroup: Group | null;
    availableSubjects: any[];
    availableTeachers: any[];
    isSaving: boolean;
    onAddSubject: (subjectId: number, teacherId?: number | null) => void;
    groupAssignments: GroupSubjectAssignment[];
}

interface Option {
    value: string;
    label: string;
}

interface Category {
    label: string;
    options: Option[];
}

export default function AddSubjectModal({
    isOpen,
    onClose,
    selectedGroup,
    availableSubjects,
    availableTeachers,
    isSaving,
    onAddSubject,
    groupAssignments
}: AddSubjectModalProps) {
    // Estados para los elementos seleccionados
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [assignTeacher, setAssignTeacher] = useState<boolean>(false);

    // Limpiar selecciones cuando se abre o cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setSelectedSubjectId('');
            setSelectedTeacherId('');
            setAssignTeacher(false);
        }
    }, [isOpen]);

    // Filtrar materias ya asignadas al grupo
    const filteredSubjects = useMemo(() => {
        if (!availableSubjects || !groupAssignments) return [];

        // Obtener los IDs de las materias ya asignadas al grupo
        const assignedSubjectIds = new Set(
            groupAssignments.map(assignment => assignment.subject_id)
        );

        // Filtrar las materias disponibles excluyendo las ya asignadas
        return availableSubjects.filter(subject =>
            !assignedSubjectIds.has(subject.subject_id)
        );
    }, [availableSubjects, groupAssignments]);

    // Opciones para los selectores con categorías
    const subjectCategories: Category[] = useMemo(() => {
        if (filteredSubjects.length === 0) return [];

        return [{
            label: 'Materias disponibles',
            options: filteredSubjects.map(subject => ({
                value: subject.subject_id.toString(),
                label: subject.name
            }))
        }];
    }, [filteredSubjects]);

    // Opciones para el selector de profesores con categorías
    const teacherCategories: Category[] = useMemo(() => {
        if (availableTeachers.length === 0) return [];

        return [{
            label: 'Profesores disponibles',
            options: availableTeachers.map(teacher => ({
                value: teacher.id.toString(),
                label: teacher.name
            }))
        }];
    }, [availableTeachers]);

    // Manejar la adición de la materia
    const handleSave = () => {
        if (!selectedSubjectId) return;

        const subjectId = parseInt(selectedSubjectId);
        const teacherId = assignTeacher && selectedTeacherId
            ? parseInt(selectedTeacherId)
            : null;

        onAddSubject(subjectId, teacherId);
    };

    if (!selectedGroup) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[600px] p-6 lg:p-10 min-h-[500px]"
        >
            <div className="flex flex-col px-2 custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        Agregar Materia al Grupo
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        Selecciona una materia para agregar al grupo y opcionalmente asigna un profesor.
                    </p>
                </div>

                <div className="mt-8 flex-1">
                    {/* Información del grupo (solo lectura) */}
                    <div className="mb-6">
                        <Table className="min-w-full">
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="w-1/3">Grupo</TableCell>
                                    <TableCell>
                                        {selectedGroup ? `${selectedGroup.grade}° ${selectedGroup.group}` : ''}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Selector de materia con categorías */}
                    <div className="mb-8">
                        <Label htmlFor="subject-select" className="font-outfit mb-2">
                            Seleccionar Materia
                        </Label>
                        {filteredSubjects.length > 0 ? (
                            <SelectWithCategories
                                options={subjectCategories}
                                onChange={(value) => setSelectedSubjectId(value)}
                                placeholder="Selecciona una materia"
                            />
                        ) : (
                            <div className="text-yellow-500 flex items-center mt-2 p-3 bg-yellow-50 rounded-md">
                                <IconFA icon="exclamation-triangle" className="mr-2" />
                                No hay materias disponibles para agregar a este grupo. Todas las materias ya están asignadas.
                            </div>
                        )}
                    </div>

                    {/* Opción de asignar profesor */}
                    {selectedSubjectId && (
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="assign-teacher"
                                    checked={assignTeacher}
                                    onChange={(e) => setAssignTeacher(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="assign-teacher" className="ml-2 block text-sm text-gray-700 font-outfit">
                                    Asignar profesor a esta materia
                                </label>
                            </div>

                            {assignTeacher && (
                                <div className="ml-6">
                                    <Label htmlFor="teacher-select" className="font-outfit mb-2">
                                        Seleccionar Profesor
                                    </Label>
                                    {availableTeachers.length > 0 ? (
                                        <SelectWithCategories
                                            options={teacherCategories}
                                            onChange={(value) => setSelectedTeacherId(value)}
                                            placeholder="Selecciona un profesor"
                                        />
                                    ) : (
                                        <div className="text-yellow-500 flex items-center mt-2 p-3 bg-yellow-50 rounded-md">
                                            <IconFA icon="exclamation-triangle" className="mr-2" />
                                            No hay profesores disponibles para asignar.
                                        </div>
                                    )}

                                    {selectedTeacherId && (
                                        <div className="mt-3 p-2 bg-blue-50 rounded-md">
                                            <div className="flex items-center text-blue-700">
                                                <IconFA icon="info-circle" className="mr-2" />
                                                <span className="text-sm font-outfit">
                                                    Este profesor será asignado inmediatamente a la materia
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
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
                        disabled={!selectedSubjectId || (assignTeacher && !selectedTeacherId) || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <IconFA icon="spinner" spin className="mr-2" />
                                <span className="font-outfit">Agregando...</span>
                            </>
                        ) : (
                            <span className="font-outfit">
                                <IconFA icon="book-circle-arrow-up" className="mr-2" />
                                Agregar Materia
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}