'use client';

import { Modal } from '@/components/ui/modal';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: string;
    isLoading?: boolean;
    isActiveItem?: boolean;
    customMessages?: {
        title?: string;
        description?: string;
        cancelButton?: string;
        confirmButton?: string;
    };
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType,
    isLoading = false,
    isActiveItem = false,
    customMessages,
}: DeleteConfirmModalProps) {
    // Mensajes por defecto
    const defaultMessages = {
        title: `Eliminar ${itemType}`,
        description: `¿Estás seguro que deseas eliminar ${itemType === 'materia' ? 'la' : 'el'} ${itemType} "${itemName}"? Esta acción no se puede deshacer.`,
        cancelButton: 'Cancelar',
        confirmButton: 'Eliminar',
    };

    // Combinar mensajes personalizados con los predeterminados
    const messages = { ...defaultMessages, ...customMessages };

    // Renderizar modal
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <IconFA icon="trash" className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 font-outfit text-lg font-medium text-gray-900 dark:text-white">
                    {messages.title}
                </h3>
                <p className="mt-2 font-outfit text-sm text-gray-500 dark:text-gray-400">
                    {messages.description}
                </p>

                {isActiveItem && (
                    <div className="mt-3 rounded-md bg-yellow-50 p-3 text-left">
                        <div className="flex items-start">
                            <IconFA
                                icon="exclamation-triangle"
                                className="mr-2 mt-0.5 text-yellow-500"
                            />
                            <span className="font-outfit text-sm text-yellow-700">
                                Este elemento está activo. Al eliminarlo podrías afectar operaciones
                                en curso.
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-4 py-2"
                        disabled={isLoading}
                    >
                        <span className="font-outfit">{messages.cancelButton}</span>
                    </Button>

                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        className="bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <IconFA icon="spinner" spin className="mr-2" />
                                <span className="font-outfit">Eliminando...</span>
                            </>
                        ) : (
                            <span className="font-outfit">{messages.confirmButton}</span>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
