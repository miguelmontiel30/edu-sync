"use client";

// React
import { FC } from "react";

// Components
import { Calendar } from "@/components/core/calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { EventModal } from "./components/EventModal";

// Hooks
import { useCalendarPage } from "./hooks/useCalendarPage";

/**
 * Página de calendario escolar para administradores
 * Utiliza hooks personalizados para toda la lógica y manejo de datos,
 * manteniendo el componente de página limpio y enfocado en la UI
 */
const CalendarPage: FC = () => {
  // Hook para manejar la lógica de la página y el modal
  const {
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
    setEventLevel
  } = useCalendarPage();

  return (
    <div className="mx-auto max-w-screen-2xl md:p-6">
      <PageBreadcrumb pageTitle={`Calendario escolar ${activeSchoolYear ? `- ${activeSchoolYear.name}` : ''}`} />

      {/* Componente de Calendario simplificado */}
      <Calendar
        events={events}
        isLoading={isLoading}
        onDateSelect={handleDateSelect}
        onEventClick={handleEventClick}
        onAddEventClick={handleAddEventClick}
      />

      {/* Modal de Evento separado del calendario */}
      <EventModal
        key={`event-modal-${isModalOpen}-${selectedEvent?.id || 'new'}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteEventCallback}
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
        onSave={handleSaveEvent}
        availableRoles={availableRoles}
      />
    </div>
  );
};

export default CalendarPage;