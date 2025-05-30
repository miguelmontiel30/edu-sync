import {useState} from 'react';

interface Tab {
    id: string;
    label: string;
    icon: string;
    notificationCount?: number;
}

/**
 * Hook para manejar las pestañas del perfil de estudiante
 * @returns Estado y funciones para gestionar las pestañas
 */
export default function useStudentProfileTabs() {
    // Estado para almacenar la pestaña activa
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [academicTab, setAcademicTab] = useState<string>('pending-tasks');

    // Definir las pestañas disponibles
    const tabs: Tab[] = [
        {id: 'profile', label: 'Perfil', icon: 'user'},
        {id: 'academics', label: 'Académico', icon: 'graduation-cap'},
        {id: 'payments', label: 'Pagos', icon: 'credit-card'},
        {id: 'documents', label: 'Documentos', icon: 'file-alt'},
        {id: 'health', label: 'Salud & Emergencias', icon: 'heart-pulse'},
        {id: 'communications', label: 'Comunicaciones', icon: 'comments'},
        {id: 'downloads', label: 'Descargas', icon: 'download'},
    ];

    // Definir las pestañas disponibles
    const academicTabs: Tab[] = [
        {id: 'pending-tasks', label: 'Tareas Pendientes', icon: 'tasks'},
        {id: 'grades', label: 'Calificaciones', icon: 'chart-user'},
        {id: 'attendance', label: 'Asistencia', icon: 'calendar-check'},
        {id: 'group-history', label: 'Historial de Grupos', icon: 'rectangle-history-circle-user'},
    ];

    // Función para cambiar la pestaña activa
    const changeTab = (tabId: string) => {
        setActiveTab(tabId);
    };

    // Función para cambiar la pestaña académica activa
    const changeAcademicTab = (tabId: string) => {
        setAcademicTab(tabId);
    };

    return {
        activeTab,
        changeTab,
        tabs,
        academicTabs,
        academicTab,
        changeAcademicTab,
    };
}
