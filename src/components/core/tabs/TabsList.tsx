'use client';

import React, { ReactNode } from 'react';

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  // Permite pasar clases para personalizar el estilo, como la barra inferior, espaciado, etc.
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div 
      role="tablist"
      className={`border-b border-gray-200 dark:border-gray-700 mb-6 ${className || ''}`}
      {...props}
    >
      <nav className="-mb-px flex space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
} 