'use client';

import React, { ReactNode } from 'react';
import { useTabs } from './TabsRoot'; // Asegúrate que la ruta sea correcta

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
  // Permite clases adicionales para personalizar aún más si es necesario
}

export function TabsTrigger({ children, value, className, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      onClick={() => setActiveTab(value)}
      className={`
        whitespace-nowrap py-3 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm focus:outline-none transition-colors duration-150 
        focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-purple-500 dark:focus-visible:ring-offset-gray-800
        ${isActive
          ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-300'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
} 