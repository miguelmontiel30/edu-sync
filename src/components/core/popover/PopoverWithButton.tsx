"use client";

import { Popover } from './Popover';
import React, { ReactNode } from 'react';

interface PopoverWithButtonProps {
    children: ReactNode;
    content: ReactNode;
    title?: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    buttonText?: string;
    className?: string;
    trigger?: 'click' | 'hover';
    hoverDelay?: number;
}

export function PopoverWithButton({
    children,
    content,
    title,
    position = 'bottom',
    buttonText = 'Ver más',
    className = '',
    trigger = 'click',
    hoverDelay = 200
}: PopoverWithButtonProps) {
    return (
        <Popover
            content={content}
            position={position}
            title={title}
            showArrow={true}
            withButton={true}
            buttonText={buttonText}
            className={className}
            trigger={trigger}
            hoverDelay={hoverDelay}
        >
            {children}
        </Popover>
    );
}

export default PopoverWithButton; 