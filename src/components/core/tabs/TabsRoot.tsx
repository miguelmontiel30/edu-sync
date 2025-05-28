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
  onValueChange?: (value: string) => void;
}

export function TabsRoot({ children, defaultValue, className, onValueChange }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  // Wrapper para setActiveTab que también llama a onValueChange si existe
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
} 