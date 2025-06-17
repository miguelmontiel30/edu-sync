import React from 'react';

interface CheckboxProps {
    label?: string; // Optional label for the checkbox
    checked: boolean; // Checked state
    id?: string; // Unique ID for the checkbox
    onChange: (checked: boolean) => void; // Change handler
    disabled?: boolean; // Disabled state
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, id, onChange, disabled = false }) => (
    <label
        className={`flex cursor-pointer items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
        />
        <span
            className={`flex h-5 w-5 items-center justify-center rounded border ${checked ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-white'} transition-colors`}
        >
            {checked && (
                <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </span>
        {label && (
            <span className="font-outfit text-theme-sm font-medium text-gray-700 dark:text-white">
                {label}
            </span>
        )}
    </label>
);

export default Checkbox;
