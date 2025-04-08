'use client';
// React
import React, { useState } from 'react';

// Next.js
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Components
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import IconFA from '@/components/ui/IconFA';

// Context
import { useSessionContext } from '@/context/SessionContext';

export default function UserDropdown() {
    // States
    const [isOpen, setIsOpen] = useState(false);
    const { session, logout } = useSessionContext();
    const router = useRouter();

    function toggleDropdown(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        setIsOpen(prev => !prev);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    async function handleLogout() {
        try {
            logout();
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    if (!session) return null;

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="dropdown-toggle flex items-center font-outfit text-gray-700 dark:text-gray-400"
            >
                <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
                    <Image
                        width={44}
                        height={44}
                        src="/images/user1.jpeg"
                        alt="Foto de perfil del usuario"
                    />
                </span>

                <span className="mr-1 block text-theme-sm font-medium">{session.first_name}</span>

                <IconFA
                    icon={isOpen ? "chevron-up" : "chevron-down"}
                    style="duotone"
                    className="text-gray-500 transition-transform duration-200 dark:text-gray-400"
                />
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 font-outfit shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
            >
                <div>
                    <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                        {`${session.first_name || ''} ${session.last_name || ''}`}
                    </span>
                    <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                        {session.email}
                    </span>
                </div>

                <ul className="flex flex-col gap-1 border-b border-gray-200 pb-3 pt-4 dark:border-gray-800">
                    <li>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            tag="a"
                            href="/profile"
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            <IconFA icon="user" style="duotone" className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                            Editar perfil
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            tag="a"
                            href="/profile"
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            <IconFA icon="gear" style="duotone" className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                            Configuración de cuenta
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            tag="a"
                            href="/profile"
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            <IconFA icon="circle-info" style="duotone" className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                            Soporte
                        </DropdownItem>
                    </li>
                </ul>
                <button
                    onClick={handleLogout}
                    className="group mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                    <IconFA icon="right-from-bracket" style="duotone" className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                    Cerrar sesión
                </button>
            </Dropdown>
        </div>
    );
}
