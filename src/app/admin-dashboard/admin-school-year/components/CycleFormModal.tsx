// React
import { useState, useEffect } from 'react';

// Componentes UI
import IconFA from '@/components/ui/IconFA';
import { Modal } from '@/components/ui/modal';
import Alert from '@/components/core/alert/Alert';
import Button from '@/components/core/button/Button';

// Componentes de formulario
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

// Types & Utils
import { CYCLE_STATUS, SchoolCycle } from '../module-utils/types';

// Hooks
import { useStatusOptions } from '@/hooks/useStatusData';

interface CycleFormModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSave: (cycleData: { name: string; startDate: string; endDate: string; status: string }) => Promise<{ success: boolean; errorMessage?: string }>;
    readonly selectedCycle: SchoolCycle | null;
    readonly isSaving: boolean;
    readonly currentCycles: SchoolCycle[];
}

interface AlertState {
    show: boolean;
    variant: 'warning' | 'error' | 'success' | 'info';
    title: string;
    message: string;
}

export default function CycleFormModal({ isOpen, onClose, onSave, selectedCycle, isSaving, currentCycles }: CycleFormModalProps) {
    // Obtener estados de ciclo escolar usando nuestro hook
    const { options: statusOptions, isLoading: isLoadingStatus } = useStatusOptions('school_year');

    const [cycleForm, setCycleForm] = useState({
        name: '',
        startDate: '',
        endDate: '',
        status: ''
    });

    const [alertState, setAlertState] = useState<AlertState>({
        show: false,
        variant: 'warning',
        title: '',
        message: ''
    });

    // Efecto para cerrar automáticamente la alerta después de 5 segundos
    useEffect(() => {
        if (alertState.show) {
            const timer = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertState.show]);

    // Función para inicializar un nuevo ciclo con valores por defecto
    function initializeCycleForm() {
        if (selectedCycle) {
            setCycleForm({
                name: selectedCycle.name,
                startDate: selectedCycle.startDate,
                endDate: selectedCycle.endDate,
                status: selectedCycle.status.toString()
            });
        } else {
            setCycleForm({
                name: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                status: statusOptions.find(option => option.value === CYCLE_STATUS.ACTIVE)?.value || ''
            });
        }

    }

    // Efecto para inicializar el formulario cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            // Inicializar el formulario con los datos del ciclo seleccionado
            initializeCycleForm();
        } else {
            resetForm();
        }
    }, [selectedCycle, isOpen, statusOptions]);

    function resetForm() {
        setCycleForm({
            name: '',
            startDate: '',
            endDate: '',
            status: ''
        });
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setCycleForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSelectChange(value: string) {
        setCycleForm(prev => ({
            ...prev,
            status: value
        }));
    }

    async function handleSaveCycle() {
        // Validar que los campos requeridos estén completos
        if (!cycleForm.name || !cycleForm.startDate || !cycleForm.endDate || !cycleForm.status) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'Por favor, complete todos los campos requeridos.'
            });

            return;
        }

        // Validar que la fecha de inicio sea anterior a la fecha de fin
        if (new Date(cycleForm.startDate) >= new Date(cycleForm.endDate)) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'La fecha de inicio debe ser anterior a la fecha de fin.'
            });
            return;
        }

        // Convertir el código de estado a ID antes de guardar
        const cycleDataToSave: { name: string; startDate: string; endDate: string; status: string; id?: number } = {
            name: cycleForm.name,
            startDate: cycleForm.startDate,
            endDate: cycleForm.endDate,
            status: cycleForm.status
        };

        // Si es una edición, incluimos el ID
        if (selectedCycle) {
            cycleDataToSave.id = selectedCycle.id;
        }

        // Guardar el ciclo
        const result = await onSave(cycleDataToSave);

        // Mostrar error si el guardado falló
        if (!result.success && result.errorMessage) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: result.errorMessage
            });
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div className="mb-4">
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        {selectedCycle ? "Editar ciclo escolar" : "Define un nuevo ciclo escolar"}
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        El conjunto de fechas clave que delimitan el periodo académico, en el que se asignan grupos, materias y alumnos para organizar eficazmente el año escolar.
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
                        <div>
                            <Label htmlFor="cycle-name" className="font-outfit">
                                Nombre del ciclo escolar
                            </Label>
                            <Input
                                id="cycle-name"
                                type="text"
                                placeholder={`Ej. Ciclo ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                                onChange={(e) => handleInputChange(e)}
                                name="name"
                                value={cycleForm.name}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <Label className="font-outfit">
                            Estado del Ciclo
                        </Label>

                        {isLoadingStatus ? (
                            <div className="flex items-center justify-center h-[38px] bg-gray-50 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                                <IconFA icon="spinner" spin className="text-gray-400" />
                            </div>
                        ) : (
                            <Select
                                key={`status-select-${selectedCycle?.id || 'new'}-${cycleForm.status}`}
                                options={statusOptions}
                                placeholder="Seleccione un estado"
                                onChange={(value) => handleSelectChange(value)}
                                defaultValue={cycleForm.status}
                            />
                        )}
                    </div>

                    <div className="mt-6">
                        <Label htmlFor="cycle-start-date" className="font-outfit">
                            Ingrese la fecha de inicio
                        </Label>

                        <Input
                            id="cycle-start-date"
                            type="date"
                            name="startDate"
                            placeholder="Fecha de inicio"
                            onChange={(e) => handleInputChange(e)}
                            value={cycleForm.startDate}
                        />
                    </div>

                    <div className="mt-6">
                        <Label htmlFor="cycle-end-date" className="font-outfit">
                            Ingrese la fecha de fin
                        </Label>
                        <Input
                            id="cycle-end-date"
                            type="date"
                            name="endDate"
                            placeholder="Fecha de fin"
                            onChange={(e) => handleInputChange(e)}
                            value={cycleForm.endDate}
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
                        onClick={handleSaveCycle}
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
                            <span className="font-outfit">{selectedCycle ? "Actualizar Ciclo" : "Crear Ciclo"}</span>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 