"use client";

// React
import { useState, useRef, useEffect, useMemo } from "react";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import esLocale from '@fullcalendar/core/locales/es';

// Components
import { EventModal } from "./EventModal";
import IconFA from "@/components/ui/IconFA";

// Types
import { CalendarEvent } from "./types";

// Styles
import "./calendar.css";

// Hooks
import { useModal } from "@/hooks/useModal";
import { useSession } from '@/hooks/useSession';
import { getEventTypes } from '@/app/admin-dashboard/admin-calendar/module-utils/queries';

// Color por defecto para eventos sin color
const DEFAULT_COLOR = 'primary';

// Array de colores disponibles para asignar aleatoriamente
const AVAILABLE_COLORS = [
  'primary', 'success', 'warning', 'danger',
  'purple', 'indigo', 'cyan', 'pink', 'teal', 'orange'
];

interface CalendarProps {
  /** Eventos para mostrar en el calendario */
  events: CalendarEvent[];
  /** Callback al añadir un evento */
  onEventAdd?: (event: CalendarEvent) => void;
  /** Callback al actualizar un evento */
  onEventUpdate?: (event: CalendarEvent) => void;
  /** Callback al eliminar un evento */
  onEventDelete?: (eventId: string) => void;
  /** Lista de roles disponibles para asignar a los eventos */
  availableRoles?: { role_id: string; name: string }[];
  /** Si está cargando los datos */
  isLoading?: boolean;
}

// Función para obtener un color aleatorio del array de colores disponibles
function getRandomColor(): string {
  return AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];
}

// Función para asignar colores consistentes basados en el ID del evento
function getConsistentColor(id: string): string {
  // Usar las primeras 5 letras/números del ID para generar un número
  const hash = id.split('').slice(0, 5).reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  // Usar el módulo para obtener un índice dentro del rango de colores disponibles
  return AVAILABLE_COLORS[hash % AVAILABLE_COLORS.length];
}

// Función para normalizar fechas ISO sin problemas de zona horaria
function normalizeDate(dateStr: string): string {
  // Si la fecha ya incluye información de zona horaria (T y +/-)
  if (dateStr.includes('T') && (dateStr.includes('+') || dateStr.includes('Z'))) {
    // Crear una fecha en hora local a partir de la UTC
    const date = new Date(dateStr);
    // Devolver solo la parte de la fecha en formato YYYY-MM-DD
    return date.toISOString().split('T')[0];
  }
  // Si ya es una fecha simple YYYY-MM-DD, devolverla sin cambios
  return dateStr;
}

export function Calendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  availableRoles = [],
  isLoading = false
}: CalendarProps) {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState(DEFAULT_COLOR);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Obtener la sesión del usuario
  const { session } = useSession();

  // Cargar tipos de eventos cuando se monta el componente
  useEffect(() => {
    const loadEventTypes = async () => {
      try {
        const response = await getEventTypes();
        if (response.data) {
          setEventTypes(response.data);
        }
      } catch (err) {
        console.error("Error al cargar tipos de eventos:", err);
      }
    }

    loadEventTypes();
  }, [session]);

  // Procesar eventos para asignar colores consistentes si no tienen uno asignado
  const processedEvents = useMemo(() => {
    return events.map(event => {
      // Si el evento no tiene extendedProps o no tiene un color asignado
      if (!event.extendedProps) {
        return {
          ...event,
          extendedProps: {
            calendar: getConsistentColor(event.id),
            roles: []
          }
        };
      }

      // Si tiene extendedProps pero no tiene un color específico
      if (!event.extendedProps.calendar) {
        return {
          ...event,
          extendedProps: {
            ...event.extendedProps,
            calendar: getConsistentColor(event.id)
          }
        };
      }

      return event;
    });
  }, [events]);

  // Actualizar eventos cuando cambian los props
  useEffect(() => {
    setCalendarEvents(processedEvents);
  }, [processedEvents]);

  // Manejar cierre del modal
  const handleCloseModal = () => {
    closeModal();
    resetModalFields();
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    // Usamos startStr directamente ya que FullCalendar nos da la fecha en formato local
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    setEventLevel(getRandomColor()); // Asignar un color aleatorio por defecto
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);

    // Ajustamos las fechas para manejar correctamente las zonas horarias
    let startDate = "";
    let endDate = "";

    if (event.start) {
      // Usamos el método toISOString y luego extraemos solo la parte de la fecha
      startDate = normalizeDate(event.start.toISOString());
    }

    if (event.end) {
      endDate = normalizeDate(event.end.toISOString());
    } else if (event.start) {
      endDate = startDate;
    }

    setEventStartDate(startDate);
    setEventEndDate(endDate);
    setEventLevel(event.extendedProps?.calendar || getRandomColor());
    setSelectedRoles(event.extendedProps?.roles || []);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (!eventTitle.trim() || !eventStartDate) {
      // Validación básica
      return;
    }

    // Asegurarnos de que siempre haya un color seleccionado
    const finalEventLevel = eventLevel || DEFAULT_COLOR;

    if (selectedEvent) {
      const updatedEvent: CalendarEvent = {
        ...selectedEvent,
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate || eventStartDate,
        allDay: true, // Marcar como todo el día para evitar problemas de zona horaria
        extendedProps: {
          calendar: finalEventLevel,
          roles: selectedRoles
        },
      };

      setCalendarEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );

      onEventUpdate?.(updatedEvent);
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate || eventStartDate,
        allDay: true, // Marcar como todo el día para evitar problemas de zona horaria
        extendedProps: {
          calendar: finalEventLevel,
          roles: selectedRoles
        },
      };

      setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
      onEventAdd?.(newEvent);
    }

    handleCloseModal();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setCalendarEvents((prevEvents) =>
        prevEvents.filter(event => event.id !== selectedEvent.id)
      );
      onEventDelete?.(selectedEvent.id);
      handleCloseModal();
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel(DEFAULT_COLOR); // Establecer color por defecto
    setSelectedRoles([]);
    setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <IconFA icon="spinner" spin className="text-2xl text-gray-400" />
        </div>
      ) : (
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día'
            }}
            events={calendarEvents}
            selectable
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Agregar Evento +",
                click: openModal,
              },
            }}
            timeZone="UTC"
            displayEventTime={false}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
            dayMaxEventRows={false}
            height="auto"
          />
        </div>
      )}

      <EventModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteEvent}
        selectedEvent={selectedEvent}
        eventTitle={eventTitle}
        eventStartDate={eventStartDate}
        eventEndDate={eventEndDate}
        eventLevel={eventLevel}
        selectedRoles={selectedRoles}
        onTitleChange={setEventTitle}
        onStartDateChange={setEventStartDate}
        onEndDateChange={setEventEndDate}
        onLevelChange={setEventLevel}
        onRolesChange={setSelectedRoles}
        onSave={handleAddOrUpdateEvent}
        availableRoles={availableRoles}
        eventTypes={eventTypes}
        schoolId={session?.school_id}
        schoolYearId={session?.school_id}
        userId={1}
      />
    </div>
  );
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const { event } = eventInfo;
  const colorClass = event.extendedProps.calendar as string || DEFAULT_COLOR;
  const roles = event.extendedProps.roles || [];

  return (
    <div className={`fc-bg-${colorClass} w-full h-auto min-h-full rounded-md shadow-sm`}>
      {/* Contenido del evento */}
      <div className="p-1.5 flex flex-col h-full">
        {/* Tiempo del evento si está disponible */}
        {eventInfo.timeText && (
          <div className="text-[9px] font-medium opacity-80 mb-0.5 flex items-center">
            <IconFA icon="clock" className="mr-1" size="xs" />
            <span>{eventInfo.timeText}</span>
          </div>
        )}

        {/* Título del evento - sin restricción de líneas */}
        <div className="text-xs font-medium break-words leading-tight whitespace-normal">
          {event.title}
        </div>

        {/* Roles */}
        {roles.length > 0 && (
          <div className="mt-0.5 pt-0.5">
            <div className="flex items-center text-xs opacity-75">
              <IconFA icon="users" className="mr-1" size="xs" />
              <span className="truncate">
                {roles.length > 1
                  ? `${roles.length} participantes`
                  : roles[0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
