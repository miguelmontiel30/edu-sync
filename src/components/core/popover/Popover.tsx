"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import IconFA from '@/components/ui/IconFA';

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';
type PopoverTrigger = 'click' | 'hover';

interface PopoverProps {
    children: ReactNode;
    content: ReactNode;
    position?: PopoverPosition;
    title?: string;
    showArrow?: boolean;
    withButton?: boolean;
    withLink?: boolean;
    className?: string;
    buttonText?: string;
    linkText?: string;
    linkIcon?: string;
    trigger?: PopoverTrigger;
    hoverDelay?: number;
}

export function Popover({
    children,
    content,
    position = 'bottom',
    title,
    showArrow = true,
    withButton = false,
    withLink = false,
    className = '',
    buttonText = 'Ver más',
    linkText = 'Aprender más',
    linkIcon = 'arrow-right',
    trigger = 'click',
    hoverDelay = 200
}: PopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleToggle = () => {
        if (trigger === 'click') {
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        if (trigger === 'hover') {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setIsOpen(true);
            }, hoverDelay);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === 'hover') {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setIsOpen(false);
            }, hoverDelay);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            popoverRef.current &&
            !popoverRef.current.contains(event.target as Node) &&
            triggerRef.current &&
            !triggerRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen && trigger === 'click') {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isOpen, trigger]);

    // Posición del popover
    const getPopoverPosition = (): string => {
        switch (position) {
            case 'top':
                return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
            case 'right':
                return 'left-full top-1/2 -translate-y-1/2 ml-2';
            case 'left':
                return 'right-full top-1/2 -translate-y-1/2 mr-2';
            case 'bottom':
            default:
                return 'top-full left-1/2 -translate-x-1/2 mt-2';
        }
    };

    // Posición de la flecha
    const getArrowPosition = (): string => {
        switch (position) {
            case 'top':
                return 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-white dark:border-t-gray-800 border-r-transparent border-l-transparent border-b-transparent';
            case 'right':
                return 'left-[-6px] top-1/2 -translate-y-1/2 border-r-white dark:border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent';
            case 'left':
                return 'right-[-6px] top-1/2 -translate-y-1/2 border-l-white dark:border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent';
            case 'bottom':
            default:
                return 'top-[-6px] left-1/2 -translate-x-1/2 border-b-white dark:border-b-gray-800 border-r-transparent border-l-transparent border-t-transparent';
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={triggerRef}
                onClick={handleToggle}
                className="inline-block cursor-pointer"
            >
                {children}
            </div>

            {isOpen && (
                <div
                    ref={popoverRef}
                    className={`absolute z-50 min-w-[200px] max-w-[300px] rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 ${getPopoverPosition()} ${className}`}
                    onMouseEnter={trigger === 'hover' ? handleMouseEnter : undefined}
                    onMouseLeave={trigger === 'hover' ? handleMouseLeave : undefined}
                >
                    {showArrow && (
                        <div className={`absolute w-0 h-0 border-[6px] ${getArrowPosition()}`}></div>
                    )}

                    {title && (
                        <div className="mb-1 font-medium text-gray-800 dark:text-white text-theme-sm">
                            {title}
                        </div>
                    )}

                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        {content}
                    </div>

                    {withButton && (
                        <div className="mt-3">
                            <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600">
                                {buttonText}
                            </button>
                        </div>
                    )}

                    {withLink && (
                        <div className="mt-3">
                            <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600">
                                {linkText}
                                <IconFA icon={linkIcon} size="xs" />
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Popover; 