'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import Alert from '@/components/core/alert/Alert';
import Input from '@/components/form/input/InputField';

interface Message {
    id: string;
    sender: string;
    avatar: string;
    text: string;
    timestamp: string;
    unread: boolean;
    isOutgoing?: boolean;
}

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeConversation: {
        contact: {
            id: string;
            name: string;
            avatar: string;
        };
        messages: Message[];
    } | null;
    onSendMessage: (text: string) => void;
}

export default function MessageModal({
    isOpen,
    onClose,
    activeConversation,
    onSendMessage,
}: MessageModalProps) {
    const [newMessage, setNewMessage] = useState('');
    const [alertState, setAlertState] = useState({
        show: false,
        variant: 'warning' as 'warning' | 'error' | 'success' | 'info',
        title: '',
        message: '',
    });

    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            setAlertState({
                show: true,
                variant: 'warning',
                title: 'Mensaje vacío',
                message: 'Por favor, escriba un mensaje antes de enviar.',
            });
            return;
        }

        onSendMessage(newMessage);
        setNewMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (!activeConversation) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 lg:p-10">
            <div className="custom-scrollbar flex flex-col overflow-y-auto px-2">
                <div className="mb-4 flex items-center">
                    <img
                        src={activeConversation.contact.avatar}
                        alt={activeConversation.contact.name}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                        <h5 className="font-outfit text-theme-xl font-semibold text-gray-800 dark:text-white/90">
                            {activeConversation.contact.name}
                        </h5>
                        <p className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                            Conversación iniciada el {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {alertState.show && (
                    <Alert
                        variant={alertState.variant}
                        title={alertState.title}
                        message={alertState.message}
                    />
                )}

                <div className="mt-4 h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    {activeConversation.messages.map(message => (
                        <div
                            key={message.id}
                            className={`mb-4 flex ${
                                message.isOutgoing ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                    message.isOutgoing
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white'
                                }`}
                            >
                                {!message.isOutgoing && (
                                    <div className="mb-1 flex items-center">
                                        <img
                                            src={message.avatar}
                                            alt={message.sender}
                                            className="mr-2 h-6 w-6 rounded-full object-cover"
                                        />
                                        <span className="text-xs font-medium">
                                            {message.sender}
                                        </span>
                                    </div>
                                )}
                                <p className="text-sm">{message.text}</p>
                                <div
                                    className={`mt-1 text-right text-xs ${
                                        message.isOutgoing
                                            ? 'text-white/80'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    {message.timestamp}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex">
                    <div className="flex-1" onKeyDown={handleKeyDown}>
                        <Input
                            type="text"
                            placeholder="Escribe tu mensaje aquí..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        className="ml-2"
                        startIcon={<IconFA icon="paper-plane" />}
                    >
                        Enviar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
