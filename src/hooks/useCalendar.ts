/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { CalendarEvent, Role } from '@/components/core/calendar/types';
import { useModal } from './useModal';
import { useSession } from './useSession';
import { getEventTypes } from '@/app/admin-dashboard/admin-calendar/module-utils/queries';

// Color por defecto para eventos sin color
const DEFAULT_COLOR = 'primary';

// Array de colores disponibles para asignar aleatoriamente
const AVAILABLE_COLORS = [
    'primary',
    'success',
    'warning',
    'danger',
    'purple',
    'indigo',
    'cyan',
    'pink',
    'teal',
    'orange',
];

// Función para obtener un color aleatorio del array de colores disponibles
function getRandomColor(): string {
    return AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];
}

// Función para asignar colores consistentes basados en el ID del evento
function getConsistentColor(id: string): string {
    const hash = id
        .split('')
        .slice(0, 5)
        .reduce((acc, char) => {
            return acc + char.charCodeAt(0);
        }, 0);
    return AVAILABLE_COLORS[hash % AVAILABLE_COLORS.length];
}

// Función para normalizar fechas ISO sin problemas de zona horaria
function normalizeDate(dateStr: string): string {
    if (dateStr.includes('T') && (dateStr.includes('+') || dateStr.includes('Z'))) {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    }
    return dateStr;
}

interface UseCalendarProps {
    events: CalendarEvent[];
    onEventAdd?: (event: CalendarEvent) => void;
    onEventUpdate?: (event: CalendarEvent) => void;
    onEventDelete?: (eventId: string) => void;
    _availableRoles?: { role_id: string; name: string }[];
}

export function useCalendar({
    events = [],
    onEventAdd,
    onEventUpdate,
    onEventDelete,
    _availableRoles = [],
}: UseCalendarProps) {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [eventLevel, setEventLevel] = useState(DEFAULT_COLOR);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [eventTypes, setEventTypes] = useState<any[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events);
    const { isOpen, openModal, closeModal } = useModal();
    const { session } = useSession();
    const [shouldOpenModal, setShouldOpenModal] = useState(false);

    // Cargar tipos de eventos cuando se monta el componente
    useEffect(() => {
        const loadEventTypes = async () => {
            try {
                const response = await getEventTypes();
                if (response.data) {
                    setEventTypes(response.data);
                }
            } catch (err) {
                console.error('Error al cargar tipos de eventos:', err);
            }
        };

        loadEventTypes();
    }, [session]);

    // Procesar eventos para asignar colores consistentes si no tienen uno asignado
    const processedEvents = useMemo(() => {
        return events.map(event => {
            if (!event.extendedProps) {
                return {
                    ...event,
                    extendedProps: {
                        calendar: getConsistentColor(event.id),
                        roles: [] as Role[],
                    },
                };
            }

            if (!event.extendedProps.calendar) {
                return {
                    ...event,
                    extendedProps: {
                        ...event.extendedProps,
                        calendar: getConsistentColor(event.id),
                    },
                };
            }

            return event;
        });
    }, [events]);

    // Actualizar eventos cuando cambian los props
    useEffect(() => {
        setCalendarEvents(processedEvents);
    }, [processedEvents]);

    // Efecto para abrir el modal cuando se solicita
    useEffect(() => {
        if (shouldOpenModal) {
            openModal();
            setShouldOpenModal(false);
        }
    }, [shouldOpenModal, openModal]);

    // Resetear campos del modal
    const resetModalFields = () => {
        setEventTitle('');
        setEventStartDate('');
        setEventEndDate('');
        setEventLevel(DEFAULT_COLOR);
        setSelectedRoles([]);
        setSelectedEvent(null);
    };

    // Manejar cierre del modal
    const handleCloseModal = () => {
        closeModal();
        resetModalFields();
    };

    // Manejar selección de fecha
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        resetModalFields();
        setEventStartDate(selectInfo.startStr);
        setEventEndDate(selectInfo.endStr || selectInfo.startStr);
        setEventLevel(getRandomColor());
        setShouldOpenModal(true);
    };

    // Manejar clic en evento
    const handleEventClick = (clickInfo: EventClickArg) => {
        const fcEvent = clickInfo.event;

        // Extraer datos del evento de FullCalendar a nuestro formato
        const extractedEvent: CalendarEvent = {
            id: fcEvent.id || Date.now().toString(),
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
                calendar: fcEvent.extendedProps?.calendar || getRandomColor(),
                roles: fcEvent.extendedProps?.roles || [],
                // Asegurarnos de preservar el ID de la base de datos
                event_id: fcEvent.extendedProps?.event_id || null,
            },
        };

        setSelectedEvent(extractedEvent);
        setEventTitle(extractedEvent.title || '');

        let startDate = '';
        let endDate = '';

        if (fcEvent.start) {
            startDate = normalizeDate(fcEvent.start.toISOString());
        }

        if (fcEvent.end) {
            endDate = normalizeDate(fcEvent.end.toISOString());
        } else if (fcEvent.start) {
            endDate = startDate;
        }

        setEventStartDate(startDate);
        setEventEndDate(endDate);
        setEventLevel(fcEvent.extendedProps?.calendar || getRandomColor());

        const eventRoles = fcEvent.extendedProps?.roles || [];
        const typedRoles = Array.isArray(eventRoles)
            ? eventRoles.map(role =>
                  typeof role === 'string' ? { role_id: '0', name: role } : role,
              )
            : [];

        setSelectedRoles(typedRoles);
        setShouldOpenModal(true);
    };

    // Manejar añadir o actualizar evento
    const handleAddOrUpdateEvent = () => {
        if (!eventTitle.trim() || !eventStartDate) {
            return;
        }

        const finalEventLevel = eventLevel || DEFAULT_COLOR;

        if (selectedEvent) {
            // Preservar descripción y tipo de evento si existen
            const description =
                selectedEvent.description || selectedEvent.extendedProps?.description || '';
            const eventTypeId =
                selectedEvent.event_type_id || selectedEvent.extendedProps?.event_type_id;

            const updatedEvent: CalendarEvent = {
                ...selectedEvent,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate || eventStartDate,
                allDay: true,
                description,
                event_type_id: eventTypeId,
                extendedProps: {
                    ...selectedEvent.extendedProps,
                    calendar: finalEventLevel,
                    roles: selectedRoles,
                    description,
                    event_type_id: eventTypeId,
                },
            };

            setCalendarEvents(prevEvents =>
                prevEvents.map(event => (event.id === selectedEvent.id ? updatedEvent : event)),
            );

            onEventUpdate?.(updatedEvent);
        } else {
            const newEvent: CalendarEvent = {
                id: Date.now().toString(),
                title: eventTitle,
                description: '',
                created_by: '',
                school_id: '',
                school_year_id: '',
                event_type_id: '1',
                start: eventStartDate,
                end: eventEndDate || eventStartDate,
                allDay: true,
                extendedProps: {
                    calendar: finalEventLevel,
                    roles: selectedRoles,
                    description: '',
                    event_type_id: 1,
                },
            };

            setCalendarEvents(prevEvents => [...prevEvents, newEvent]);
            onEventAdd?.(newEvent);
        }

        handleCloseModal();
    };

    // Manejar eliminación de evento
    const handleDeleteEvent = () => {
        if (selectedEvent) {
            // Primero, actualizamos el estado local
            setCalendarEvents(prevEvents =>
                prevEvents.filter(event => event.id !== selectedEvent.id),
            );

            // Luego, llamamos al callback con el ID del evento para actualizar la BD
            if (onEventDelete) {
                onEventDelete(selectedEvent.id);
            } else {
                console.error('No se pudo eliminar el evento: callback no disponible');
            }

            handleCloseModal();
        } else {
            console.error('No hay evento seleccionado para eliminar');
        }
    };

    // Manejar cambio de roles
    const handleRolesChange = (roles: Role[]) => {
        setSelectedRoles(roles);
    };

    // Manejar añadir evento mediante botón
    const handleAddEventButtonClick = () => {
        resetModalFields();
        setShouldOpenModal(true);
    };

    return {
        // Estado
        calendarEvents,
        selectedEvent,
        eventTitle,
        eventStartDate,
        eventEndDate,
        eventLevel,
        selectedRoles,
        eventTypes,
        isOpen,
        session,

        // Métodos
        handleDateSelect,
        handleEventClick,
        handleCloseModal,
        handleAddOrUpdateEvent,
        handleDeleteEvent,
        handleRolesChange,
        handleAddEventButtonClick,
        setEventTitle,
        setEventStartDate,
        setEventEndDate,
        setEventLevel,
    };
}
