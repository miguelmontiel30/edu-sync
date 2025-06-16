'use client';

import React, { ReactNode } from 'react';
import { useTabs } from './TabsRoot'; // Asegúrate que la ruta sea correcta

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  // Permite clases adicionales para personalizar aún más si es necesario
}

export function TabsContent({ children, value, className, ...props }: TabsContentProps) {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  if (!isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0} // Para que el contenido sea enfocable
      className={className} // Permite pasar clases para estilos como padding, etc.
      {...props}
    >
      {children}
    </div>
  );
} 