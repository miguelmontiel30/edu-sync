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

    // Función para cambiar la pestaña activa
    const changeTab = (tabId: string) => {
        setActiveTab(tabId);
    };

    return {
        activeTab,
        changeTab,
        tabs,
    };
}
