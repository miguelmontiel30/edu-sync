import React from 'react';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import { Student, Tutor } from '../module-utils/types';
import { ProfileAvatar } from '@/components/core/avatar';
import ComponentCard from '@/components/common/ComponentCard';

interface ProfileHeaderProps {
    student: Student;
    tutors: Tutor[];
    onAddTutor: (options: any) => void;
    onViewTutorDetails: (tutorId: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    student,
    tutors = [],
    onAddTutor,
    onViewTutorDetails
}) => {
    return (
        <>
            <ComponentCard className='p-5'>
                {/* Información del perfil */}
                <div className="flex flex-col items-center text-center">
                    <ProfileAvatar
                        imageUrl={student.avatar_url}
                        name={student.full_name}
                        size="2xl"
                        className="mb-4"
                    />

                    <h1 className="text-xl font-outfit font-semibold text-gray-800 dark:text-white/90 mb-2">
                        {student.full_name}
                    </h1>

                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2 justify-center">
                            <IconFA icon="envelope" className="text-gray-400" />
                            <span className="truncate">{student.email || 'Sin correo'}</span>
                        </div>

                        <div className="flex items-center gap-2 justify-center">
                            <IconFA icon="phone" className="text-gray-400" />
                            <span>{student.phone || 'Sin teléfono'}</span>
                        </div>

                        <div className="flex items-center gap-2 justify-center">
                            <IconFA icon="calendar" className="text-gray-400" />
                            <span>{student.birth_date ? new Date(student.birth_date).toLocaleDateString('es-MX') : 'No disponible'}</span>
                        </div>
                    </div>
                </div>
            </ComponentCard>

            {/* Sección de Tutores */}
            <ComponentCard title="Tutores" desc="Lista de tutores del estudiante" className='mt-6'>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end items-center">
                        <Button
                            variant="primary"
                            size="sm"
                            startIcon={<IconFA icon="plus" />}
                            onClick={() => onAddTutor({})}
                        >
                            Añadir
                        </Button>
                    </div>

                    {/* Lista de tutores */}
                    <div className="flex flex-col gap-3">
                        {tutors.length > 0 ? (
                            tutors.map((tutor) => (
                                <div
                                    key={tutor.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => onViewTutorDetails(tutor.id)}
                                >
                                    <ProfileAvatar
                                        imageUrl={tutor.avatar_url}
                                        name={tutor.full_name}
                                        size="sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {tutor.full_name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {tutor.relationship}
                                        </p>
                                    </div>
                                    <IconFA icon="chevron-right" className="text-gray-400" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                <p>No hay tutores registrados</p>
                                <p className="text-sm">Añade un tutor para el estudiante</p>
                            </div>
                        )}
                    </div>
                </div>
            </ComponentCard>
        </>
    );
};

export default ProfileHeader; 