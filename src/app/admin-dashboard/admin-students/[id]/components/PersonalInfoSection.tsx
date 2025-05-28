import React from 'react';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import { Student } from '../module-utils/types';

interface PersonalInfoSectionProps {
    student: Student;
    onEdit: () => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ student, onEdit }) => (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center p-6">
            <div>
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                    <IconFA icon="address-card" className="mr-2" />
                    Información Personal
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Datos personales del estudiante</p>
            </div>
            <Button
                variant="outline"
                size="sm"
                startIcon={<IconFA icon="pen" />}
                onClick={onEdit}
            >
                Editar
            </Button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre completo</h3>
                    <p className="text-base">{student.full_name}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CURP</h3>
                    <p className="text-base">{student.curp}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de nacimiento</h3>
                    <p className="text-base">{new Date(student.birth_date).toLocaleDateString('es-MX')}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Género</h3>
                    <p className="text-base">{student.gender?.name || 'No especificado'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Correo electrónico</h3>
                    <p className="text-base">{student.email || 'No registrado'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</h3>
                    <p className="text-base">{student.phone || 'No registrado'}</p>
                </div>
            </div>
        </div>
    </div>
);

export default PersonalInfoSection; 