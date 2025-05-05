// React
import { useEffect, useState, useCallback } from 'react';

// Types
import { Group, GROUP_STATUS } from '@/app/admin-dashboard/admin-groups/module-utils/types';

// Services
import { loadAllGroupsData } from '@/app/admin-dashboard/admin-groups/module-utils/services';

// Hooks
import { useSession } from '@/hooks/useSession';

// Interfaz para categorías de SelectWithCategories
interface Category {
    label: string;
    options: Array<{ value: string; label: string }>;
    isActive?: boolean;
}

export const useGroupStudentsManagement = () => {
    // Estados
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Opciones para el SelectWithCategories
    const [groupCategories, setGroupCategories] = useState<Category[]>([]);

    // Obtener datos de sesión
    const { session } = useSession();

    // Cargar los grupos
    const loadGroups = useCallback(async () => {
        if (!session?.school_id) return;

        setIsLoading(true);
        setError(null);

        try {
            // Cargar los grupos activos
            const { active } = await loadAllGroupsData(session.school_id);

            // Guardar los grupos activos
            setGroups(active);

            // Agrupar los grupos por ciclo escolar
            const groupedBySchoolYear: Record<string, Group[]> = {};

            active.forEach(group => {
                // Obtener el ID del ciclo escolar
                const yearId = group.schoolYear.id.toString();

                // Verificar si el ciclo escolar ya está en el objeto
                if (!groupedBySchoolYear[yearId]) {
                    groupedBySchoolYear[yearId] = [];
                }

                // Agregar el grupo al ciclo escolar correspondiente
                groupedBySchoolYear[yearId].push(group);
            });

            // Transformar en formato de categorías para SelectWithCategories
            const categories: Category[] = Object.entries(groupedBySchoolYear)
                .map(([_yearId, yearGroups]) => {
                    // Filtrar solo grupos activos
                    const activeGroups = yearGroups.filter(group =>
                        Number(group.status_id) === Number(GROUP_STATUS.ACTIVE)
                    );

                    // Si no hay grupos activos, no crear categoría
                    if (activeGroups.length === 0) return null;

                    // Ordenar grupos por grado y grupo
                    const sortedGroups = [...activeGroups].sort((a: Group, b: Group) => {
                        // Si el grado es diferente, ordenar por grado
                        if (a.grade !== b.grade) return a.grade - b.grade;

                        // Si el grado es el mismo, ordenar por grupo
                        return a.group.localeCompare(b.group);
                    });

                    return {
                        label: sortedGroups[0].schoolYear.name,
                        isActive: sortedGroups[0].schoolYear.status === 'active',
                        options: sortedGroups.map(group => ({
                            value: group.id.toString(),
                            label: `${group.grade}° ${group.group}`
                        }))
                    };
                })
                .filter(Boolean) as Category[]; // Filtrar categorías nulas

            // Ordenar categorías por nombre de ciclo escolar (más reciente primero)
            categories.sort((a, b) => {
                // Primero ordenar por estado activo
                if (a.isActive && !b.isActive) return -1;
                if (!a.isActive && b.isActive) return 1;

                // Como criterio secundario, ordenar por nombre (más reciente primero)
                return b.label.localeCompare(a.label);
            });

            setGroupCategories(categories);
        } catch (error) {
            console.error('Error al cargar grupos:', error);
            setError('No se pudieron cargar los grupos. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }, [session?.school_id]);

    // Manejar cambio de grupo seleccionado
    const handleGroupChange = (value: string) => {
        if (!value) {
            setSelectedGroup(null);
            return;
        }

        const group = groups.find(g => g.id.toString() === value);
        setSelectedGroup(group || null);
    };

    // Cargar datos al iniciar
    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    return {
        groups,
        selectedGroup,
        isLoading,
        error,
        groupCategories,
        handleGroupChange,
        loadGroups
    };
};