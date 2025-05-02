import React from 'react';

export interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time' | 'datetime-local' | 'search' | 'url';
    placeholder?: string;
    className?: string;
    startIcon?: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    defaultValue?: string;
    id?: string;
    maxLength?: number;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    className = '',
    startIcon,
    value,
    onChange,
    name,
    defaultValue,
    id,
    maxLength
}) => {
    return (
        <div className="relative">
            {startIcon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    {startIcon}
                </div>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-primary ${startIcon ? 'pl-10' : ''} ${className}`}
                value={value}
                onChange={onChange}
                name={name}
                defaultValue={defaultValue}
                maxLength={maxLength}
            />
        </div>
    );
};

export default Input;
