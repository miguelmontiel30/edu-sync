"use client";

import { Popover } from './Popover';
import React, { ReactNode } from 'react';

interface PopoverWithTitleProps {
    children: ReactNode;
    content: ReactNode;
    title: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
    trigger?: 'click' | 'hover';
    hoverDelay?: number;
}

export function PopoverWithTitle({
    children,
    content,
    title,
    position = 'bottom',
    className = '',
    trigger = 'click',
    hoverDelay = 200
}: PopoverWithTitleProps) {
    return (
        <Popover
            content={content}
            position={position}
            title={title}
            showArrow
            withButton={false}
            withLink={false}
            className={className}
            trigger={trigger}
            hoverDelay={hoverDelay}
        >
            {children}
        </Popover>
    );
}

export default PopoverWithTitle; 