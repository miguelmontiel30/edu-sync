'use client';

// import { useState, useEffect } from 'react'; // Removed unused imports
import Select from '@/components/form/Select';

interface StudentSelectorProps {
    selectedStudent: string | null;
    onStudentChange: (studentId: string) => void;
    isLoading?: boolean;
}

// En un proyecto real, estos datos vendrían de una API
const mockStudents = [
    { value: 'student1', label: 'Juan Pérez García' },
    { value: 'student2', label: 'María López Sánchez' },
    { value: 'student3', label: 'Carlos Rodríguez Flores' },
    { value: 'student4', label: 'Ana Martínez Vega' },
    { value: 'student5', label: 'Roberto Sánchez Díaz' },
    { value: 'student6', label: 'Patricia Ramírez Ortega' },
    { value: 'student7', label: 'Luis González Torres' },
    { value: 'student8', label: 'Sofía Torres Luna' },
    { value: 'student9', label: 'Alejandro Castro Medina' },
];

export default function StudentSelector({ selectedStudent, onStudentChange, isLoading: _isLoading = false }: StudentSelectorProps) {
    return (
        <div className="w-full">
            <Select
                options={mockStudents}
                placeholder="Selecciona un estudiante"
                onChange={onStudentChange}
                className="w-full"
                defaultValue={selectedStudent || ''}
            />
        </div>
    );
} 