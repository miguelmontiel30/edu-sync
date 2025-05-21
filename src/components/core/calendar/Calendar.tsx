"use client";

// React
import { useRef } from "react";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';

// Components
import { EventModal } from "./EventModal";
import IconFA from "@/components/ui/IconFA";
import { renderEventContent } from "./renderEventContent";

// Types
import { CalendarEvent, Role } from "./types";

// Styles
import "./calendar.css";

// Hooks
import { useCalendar } from "@/hooks/useCalendar";

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

export function Calendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  availableRoles = [],
  isLoading = false
}: CalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);

  const {
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
    setEventLevel
  } = useCalendar({
    events,
    onEventAdd,
    onEventUpdate,
    onEventDelete,
    availableRoles
  });

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
                click: handleAddEventButtonClick,
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
            weekends={false}
          />
        </div>
      )}

      <EventModal
        key={`event-modal-${isOpen}-${selectedEvent?.id || 'new'}`}
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
        onRolesChange={handleRolesChange}
        onSave={handleAddOrUpdateEvent}
        availableRoles={availableRoles}
        _eventTypes={eventTypes}
        schoolId={session?.school_id}
        schoolYearId={session?.school_id}
        userId={1}
      />
    </div>
  );
}
