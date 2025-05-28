'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function useTabs(): TabsContextProps {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider (TabsRoot component)');
  }
  return context;
}

interface TabsRootProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
}

export function TabsRoot({ children, defaultValue, className }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
} 