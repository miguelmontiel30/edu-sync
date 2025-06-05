'use client';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  mobileFullScreen?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  mobileFullScreen = false 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar al montar
    handleResize();
    
    window.addEventListener('resize', handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.dropdown-toggle')
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      
      // Prevenir scroll del body en móvil cuando el dropdown está abierto
      if (isMobile && mobileFullScreen) {
        document.body.style.overflow = 'hidden';
      }
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restaurar scroll del body
      document.body.style.overflow = '';
    };
  }, [onClose, isOpen, isMobile, mobileFullScreen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para móviles */}
      {isMobile && mobileFullScreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
          onClick={onClose}
        />
      )}

      {/* Contenedor del dropdown */}
      <div
        ref={dropdownRef}
        className={`
          ${isMobile ? 
            mobileFullScreen ?
              'fixed inset-x-4 bottom-4 top-20 max-h-[calc(100vh-6rem)]' :
              'fixed left-4 right-4 top-16 max-h-[calc(100vh-5rem)]'
            : 
            'absolute right-0 mt-2 max-h-96'
          }
          z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl
          dark:border-gray-800 dark:bg-gray-900
          ${isMobile ? 'w-auto' : 'w-80 sm:w-96'}
          ${className}
        `}
      >
        {/* Contenido con scroll personalizado */}
        <div className={`h-full flex flex-col ${isMobile ? 'pb-safe' : ''}`}>
          {children}
        </div>
      </div>
    </>
  );
};