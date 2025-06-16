'use client';

// React
import { useState, useEffect } from 'react';

// Components
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';

// Core Components
import SelectWithCategories from '@/components/core/select/SelectWithCategories';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

// Types
import { Group, GroupFormData, GROUP_STATUS, ErrorAlert } from '../module-utils/types';
import { CYCLE_STATUS } from '@/app/admin-dashboard/admin-school-year/module-utils/types';

// Hooks
import { useStatusOptions } from '@/hooks/useStatusData';

interface GroupFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (groupData: GroupFormData) => Promise<void>;
    selectedGroup: Group | null;
    isSaving: boolean;
    schoolYears: Array<{ id: number; name: string; status: string }>;
    errorAlert: ErrorAlert | null;
}

export default function GroupFormModal({
    isOpen,
    onClose,
    onSave,
    selectedGroup,
    isSaving,
    schoolYears,
    errorAlert,
}: GroupFormModalProps) {
    // Obtener estados de grupos
    const { options: groupStatuses, isLoading: isLoadingGroupStatuses } = useStatusOptions('group');

    // Estado del formulario
    const [formData, setFormData] = useState<GroupFormData>({
        grade: '',
        group: '',
        schoolYearId: '',
        statusId: GROUP_STATUS.ACTIVE,
    });

    /**
     * Devuelve el ID del ciclo escolar inicial para el formulario
     * @returns ID del ciclo escolar
     */
    const getInitialSchoolYear = () => {
        // Si estamos editando un grupo, devolver su ciclo escolar
        if (selectedGroup && selectedGroup.schoolYear) {
            return selectedGroup.schoolYear.id.toString();
        }

        // Si no estamos editando, intentar encontrar un ciclo activo
        const activeSchoolYears = schoolYears.filter(year => year.status === CYCLE_STATUS.ACTIVE);

        // Si hay ciclos activos, devolver el primero
        if (activeSchoolYears.length > 0) {
            return activeSchoolYears[0].id.toString();
        }

        // Si no hay ciclos activos, devolver vacío
        return '';
    };

    /**
     * Resetea el formulario a sus valores iniciales
     */
    const resetForm = () => {
        setFormData({
            grade: '',
            group: '',
            schoolYearId: getInitialSchoolYear(),
            statusId: GROUP_STATUS.ACTIVE,
        });
    };

    // Función para inicializar un nuevo ciclo con valores por defecto
    function initializeForm() {
        if (selectedGroup) {
            setFormData({
                grade: selectedGroup.grade.toString(),
                group: selectedGroup.group,
                schoolYearId: selectedGroup.schoolYear.id.toString(),
                statusId: selectedGroup.status_id.toString(),
            });
        } else {
            resetForm();
        }
    }

    // Función para manejar el cierre del modal con reseteo de formulario
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Actualizar formulario cuando cambia el grupo seleccionado
    useEffect(() => {
        if (isOpen) {
            initializeForm();
        } else {
            // Reiniciar formulario para nuevo grupo
            resetForm();
        }
    }, [isOpen, selectedGroup, schoolYears, groupStatuses]);

    // Manejar cambios en inputs
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    // Manejar cambio en selects personalizados
    function handleSelectChange(name: string, value: string) {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    // Manejar envío del formulario
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validar que los campos requeridos estén completos
        if (!formData.grade || !formData.group || !formData.schoolYearId) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }

        try {
            await onSave(formData);
            // Si llegamos aquí, significa que el guardado fue exitoso
            // Resetear el formulario si no estamos editando un grupo existente
            if (!selectedGroup) {
                resetForm();
            }
        } catch (error) {
            // El error ya debería ser manejado por el componente padre
            console.error('Error al guardar el grupo:', error);
        }
    }

    // Obtener opciones agrupadas para ciclos escolares
    function getGroupedSchoolYears() {
        const categories = [];

        // Agregar ciclos activos
        const activeYears = schoolYears.filter(year => year.status === CYCLE_STATUS.ACTIVE);
        if (activeYears.length > 0) {
            categories.push({
                label: 'Ciclos Activos',
                options: activeYears.map(year => ({
                    value: year.id.toString(),
                    label: year.name,
                })),
            });
        }

        // Agregar ciclos inactivos
        const inactiveYears = schoolYears.filter(year => year.status === CYCLE_STATUS.INACTIVE);

        // Si hay ciclos inactivos, agregarlos a la lista
        if (inactiveYears.length > 0) {
            categories.push({
                label: 'Ciclos Inactivos',
                options: inactiveYears.map(year => ({
                    value: year.id.toString(),
                    label: year.name,
                })),
            });
        }

        // Agregar ciclos finalizados
        const completedYears = schoolYears.filter(year => year.status === CYCLE_STATUS.COMPLETED);

        // Si hay ciclos finalizados, agregarlos a la lista
        if (completedYears.length > 0) {
            categories.push({
                label: 'Ciclos Finalizados',
                options: completedYears.map(year => ({
                    value: year.id.toString(),
                    label: year.name,
                })),
            });
        }

        return categories;
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] p-6 lg:p-10">
            <div className="custom-scrollbar flex flex-col overflow-y-auto px-2">
                <div>
                    <h5 className="modal-title mb-2 font-outfit text-theme-xl font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                        {selectedGroup ? 'Editar grupo' : 'Crear nuevo grupo'}
                    </h5>
                    <p className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                        {selectedGroup
                            ? 'Modifica los detalles del grupo según sea necesario.'
                            : 'Completa los campos para crear un nuevo grupo.'}
                    </p>
                </div>

                {/* Mostrar alerta de error si existe */}
                {errorAlert && (
                    <div className="error-alert relative mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                            onClick={() => {
                                // Este es un elemento para cerrar visualmente la alerta,
                                // pero no elimina el error del estado
                                const alertElement = document.querySelector('.error-alert');
                                if (alertElement) alertElement.classList.add('hidden');
                            }}
                        >
                            <IconFA icon="xmark" />
                        </button>
                        <div className="flex items-start">
                            <div className="mr-3 mt-0.5">
                                <IconFA icon="circle-exclamation" className="text-red-500" />
                            </div>
                            <div>
                                <p className="font-semibold">{errorAlert.title}</p>
                                <p>{errorAlert.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="grade" className="font-outfit">
                                Grado
                                <span className="ml-1 text-red-500">*</span>
                            </Label>
                            <Input
                                id="grade"
                                name="grade"
                                type="number"
                                placeholder="Ej. 1"
                                onChange={handleInputChange}
                                defaultValue={formData.grade}
                            />
                        </div>
                        <div>
                            <Label htmlFor="group" className="font-outfit">
                                Grupo
                                <span className="ml-1 text-red-500">*</span>
                            </Label>
                            <Input
                                id="group"
                                name="group"
                                type="text"
                                placeholder="Ej. A"
                                onChange={handleInputChange}
                                defaultValue={formData.group}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <Label htmlFor="schoolYearId" className="font-outfit">
                            Ciclo Escolar
                            <span className="ml-1 text-red-500">*</span>
                        </Label>

                        <SelectWithCategories
                            options={getGroupedSchoolYears()}
                            placeholder="Seleccione un ciclo escolar"
                            onChange={value => handleSelectChange('schoolYearId', value)}
                            defaultValue={getInitialSchoolYear()}
                            maxMenuHeight="max-h-96"
                        />
                    </div>

                    {isLoadingGroupStatuses ? (
                        <div className="flex h-[38px] items-center justify-center rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <div className="mt-6">
                            <Label className="font-outfit">Estado del Grupo</Label>

                            <Select
                                key={`status-${formData.statusId}`}
                                options={groupStatuses}
                                placeholder="Seleccione un estado"
                                onChange={value => handleSelectChange('statusId', value)}
                                defaultValue={formData.statusId}
                            />
                        </div>
                    )}

                    <div className="modal-footer mt-8 flex items-center gap-3 sm:justify-end">
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="outline"
                            className="sm:w-auto"
                            disabled={isSaving}
                        >
                            <span className="font-outfit">Cancelar</span>
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            className="sm:w-auto"
                            disabled={isSaving}
                            startIcon={isSaving ? <IconFA icon="spinner" spin /> : undefined}
                        >
                            <span className="font-outfit">
                                {isSaving
                                    ? 'Guardando...'
                                    : selectedGroup
                                      ? 'Actualizar Grupo'
                                      : 'Crear Grupo'}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
