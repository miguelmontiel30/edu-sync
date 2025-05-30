import React from 'react';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';

interface Group {
    id: string;
    year: string;
    name: string;
    level: string;
    teacher: string;
    startDate: string;
    endDate: string;
}

interface GroupHistoryViewProps {
    groups: Group[];
}

const GroupHistoryView: React.FC<GroupHistoryViewProps> = ({ groups = [] }) => {
    // Ordenar grupos por año (más reciente primero)
    const sortedGroups = [...groups].sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <ComponentCard title="Historial de Grupos" desc="Grupos a los que ha pertenecido el estudiante">
            <div className="space-y-6 p-4">
                {sortedGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <IconFA icon="users-slash" size="2xl" className="text-gray-400 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No hay historial de grupos disponible</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">El estudiante no ha sido asignado a ningún grupo anteriormente</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedGroups.map((group) => (
                            <div
                                key={group.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
                                            <IconFA icon="users" className="text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{group.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{group.year}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                            {group.level}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {formatDate(group.startDate)} - {formatDate(group.endDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="flex items-center">
                                        <IconFA icon="chalkboard-teacher" className="text-gray-500 dark:text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Profesor(a):</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{group.teacher}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ComponentCard>
    );
};

export default GroupHistoryView; 