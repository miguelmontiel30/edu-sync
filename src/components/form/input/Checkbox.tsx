import React from "react";

interface CheckboxProps {
    label?: string; // Optional label for the checkbox
    checked: boolean; // Checked state
    className?: string;
    id?: string; // Unique ID for the checkbox
    onChange: (checked: boolean) => void; // Change handler
    disabled?: boolean; // Disabled state
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    id,
    onChange,
    className = "",
    disabled = false,
}) => (
    <label className={`flex items-center gap-2 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
        />
        <span
            className={`
        flex items-center justify-center w-5 h-5 rounded border
        ${checked ? "bg-brand-500 border-brand-500" : "bg-white border-gray-300"}
        transition-colors
      `}
        >
            {checked && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </span>
        {label && (
            <span className="font-medium font-outfit text-gray-700 text-theme-sm dark:text-white">{label}</span>
        )}
    </label>
);

export default Checkbox;
