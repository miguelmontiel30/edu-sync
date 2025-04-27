// React
import { useState, useEffect } from 'react';

// Componentes UI
import Alert from '@/components/core/alert/Alert';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import { Modal } from '@/components/ui/modal';

// Tipos
export interface DeleteConfirmModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onConfirm: () => Promise<void>;
    readonly itemName: string;
    readonly itemType: string;
    readonly isDeleting: boolean;
    readonly isActiveItem?: boolean;
    readonly customMessages?: {
        title?: string;
        confirmation?: string;
        warningTitle?: string;
        warningMessage?: string;
        errorTitle?: string;
        errorMessage?: string;
        recoveryInfo?: string;
    };
    readonly customColors?: {
        activeItemClass?: string;
        inactiveItemClass?: string;
        activeIconColor?: string;
        inactiveIconColor?: string;
        buttonClass?: string;
    };
    readonly customIcons?: {
        activeItemIcon?: string;
        inactiveItemIcon?: string;
        deleteIcon?: string;
        loadingIcon?: string;
    };
}

interface AlertState {
    show: boolean;
    variant: 'warning' | 'error' | 'success' | 'info';
    title: string;
    message: string;
}

// Función auxiliar para determinar el artículo correcto según el tipo de ítem
function getArticle(itemType: string): string {
    if (itemType === 'ciclo') return 'el';
    if (itemType === 'alumno') return 'al';
    return 'la';
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType,
    isDeleting,
    isActiveItem = false,
    customMessages,
    customColors,
    customIcons
}: DeleteConfirmModalProps) {
    const [alertState, setAlertState] = useState<AlertState>({
        show: false,
        variant: 'warning',
        title: '',
        message: ''
    });

    // Valores por defecto
    const title = customMessages?.title || 'Confirmar eliminación';
    const confirmation = customMessages?.confirmation ||
        `¿Estás seguro de que deseas eliminar ${getArticle(itemType)} ${itemType} `;
    const warningTitle = customMessages?.warningTitle || '¡Atención!';
    const warningMessage = customMessages?.warningMessage ||
        `Estás a punto de eliminar un ${itemType} ACTIVO. Esta acción podría afectar negativamente al funcionamiento del sistema.`;
    const errorTitle = customMessages?.errorTitle || 'Error';
    const errorMessage = customMessages?.errorMessage ||
        `Ocurrió un error al intentar eliminar ${getArticle(itemType)} ${itemType}. Por favor, intenta nuevamente.`;
    const recoveryInfo = customMessages?.recoveryInfo ||
        `Esta acción puede ser revertida más adelante desde la sección de ${itemType}s eliminados.`;

    // Colores y clases
    const activeItemClass = customColors?.activeItemClass || 'bg-warning-50 dark:bg-warning-500/15';
    const inactiveItemClass = customColors?.inactiveItemClass || 'bg-error-50 dark:bg-error-500/15';
    const activeIconColor = customColors?.activeIconColor || 'text-warning-500';
    const inactiveIconColor = customColors?.inactiveIconColor || 'text-error-500';
    const buttonClass = customColors?.buttonClass || `${isActiveItem ? 'bg-warning-500 hover:bg-warning-600' : 'bg-error-500 hover:bg-error-600'}`;

    // Iconos
    const activeItemIcon = customIcons?.activeItemIcon || 'circle-exclamation';
    const inactiveItemIcon = customIcons?.inactiveItemIcon || 'triangle-exclamation';
    const deleteIcon = customIcons?.deleteIcon || 'trash';
    const loadingIcon = customIcons?.loadingIcon || 'spinner';

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
            console.error(`Error al eliminar ${itemType}:`, error);
            setAlertState({
                show: true,
                variant: 'error',
                title: errorTitle,
                message: errorMessage
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
                        <div className={`flex items-center justify-center w-16 h-16 ${isActiveItem ? activeItemClass : inactiveItemClass} rounded-full`}>
                            <IconFA
                                icon={isActiveItem ? activeItemIcon : inactiveItemIcon}
                                size="2xl"
                                className={isActiveItem ? activeIconColor : inactiveIconColor}
                            />
                        </div>
                    </div>

                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        {title}
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        {confirmation}<span className="font-semibold">{itemName}</span>?
                        {recoveryInfo && ` ${recoveryInfo}`}
                    </p>

                    {isActiveItem && (
                        <div className="mt-4">
                            <Alert
                                variant="warning"
                                title={warningTitle}
                                message={warningMessage}
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
                        className={`sm:w-auto ${buttonClass}`}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <IconFA icon={loadingIcon} spin className="mr-2" />
                                <span className="font-outfit">Eliminando...</span>
                            </>
                        ) : (
                            <>
                                <IconFA icon={deleteIcon} className="mr-2" />
                                <span className="font-outfit">Eliminar</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}