'use client';

// import { useState } from 'react'; // Removed unused import
import Select from '@/components/form/Select';

interface GroupSelectorProps {
    selectedGroup: string | null;
    onGroupChange: (groupId: string) => void;
    isLoading: boolean;
}

// En un proyecto real, estos datos vendrían de una API o base de datos
const mockGroups = [
    { id: 'group1', name: '1° Primaria A' },
    { id: 'group2', name: '1° Primaria B' },
    { id: 'group3', name: '2° Primaria A' },
    { id: 'group4', name: '2° Primaria B' },
    { id: 'group5', name: '3° Primaria A' },
];

export default function GroupSelector({ selectedGroup, onGroupChange, isLoading: _isLoading }: GroupSelectorProps) {
    const options = mockGroups.map(group => ({
        value: group.id,
        label: group.name
    }));

    return (
        <div className="w-full">
            <Select
                options={options}
                placeholder="Selecciona un grupo"
                onChange={onGroupChange}
                className="w-full md:w-72"
                defaultValue={selectedGroup || ''}
            />
        </div>
    );
} 