import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface Category {
    label: string;
    options: Option[];
}

interface SelectWithCategoriesProps {
    options: Category[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    defaultValue?: string;
    maxMenuHeight?: string;
}

const SelectWithCategories: React.FC<SelectWithCategoriesProps> = ({
    options,
    placeholder = 'Seleccione una opción',
    onChange,
    className = '',
    defaultValue = '',
    maxMenuHeight = 'max-h-96',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue || '');
    const selectRef = useRef<HTMLDivElement>(null);

    // Actualizar el valor seleccionado cuando cambia defaultValue
    useEffect(() => {
        if (defaultValue) {
            setSelectedValue(defaultValue);
        }
    }, [defaultValue]);

    // Cerrar el select cuando se hace clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onChange(value);
        setIsOpen(false);
    };

    const getSelectedLabel = () => {
        for (const category of options) {
            const option = category.options.find(opt => opt.value === selectedValue);
            if (option) return option.label;
        }
        return placeholder;
    };

    return (
        <div ref={selectRef} className="relative">
            <div
                className={`h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    selectedValue
                        ? 'text-gray-800 dark:text-white/90'
                        : 'text-gray-400 dark:text-gray-400'
                } ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="block truncate">{getSelectedLabel()}</span>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <i
                        className={`fa-duotone fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400`}
                    ></i>
                </div>
            </div>

            {isOpen && (
                <div
                    className={`absolute z-50 mt-1 ${maxMenuHeight} w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 sm:text-sm`}
                >
                    {options.map((category, index) => (
                        <div key={index}>
                            {/* Título de la categoría */}
                            <div className="sticky top-0 z-10 bg-white px-4 py-2 text-xs font-semibold text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                {category.label}
                            </div>

                            {/* Opciones de la categoría */}
                            {category.options.map(option => (
                                <div
                                    key={option.value}
                                    className={`relative cursor-pointer select-none py-2 pl-4 pr-9 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                        selectedValue === option.value
                                            ? 'bg-gray-100 dark:bg-gray-800'
                                            : ''
                                    }`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span
                                        className={`block truncate ${
                                            selectedValue === option.value
                                                ? 'font-medium text-brand-500 dark:text-brand-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {option.label}
                                    </span>
                                    {selectedValue === option.value && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <i className="fa-duotone fa-solid fa-check text-brand-500 dark:text-brand-400"></i>
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Divisor entre categorías */}
                            {index < options.length - 1 && (
                                <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectWithCategories;
