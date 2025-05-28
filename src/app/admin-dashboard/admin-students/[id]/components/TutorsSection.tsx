import React from 'react';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import { ProfileAvatar } from '@/components/core/avatar';
import { Tutor } from '../module-utils/types';

interface TutorsSectionProps {
    tutors: Tutor[];
    onAddTutor: () => void;
    onViewTutorDetails: (tutorId: string) => void;
}

/**
 * Componente para mostrar la lista de tutores de un estudiante
 */
const TutorsSection: React.FC<TutorsSectionProps> = ({
    tutors,
    onAddTutor,
    onViewTutorDetails
}) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5 flex justify-between items-center">
                <div>
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                        <IconFA icon="family" style='solid' className="mr-2" />
                        Tutores
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tutores y responsables del estudiante</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    startIcon={<IconFA icon="plus" />}
                    onClick={onAddTutor}
                >
                    Añadir
                </Button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 p-4">
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
                                {tutor.phone && (
                                    <a
                                        href={`tel:${tutor.phone}`}
                                        className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <IconFA icon="phone" />
                                    </a>
                                )}
                                <IconFA icon="chevron-right" className="text-gray-400" />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <IconFA icon="user-friends" className="text-gray-300 dark:text-gray-600 text-3xl mb-3" />
                            <p>No hay tutores registrados</p>
                            <p className="text-sm mt-1">Añade un tutor para el estudiante</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorsSection; 