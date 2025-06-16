'use client';

import { Popover } from './Popover';
import { ReactNode } from 'react';

interface PopoverWithLinkProps {
    children: ReactNode;
    content: ReactNode;
    title?: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    linkText?: string;
    linkIcon?: string;
    className?: string;
    trigger?: 'click' | 'hover';
    hoverDelay?: number;
}

export function PopoverWithLink({
    children,
    content,
    title,
    position = 'bottom',
    linkText = 'Aprender más',
    linkIcon = 'arrow-right',
    className = '',
    trigger = 'click',
    hoverDelay = 200,
}: PopoverWithLinkProps) {
    return (
        <Popover
            content={content}
            position={position}
            title={title}
            showArrow
            withLink
            linkText={linkText}
            linkIcon={linkIcon}
            className={className}
            trigger={trigger}
            hoverDelay={hoverDelay}
        >
            {children}
        </Popover>
    );
}

export default PopoverWithLink;
