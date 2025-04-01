'use client';
// React
import React, {useState} from 'react';

// Next.js
import Image from 'next/image';
import Link from 'next/link';

// Components
import {Dropdown} from '../ui/dropdown/Dropdown';
import {DropdownItem} from '../ui/dropdown/DropdownItem';

export default function UserDropdown() {
    // States
    const [isOpen, setIsOpen] = useState(false);

    function toggleDropdown(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();

        setIsOpen(prev => !prev);
    }

    function closeDropdown() {
        setIsOpen(false);
    }
    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400"
            >
                <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
                    <Image
                        width={44}
                        height={44}
                        src="/images/user1.jpeg"
                        alt="User profile picture"
                    />
                </span>

                <span className="mr-1 block text-theme-sm font-medium">Miguel</span>

                <i
                    className={`fa-duotone fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-gray-500 transition-transform duration-200 dark:text-gray-400`}
                ></i>
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
            >
                <div>
                    <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                        Musharof Chowdhury
                    </span>
                    <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                        randomuser@pimjo.com
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
                            <i className="fa-duotone fa-solid fa-user text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
                            Edit profile
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            tag="a"
                            href="/profile"
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            <i className="fa-duotone fa-solid fa-gear text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
                            Account settings
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            tag="a"
                            href="/profile"
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            <i className="fa-duotone fa-solid fa-circle-info text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
                            Support
                        </DropdownItem>
                    </li>
                </ul>
                <Link
                    href="/signin"
                    className="group mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                    <i className="fa-duotone fa-solid fa-right-from-bracket text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"></i>
                    Sign out
                </Link>
            </Dropdown>
        </div>
    );
}
