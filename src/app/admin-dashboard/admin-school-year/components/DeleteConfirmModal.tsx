// React
import { useState, useEffect } from 'react';

// Componentes UI
import Alert from '@/components/core/alert/Alert';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import { Modal } from '@/components/ui/modal';

// Tipos
interface DeleteConfirmModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onConfirm: () => Promise<void>;
    readonly itemName: string;
    readonly isDeleting: boolean;
    readonly isActiveCycle?: boolean;
}

interface AlertState {
    show: boolean;
    variant: 'warning' | 'error' | 'success' | 'info';
    title: string;
    message: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isDeleting,
    isActiveCycle = false
}: DeleteConfirmModalProps) {
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

    // Manejar la confirmación de eliminación
    async function handleConfirmDelete() {
        try {
            await onConfirm();
        } catch (error) {
            console.error('Error al eliminar:', error);
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'Ocurrió un error al intentar eliminar el ciclo. Por favor, intenta nuevamente.'
            });
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[500px] p-6"
        >
            <div className="flex flex-col px-2">
                <div className="mb-4 text-center">
                    <div className="flex justify-center mb-4">
                        <div className={`flex items-center justify-center w-16 h-16 ${isActiveCycle ? 'bg-warning-50 dark:bg-warning-500/15' : 'bg-error-50 dark:bg-error-500/15'} rounded-full`}>
                            <IconFA
                                icon={isActiveCycle ? "circle-exclamation" : "triangle-exclamation"}
                                size="2xl"
                                className={isActiveCycle ? "text-warning-500" : "text-error-500"}
                            />
                        </div>
                    </div>

                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        Confirmar eliminación
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        ¿Estás seguro de que deseas eliminar el ciclo <span className="font-semibold">{itemName}</span>?
                        Esta acción puede ser revertida más adelante desde la sección de ciclos eliminados.
                    </p>

                    {isActiveCycle && (
                        <div className="mt-4">
                            <Alert
                                variant="warning"
                                title="¡Atención!"
                                message="Estás a punto de eliminar un ciclo escolar ACTIVO. Esta acción podría afectar negativamente al funcionamiento del sistema. Por favor, asegúrate de completar el ciclo escolar o activar otro ciclo antes de continuar."
                            />
                        </div>
                    )}
                </div>

                {alertState.show && (
                    <Alert
                        variant={alertState.variant}
                        title={alertState.title}
                        message={alertState.message}
                    />
                )}

                <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-center">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="sm:w-auto"
                        disabled={isDeleting}
                    >
                        <span className="font-outfit">Cancelar</span>
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="primary"
                        className={`sm:w-auto ${isActiveCycle ? 'bg-warning-500 hover:bg-warning-600' : 'bg-error-500 hover:bg-error-600'}`}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <IconFA icon="spinner" spin className="mr-2" />
                                <span className="font-outfit">Eliminando...</span>
                            </>
                        ) : (
                            <>
                                <IconFA icon="trash" className="mr-2" />
                                <span className="font-outfit">Eliminar</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 