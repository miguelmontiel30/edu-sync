import React, { useState, useEffect, useRef } from 'react';

interface Option {
    value: string;
    text: string;
    selected: boolean;
}

interface MultiSelectProps {
    label: string;
    options: Option[];
    defaultSelected?: string[];
    onChange?: (selected: string[]) => void;
    disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    options,
    defaultSelected = [],
    onChange,
    disabled = false,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar el menú desplegable cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Actualizar los valores seleccionados cuando cambian las props
    useEffect(() => {
        setSelectedOptions(defaultSelected);
    }, [defaultSelected]);

    const toggleDropdown = () => {
        if (disabled) return;
        setIsOpen(prev => !prev);
    };

    const handleSelect = (optionValue: string) => {
        const newSelectedOptions = selectedOptions.includes(optionValue)
            ? selectedOptions.filter(value => value !== optionValue)
            : [...selectedOptions, optionValue];

        setSelectedOptions(newSelectedOptions);
        if (onChange) onChange(newSelectedOptions);
    };

    const removeOption = (_index: number, value: string) => {
        const newSelectedOptions = selectedOptions.filter(opt => opt !== value);
        setSelectedOptions(newSelectedOptions);
        if (onChange) onChange(newSelectedOptions);
    };

    const selectedValuesText = selectedOptions.map(
        value => options.find(option => option.value === value)?.text || '',
    );

    return (
        <div className="w-full" ref={containerRef}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {label}
            </label>

            <div className="relative z-20 inline-block w-full" ref={dropdownRef}>
                <div className="relative flex flex-col items-center">
                    <div onClick={toggleDropdown} className="w-full">
                        <div className={`mb-2 flex min-h-[2.75rem] rounded-lg border py-1.5 pl-3 pr-3 shadow-theme-xs outline-none transition ${isOpen ? 'border-brand-400 ring-1 ring-brand-300 dark:border-brand-400 dark:ring-brand-300/50' : 'border-gray-300 dark:border-gray-700'} dark:bg-gray-900`}>
                            <div className="flex flex-auto flex-wrap gap-2">
                                {selectedValuesText.length > 0 ? (
                                    selectedValuesText.map((text, index) => (
                                        <div
                                            key={index}
                                            className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                                        >
                                            <span className="max-w-full flex-initial">{text}</span>
                                            <div className="flex flex-auto flex-row-reverse">
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeOption(index, selectedOptions[index]);
                                                    }}
                                                    className="cursor-pointer pl-2 text-gray-500 group-hover:text-gray-400 dark:text-gray-400"
                                                >
                                                    <svg
                                                        className="fill-current"
                                                        role="button"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 14 14"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <input
                                        placeholder="Select option"
                                        className="h-full w-full appearance-none border-0 bg-transparent p-1 pr-2 text-sm outline-none placeholder:text-gray-800 focus:border-0 focus:outline-none focus:ring-0 dark:placeholder:text-white/90"
                                        readOnly
                                        value="Select option"
                                    />
                                )}
                            </div>
                            <div className="flex w-7 items-center py-1 pl-1 pr-1">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDropdown();
                                    }}
                                    className="h-5 w-5 cursor-pointer text-gray-700 outline-none focus:outline-none dark:text-gray-400"
                                >
                                    <svg
                                        className={`stroke-current ${isOpen ? 'rotate-180' : ''}`}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {isOpen && (
                        <div
                            className="absolute left-0 top-full z-40 w-full max-h-60 overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
                            style={{
                                maxHeight: '200px',
                                overflowY: 'auto',
                                position: 'absolute',
                                transform: 'translateY(4px)'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col w-full">
                                {options.length === 0 && (
                                    <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No hay opciones disponibles
                                    </div>
                                )}
                                {options.map((option, index) => (
                                    <div key={index}>
                                        <div
                                            className={`hover:bg-gray-100 dark:hover:bg-gray-800 w-full cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-b-0`}
                                            onClick={() => handleSelect(option.value)}
                                        >
                                            <div
                                                className={`relative flex w-full items-center p-2.5 pl-3 ${selectedOptions.includes(option.value)
                                                    ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                                                    : 'text-gray-800 dark:text-white/90'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOptions.includes(option.value)}
                                                    onChange={() => handleSelect(option.value)}
                                                    className="mr-3 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-brand-500"
                                                />
                                                <span className="mx-2 leading-6 select-none">
                                                    {option.text}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;
