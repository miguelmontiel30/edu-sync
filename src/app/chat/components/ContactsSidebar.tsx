'use client';
import { cn } from '@/lib/utils';
import IconFA from '@/components/ui/IconFA';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { useState } from 'react';

type ChatGroup = {
    id: number;
    name: string;
    type: 'class' | 'private' | 'announcement';
    unread: number;
    lastMessage?: string;
    lastMessageTime?: string;
    role?: string;
    avatar?: string;
    isUrgent?: boolean;
};

interface ContactsSidebarProps {
    groups: ChatGroup[];
    activeChat: number | null;
    onChatSelect: (chatId: number) => void;
}

export default function ContactsSidebar({
    groups,
    activeChat,
    onChatSelect,
}: ContactsSidebarProps) {
    const [expandGroups, setExpandGroups] = useState(false);

    // Separate groups by type
    const classGroups = groups.filter(g => g.type === 'class');
    const privateChats = groups.filter(g => g.type === 'private');
    const announcements = groups.filter(g => g.type === 'announcement');

    // Show only first 3 class groups unless expanded
    const visibleClassGroups = expandGroups ? classGroups : classGroups.slice(0, 3);

    return (
        <div className="h-full w-full">
            <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mensajes</h2>
                <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <IconFA icon="search" className="text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar chats"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
            </div>
            <div className="h-[calc(100%-80px)] overflow-y-auto px-2">
                {/* GRUPOS DE CLASE */}
                <div className="mb-2 mt-4">
                    <div className="mb-2 flex items-center gap-2 px-2">
                        <IconFA icon="school" style="duotone" className="text-brand-500" />
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            GRUPOS DE CLASE
                        </h3>
                    </div>
                    {visibleClassGroups.map(group => (
                        <div
                            key={group.id}
                            className={cn(
                                'mb-1 flex cursor-pointer items-center rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800',
                                activeChat === group.id ? 'bg-gray-100 dark:bg-gray-800' : '',
                            )}
                            onClick={() => onChatSelect(group.id)}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                                <IconFA icon="users-class" style="duotone" />
                            </div>
                            <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {group.name}
                                    </h3>
                                    {group.lastMessageTime && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {group.lastMessageTime}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                        {group.lastMessage || 'Sin mensajes'}
                                    </p>
                                    {group.unread > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
                                            {group.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {classGroups.length > 3 && (
                        <button
                            className="flex w-full items-center justify-center py-1 text-xs text-brand-500 hover:underline"
                            onClick={() => setExpandGroups(!expandGroups)}
                        >
                            {expandGroups ? (
                                <>
                                    <IconFA icon="chevron-up" className="mr-1" /> Mostrar menos
                                </>
                            ) : (
                                <>
                                    <IconFA icon="chevron-down" className="mr-1" /> Mostrar{' '}
                                    {classGroups.length - 3} más
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* CHATS PRIVADOS */}
                <div className="mb-2 mt-6">
                    <div className="mb-2 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <IconFA icon="user" style="duotone" className="text-indigo-500" />
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                CHATS PRIVADOS
                            </h3>
                        </div>
                        <button
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                            aria-label="Nuevo chat"
                        >
                            <IconFA
                                icon="plus"
                                className="text-gray-600 dark:text-gray-300"
                                size="sm"
                            />
                        </button>
                    </div>

                    {privateChats.map(chat => (
                        <div
                            key={chat.id}
                            className={cn(
                                'mb-1 flex cursor-pointer items-center rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800',
                                activeChat === chat.id ? 'bg-gray-100 dark:bg-gray-800' : '',
                            )}
                            onClick={() => onChatSelect(chat.id)}
                        >
                            <ProfileAvatar name={chat.name} src={chat.avatar} />
                            <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {chat.name}
                                    </h3>
                                    {chat.lastMessageTime && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {chat.lastMessageTime}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                        {chat.lastMessage || 'Sin mensajes'}
                                    </p>
                                    {chat.unread > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-3 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="plus" />
                        </div>
                        <span className="text-sm">Nuevo chat</span>
                    </button>
                </div>

                {/* ANUNCIOS */}
                <div className="mb-2 mt-6">
                    <div className="mb-2 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <IconFA icon="bullhorn" style="duotone" className="text-amber-500" />
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                ANUNCIOS
                            </h3>
                        </div>
                        <button
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                            aria-label="Nuevo anuncio"
                        >
                            <IconFA
                                icon="plus"
                                className="text-gray-600 dark:text-gray-300"
                                size="sm"
                            />
                        </button>
                    </div>

                    {announcements.map(announcement => (
                        <div
                            key={announcement.id}
                            className={cn(
                                'mb-1 flex cursor-pointer items-center rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800',
                                activeChat === announcement.id
                                    ? 'bg-gray-100 dark:bg-gray-800'
                                    : '',
                            )}
                            onClick={() => onChatSelect(announcement.id)}
                        >
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-lg',
                                    announcement.isUrgent
                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                                )}
                            >
                                <IconFA
                                    icon={announcement.isUrgent ? 'bell-exclamation' : 'bell'}
                                    style="duotone"
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {announcement.name}
                                    </h3>
                                    {announcement.lastMessageTime && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {announcement.lastMessageTime}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                        {announcement.lastMessage || 'Sin mensajes'}
                                    </p>
                                    {announcement.unread > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                            {announcement.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
