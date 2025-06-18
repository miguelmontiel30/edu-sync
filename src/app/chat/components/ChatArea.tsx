'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import IconFA from '@/components/ui/IconFA';
import ProfileAvatar from '@/components/ui/ProfileAvatar';

export type Message = {
    id: number;
    text: string;
    sender: {
        id: number;
        name: string;
        role: 'student' | 'teacher' | 'admin';
        avatar?: string;
    };
    timestamp: Date;
    read: boolean;
    isImportant?: boolean;
    isAnnouncement?: boolean;
};

type ChatType = 'class' | 'private' | 'announcement';

export type ChatDetails = {
    id: number;
    name: string;
    type: ChatType;
    studentCount?: number;
    teacherCount?: number;
    description?: string;
    participants?: {
        id: number;
        name: string;
        role: 'student' | 'teacher' | 'admin';
        avatar?: string;
    }[];
};

interface ChatAreaProps {
    chatDetails: ChatDetails | null;
    messages: Message[];
    onSendMessage: (
        text: string,
        options?: { isImportant?: boolean; isAnnouncement?: boolean },
    ) => void;
    userRole: 'student' | 'teacher' | 'admin';
}

export default function ChatArea({
    chatDetails,
    messages,
    onSendMessage,
    userRole,
}: ChatAreaProps) {
    const [newMessage, setNewMessage] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [isAnnouncement, setIsAnnouncement] = useState(false);
    const [activeTab, setActiveTab] = useState<'messages' | 'participants'>('messages');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        onSendMessage(newMessage, { isImportant, isAnnouncement });
        setNewMessage('');
        setIsImportant(false);
        setIsAnnouncement(false);
    };

    // Render the appropriate header based on chat type
    const renderHeader = () => {
        if (!chatDetails) return null;

        switch (chatDetails.type) {
            case 'class':
                return (
                    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                                <IconFA icon="users-class" style="duotone" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {chatDetails.name}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <IconFA icon="user-graduate" className="text-xs" />
                                        {chatDetails.studentCount || 0} alumnos
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <IconFA icon="chalkboard-teacher" className="text-xs" />
                                        {chatDetails.teacherCount || 0} profesores
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex cursor-pointer items-center gap-1 rounded-t-lg border-b-2 border-transparent px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                <IconFA icon="file-arrow-up" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Archivos
                                </span>
                            </div>
                            <div className="flex overflow-hidden rounded-lg border">
                                <button
                                    className={cn(
                                        'px-4 py-2 text-sm',
                                        activeTab === 'messages'
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                                    )}
                                    onClick={() => setActiveTab('messages')}
                                >
                                    Mensajes
                                </button>
                                <button
                                    className={cn(
                                        'px-4 py-2 text-sm',
                                        activeTab === 'participants'
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                                    )}
                                    onClick={() => setActiveTab('participants')}
                                >
                                    Participantes
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'private':
                return (
                    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-center">
                            <ProfileAvatar name={chatDetails.name} />
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {chatDetails.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">En línea</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <IconFA icon="phone" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <IconFA icon="video" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <IconFA icon="ellipsis-v" />
                            </button>
                        </div>
                    </div>
                );
            case 'announcement':
                return (
                    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <IconFA icon="bullhorn" style="duotone" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {chatDetails.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {chatDetails.description ||
                                        'Avisos importantes para la comunidad'}
                                </p>
                            </div>
                        </div>
                        {userRole === 'admin' && (
                            <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600">
                                <IconFA icon="plus" />
                                <span>Nuevo Anuncio</span>
                            </button>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const getMessageStyles = (message: Message) => {
        // Base styles for all messages
        const baseStyles = 'rounded-lg px-4 py-2 max-w-md';

        // Styles for announcement messages
        if (message.isAnnouncement) {
            return cn(
                baseStyles,
                'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-l-4 border-amber-500',
            );
        }

        // Styles based on sender role
        switch (message.sender.role) {
            case 'student':
                return cn(baseStyles, 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white');
            case 'teacher':
                return cn(
                    baseStyles,
                    message.isImportant
                        ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200 border-l-4 border-sky-500'
                        : 'bg-sky-50 dark:bg-sky-900/20 text-gray-800 dark:text-white',
                );
            case 'admin':
                return cn(
                    baseStyles,
                    'bg-purple-50 dark:bg-purple-900/20 text-gray-800 dark:text-white',
                );
            default:
                return cn(baseStyles, 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white');
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col">
            {renderHeader()}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map(message => (
                    <div key={message.id} className="mb-5">
                        <div className="flex items-start gap-3">
                            {/* Show avatar for all messages for better clarity */}
                            <ProfileAvatar
                                name={message.sender.name}
                                src={message.sender.avatar}
                                className="h-9 w-9"
                            />

                            <div className="flex flex-col">
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                                        {message.sender.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                    {message.sender.role === 'teacher' && (
                                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                            Profesor
                                        </span>
                                    )}
                                    {message.sender.role === 'admin' && (
                                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                            Admin
                                        </span>
                                    )}
                                </div>

                                <div className={getMessageStyles(message)}>
                                    {message.isImportant && !message.isAnnouncement && (
                                        <div className="mb-1 flex items-center gap-1 text-sky-600 dark:text-sky-400">
                                            <IconFA
                                                icon="thumbtack"
                                                style="duotone"
                                                className="text-xs"
                                            />
                                            <span className="text-xs font-medium">Importante</span>
                                        </div>
                                    )}
                                    {message.isAnnouncement && (
                                        <div className="mb-1 flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                            <IconFA
                                                icon="bell"
                                                style="duotone"
                                                className="text-xs"
                                            />
                                            <span className="text-xs font-medium">Anuncio</span>
                                        </div>
                                    )}
                                    {message.text}
                                </div>

                                <div className="mt-1 flex items-center gap-2">
                                    <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                        <IconFA icon="reply" className="text-xs" /> Responder
                                    </button>
                                    {(userRole === 'admin' || userRole === 'teacher') && (
                                        <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                            <IconFA icon="thumbtack" className="text-xs" /> Destacar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message input */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                {(userRole === 'teacher' || userRole === 'admin') && (
                    <div className="mb-2 flex items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={isImportant}
                                onChange={e => setIsImportant(e.target.checked)}
                                className="rounded text-brand-500 focus:ring-brand-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Enviar como importante
                            </span>
                        </label>

                        {userRole === 'admin' && (
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={isAnnouncement}
                                    onChange={e => setIsAnnouncement(e.target.checked)}
                                    className="rounded text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Enviar como anuncio
                                </span>
                            </label>
                        )}
                    </div>
                )}

                <div className="flex items-center">
                    <button className="mr-3 text-gray-500 dark:text-gray-400">
                        <IconFA icon="paperclip" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="Escribe un mensaje..."
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={newMessage.trim() === ''}
                        className={cn(
                            'ml-3 rounded-full p-2',
                            newMessage.trim() === ''
                                ? 'bg-gray-300 text-gray-500 dark:bg-gray-700'
                                : 'bg-brand-500 text-white',
                        )}
                    >
                        <IconFA icon="paper-plane" />
                    </button>
                </div>
            </div>
        </div>
    );
}
