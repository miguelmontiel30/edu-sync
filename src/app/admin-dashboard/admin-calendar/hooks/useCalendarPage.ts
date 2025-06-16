// React
import { useState } from 'react';

// Hooks
import { useAdminCalendar } from './useAdminCalendar';
import { useSession } from '@/hooks/useSession';

// Types
import { CalendarEvent, Role } from '@/components/core/calendar/types';

export function useCalendarPage() {
    // Estado para el modal de eventos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [eventLevel, setEventLevel] = useState('primary');
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

    // Datos de sesión para el modal
    const { session } = useSession();

    // Hook para los datos y operaciones de calendario
    const {
        events,
        availableRoles,
        isLoading,
        activeSchoolYear,
        handleEventAdd,
        handleEventUpdate,
        handleEventDelete,
    } = useAdminCalendar();

    // Manejador para cuando se selecciona una fecha en el calendario
    const handleDateSelect = (info: any) => {
        const startDate = info.startStr.split('T')[0];
        const endDate = info.endStr ? info.endStr.split('T')[0] : startDate;

        // Reiniciar el estado del modal para un nuevo evento
        setEventTitle('');
        setEventStartDate(startDate);
        setEventEndDate(endDate);
        setEventLevel('primary');
        setSelectedRoles([]);
        setSelectedEvent(null);

        // Abrir el modal
        setIsModalOpen(true);
    };

    // Manejador para cuando se hace click en un evento existente
    const handleEventClick = (info: any) => {
        const fcEvent = info.event;

        console.log('Evento seleccionado:', fcEvent);

        // Extraer datos relevantes del evento de FullCalendar
        const extractedEvent: CalendarEvent = {
            id: fcEvent.id || '',
            title: fcEvent.title || '',
            description: fcEvent.extendedProps?.description || '',
            created_by: fcEvent.extendedProps?.created_by || '',
            school_id: fcEvent.extendedProps?.school_id || '',
            school_year_id: fcEvent.extendedProps?.school_year_id || '',
            event_type_id: fcEvent.extendedProps?.event_type_id || '',
            start: fcEvent.startStr || '',
            end: fcEvent.endStr || '',
            allDay: fcEvent.allDay || false,
            extendedProps: {
                ...fcEvent.extendedProps,
                calendar: fcEvent.extendedProps?.calendar || 'primary',
                roles: fcEvent.extendedProps?.roles || [],
            },
        };

        // Establecer el evento seleccionado
        setSelectedEvent(extractedEvent);

        // Establecer los datos para el modal
        setEventTitle(extractedEvent.title || '');

        // Extraer la fecha del string de fecha completo
        const startDate =
            typeof extractedEvent.start === 'string'
                ? extractedEvent.start.split('T')[0]
                : new Date().toISOString().split('T')[0];
        setEventStartDate(startDate);

        // Extraer la fecha de fin, si existe
        let endDate = startDate;
        if (extractedEvent.end) {
            endDate =
                typeof extractedEvent.end === 'string'
                    ? extractedEvent.end.split('T')[0]
                    : startDate;
        }
        setEventEndDate(endDate);

        setEventLevel(extractedEvent.extendedProps.calendar);
        setSelectedRoles(extractedEvent.extendedProps.roles || []);

        // Abrir el modal
        setIsModalOpen(true);
    };

    // Manejador para el botón de añadir evento
    const handleAddEventClick = () => {
        const today = new Date().toISOString().split('T')[0];

        // Reiniciar el estado del modal para un nuevo evento
        setEventTitle('');
        setEventStartDate(today);
        setEventEndDate(today);
        setEventLevel('primary');
        setSelectedRoles([]);
        setSelectedEvent(null);

        // Abrir el modal
        setIsModalOpen(true);
    };

    // Manejador para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Manejador para cambiar los roles seleccionados
    const handleRolesChange = (roles: Role[]) => {
        setSelectedRoles(roles);
    };

    // Manejador para guardar o actualizar un evento
    const handleSaveEvent = () => {
        // Si no hay un evento seleccionado, crear uno nuevo
        if (!selectedEvent) {
            // Crear un nuevo objeto de evento
            const newEvent: CalendarEvent = {
                id: 'temp-' + new Date().getTime(), // ID temporal
                title: eventTitle,
                description: '',
                created_by: session?.id?.toString() || '',
                school_id: session?.school_id?.toString() || '',
                school_year_id: activeSchoolYear?.school_year_id.toString() || '',
                event_type_id: '',
                start: eventStartDate + 'T00:00:00',
                end: eventEndDate + 'T23:59:59',
                allDay: true,
                extendedProps: {
                    calendar: eventLevel,
                    roles: selectedRoles,
                    description: '',
                },
            };

            // Llamar al manejador de añadir evento del hook useAdminCalendar
            handleEventAdd(newEvent);
        } else {
            // Actualizar evento existente
            const updatedEvent: CalendarEvent = {
                ...selectedEvent,
                title: eventTitle,
                start: eventStartDate + 'T00:00:00',
                end: eventEndDate + 'T23:59:59',
                extendedProps: {
                    ...selectedEvent.extendedProps,
                    calendar: eventLevel,
                    roles: selectedRoles,
                },
            };

            // Llamar al manejador de actualizar evento del hook useAdminCalendar
            handleEventUpdate(updatedEvent);
        }

        // Cerrar el modal
        setIsModalOpen(false);
    };

    // Manejador para eliminar un evento
    const handleDeleteEventCallback = () => {
        if (selectedEvent) {
            // Llamar al manejador de eliminar evento del hook useAdminCalendar
            handleEventDelete(selectedEvent.id);

            // Cerrar el modal
            setIsModalOpen(false);
        }
    };

    return {
        // Datos
        events,
        availableRoles,
        isLoading,
        activeSchoolYear,

        // Estado del modal
        isModalOpen,
        selectedEvent,
        eventTitle,
        eventStartDate,
        eventEndDate,
        eventLevel,
        selectedRoles,

        // Manejadores para el calendario
        handleDateSelect,
        handleEventClick,
        handleAddEventClick,

        // Manejadores para el modal
        handleCloseModal,
        handleSaveEvent,
        handleDeleteEventCallback,
        handleRolesChange,
        setEventTitle,
        setEventStartDate,
        setEventEndDate,
        setEventLevel,
    };
}
