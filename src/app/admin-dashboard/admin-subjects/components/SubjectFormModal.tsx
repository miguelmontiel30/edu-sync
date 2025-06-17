// React
import { useState, useEffect } from 'react';

// Componentes UI
import IconFA from '@/components/ui/IconFA';
import { Modal } from '@/components/ui/modal';
import Alert from '@/components/core/alert/Alert';
import Button from '@/components/core/button/Button';

// Componentes de formulario
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Input from '@/components/form/input/InputField';

// Types & Utils
import { AlertState, Subject, SubjectData } from '../module-utils/types';

// Hooks
import { useStatusOptions } from '@/hooks/useStatusData';

interface SubjectFormModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSave: (
        subjectData: SubjectData,
    ) => Promise<{ success: boolean; errorMessage?: string }>;
    readonly selectedSubject: Subject | null;
    readonly isSaving: boolean;
}

export default function SubjectFormModal({
    isOpen,
    onClose,
    onSave,
    selectedSubject,
    isSaving,
}: SubjectFormModalProps) {
    // States
    const [subjectForm, setSubjectForm] = useState<SubjectData>({
        name: '',
        description: '',
        status_id: '18', // Establecemos un valor por defecto (activo)
    });

    const [alertState, setAlertState] = useState<AlertState>({
        show: false,
        variant: 'warning',
        title: '',
        message: '',
    });

    // Hooks
    const { options: statusOptions, isLoading: isLoadingStatus } = useStatusOptions('subject');

    // Efecto para cerrar automáticamente la alerta después de 5 segundos
    useEffect(() => {
        if (alertState.show) {
            const timer = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertState.show]);

    // Efecto para inicializar el formulario cuando se abre el modal
    useEffect(() => {
        if (isOpen && statusOptions.length > 0) {
            if (selectedSubject) {
                // Inicializar con datos de la materia seleccionada
                const newFormData = {
                    name: selectedSubject.name || '',
                    description: selectedSubject.description || '',
                    status_id: selectedSubject.status?.status_id?.toString() || '18',
                };

                // Actualizar el estado del formulario
                setSubjectForm(newFormData);
            } else {
                // Limpiar el formulario para nuevo registro
                resetForm();
            }
        } else if (!isOpen) {
            // Cuando se cierra el modal, resetear el formulario
            resetForm();
        }
    }, [isOpen, selectedSubject, statusOptions.length]);

    function resetForm() {
        setSubjectForm({
            name: '',
            description: '',
            status_id: '18', // Siempre establecemos estado ACTIVO al crear nuevo
        });
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        // Obtener el nombre y valor del input
        const { name, value } = e.target;

        // Actualizar el estado del formulario
        setSubjectForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSelectChange(value: string) {
        // Actualizar el estado del formulario
        setSubjectForm(prev => ({
            ...prev,
            status_id: value,
        }));
    }

    async function handleSaveSubject() {
        // Validar que los campos requeridos estén completos
        if (!subjectForm.name) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'Por favor, complete el nombre de la materia.',
            });
            return;
        }

        // Guardar la materia
        const result = await onSave(subjectForm);

        // Mostrar error si el guardado falló
        if (!result.success && result.errorMessage) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: result.errorMessage,
            });
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 lg:p-10">
            <div className="custom-scrollbar flex flex-col overflow-y-auto px-2">
                <div className="mb-4">
                    <h5 className="modal-title mb-2 font-outfit text-theme-xl font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                        {selectedSubject ? 'Editar materia' : 'Nueva materia'}
                    </h5>

                    <p className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                        Define los detalles de la materia para la enseñanza académica.
                    </p>
                </div>

                {alertState.show && (
                    <Alert
                        variant={alertState.variant}
                        title={alertState.title}
                        message={alertState.message}
                    />
                )}

                <div className="mt-4">
                    <div>
                        <Label htmlFor="subject-name" className="font-outfit">
                            Nombre de la materia
                        </Label>
                        <Input
                            id="subject-name"
                            type="text"
                            placeholder="Ej. Matemáticas"
                            onChange={handleInputChange}
                            name="name"
                            value={subjectForm.name}
                        />
                    </div>

                    <div className="mt-6">
                        <Label htmlFor="subject-description" className="font-outfit">
                            Descripción
                        </Label>
                        <Input
                            id="subject-description"
                            type="text"
                            placeholder="Ej. Matemáticas básicas y avanzadas"
                            onChange={handleInputChange}
                            name="description"
                            value={subjectForm.description}
                        />
                    </div>

                    {isLoadingStatus ? (
                        <div className="flex h-[38px] items-center justify-center rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <div className="mt-6">
                            <Label htmlFor="subject-status" className="font-outfit">
                                Estado
                            </Label>

                            <Select
                                key={`status-select-${isOpen}-${selectedSubject?.id || 'new'}-${subjectForm.status_id}`}
                                options={statusOptions}
                                onChange={handleSelectChange}
                                defaultValue={subjectForm.status_id}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-col-reverse items-center gap-4 md:flex-row md:justify-end">
                    <Button variant="outline" onClick={onClose} className="w-full md:w-auto">
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleSaveSubject}
                        variant="primary"
                        className="sm:w-auto"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <IconFA icon="spinner" spin className="mr-2" />
                                <span className="font-outfit">Guardando...</span>
                            </>
                        ) : (
                            <span className="font-outfit">
                                <IconFA
                                    icon={selectedSubject ? 'sync' : 'book-medical'}
                                    className="mr-2"
                                />
                                {selectedSubject ? 'Actualizar Materia' : 'Crear Materia'}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
