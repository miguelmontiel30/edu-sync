import React, { FC } from 'react';

export interface InputProps {
    type?: string;
    placeholder?: string;
    className?: string;
    startIcon?: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    defaultValue?: string;
    id?: string;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    className = '',
    startIcon,
    value,
    onChange,
    name,
    defaultValue
}) => {
    return (
        <div className="relative">
            {startIcon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    {startIcon}
                </div>
            )}
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-primary ${startIcon ? 'pl-10' : ''} ${className}`}
                value={value}
                onChange={onChange}
                name={name}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default Input;
