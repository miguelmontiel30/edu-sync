"use client";

// React
import { useState, useRef, useEffect } from "react";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import esLocale from '@fullcalendar/core/locales/es';

// Components
import { EventModal } from "./EventModal";
import { Popover } from "@/components/core/popover";
import IconFA from "@/components/ui/IconFA";

// Types
import { CalendarEvent } from "./types";

// Styles
import "./calendar.css";

// Hooks
import { useModal } from "@/hooks/useModal";

interface CalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
}

// Eventos de ejemplo
const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Evento de Conferencia",
    start: new Date().toISOString().split("T")[0],
    extendedProps: {
      calendar: "Peligro",
      roles: ["admin", "teacher"]
    },
  },
  {
    id: "2",
    title: "Reunión",
    start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    extendedProps: {
      calendar: "Éxito",
      roles: ["student", "tutor"]
    },
  },
  {
    id: "3",
    title: "Taller",
    start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    extendedProps: {
      calendar: "Primario",
      roles: ["admin", "teacher", "student"]
    },
  },
];

export function Calendar({
  events: initialEvents = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete
}: CalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(
    initialEvents.length > 0 ? initialEvents : DEFAULT_EVENTS
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Actualizar eventos cuando cambian los initialEvents
  useEffect(() => {
    if (initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    setSelectedRoles(event.extendedProps.roles || []);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      const updatedEvent: CalendarEvent = {
        ...selectedEvent,
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        extendedProps: {
          calendar: eventLevel,
          roles: selectedRoles
        },
      };
      setEvents((prevEvents) =>
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
        end: eventEndDate,
        allDay: true,
        extendedProps: {
          calendar: eventLevel,
          roles: selectedRoles
        },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      onEventAdd?.(newEvent);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedRoles([]);
    setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Agregar Evento +",
              click: openModal,
            },
          }}
        />
      </div>

      <EventModal
        isOpen={isOpen}
        onClose={closeModal}
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
      />
    </div>
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  const roles = eventInfo.event.extendedProps.roles || [];

  const rolesContent = (
    <div className="flex flex-col gap-1">
      {roles.length > 0 ? (
        roles.map((role: string) => (
          <span key={role} className="inline-block px-1.5 py-0.5 rounded text-xs bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        ))
      ) : (
        <span className="text-gray-500 dark:text-gray-400">No hay roles asignados</span>
      )}
    </div>
  );

  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>

      {roles.length > 0 && (
        <Popover
          content={rolesContent}
          title="Público Objetivo"
          position="top"
          trigger="hover"
          hoverDelay={100}
        >
          <div className="fc-event-roles flex items-center ml-1">
            <IconFA icon="users" className="text-xs text-brand-500" />
            <span className="text-xs ml-1">{roles.length}</span>
          </div>
        </Popover>
      )}
    </div>
  );
}
