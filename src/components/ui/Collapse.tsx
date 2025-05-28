"use client";

import { useState, useRef, useEffect } from "react";
import IconFA from "@/components/ui/IconFA";

interface CollapseProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

const Collapse: React.FC<CollapseProps> = ({
    title,
    children,
    defaultOpen = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | undefined>(
        defaultOpen ? undefined : 0
    );

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
        }
    }, [isOpen]);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`border border-gray-200 rounded-lg dark:border-gray-700 ${className}`}>
            <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={toggleCollapse}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
                <IconFA
                    icon={isOpen ? "chevron-up" : "chevron-down"}
                    className="text-gray-500"
                />
            </button>
            <div
                ref={contentRef}
                style={{ height: contentHeight }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
            >
                <div className="p-4 pt-0">{children}</div>
            </div>
        </div>
    );
};

export default Collapse; 