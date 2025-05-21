"use client";

// React
import React, { useState, useEffect } from "react";

// Components
import { Calendar, CalendarEvent } from "@/components/core/calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

// Hooks
import { useSession } from "@/hooks/useSession";

// Services
import { getCalendarData } from "./module-utils/services";

// Utils
import { processEvents, translateRolesToSpanish } from "./module-utils/utils";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availableRoles, setAvailableRoles] = useState<{ role_id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hook de sesion
  const { session } = useSession();

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);

        if (!session?.school_id) {
          console.error("No hay ID de escuela disponible");

          // Usar eventos de ejemplo si no hay sesión
          setEvents([]);

          // Usar roles de ejemplo si no hay sesión
          setAvailableRoles([]);

          return;
        }

        // Obtener datos del calendario usando el servicio
        const calendarData = await getCalendarData(session.school_id);

        // Establecer eventos en el estado
        if (calendarData.events && calendarData.events.length > 0) {
          // Procesar eventos para corregir problemas de zona horaria
          const processedEvents = processEvents(calendarData.events);

          // Establecer eventos en el estado
          setEvents(processedEvents);
        } else {
          setEvents([]);
        }

        // Establecer roles disponibles desde la respuesta con nombres traducidos
        if (calendarData.roles && calendarData.roles.length > 0) {
          // Traducir los nombres de roles a español
          const translatedRoles = translateRolesToSpanish(calendarData.roles);

          setAvailableRoles(translatedRoles);
        } else {
          setAvailableRoles([]);
        }
      } catch (error) {
        console.error("Error al cargar los datos del calendario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [session]);

  const handleEventAdd = (event: CalendarEvent) => {
    // Asegurarnos de que el evento incluya allDay para evitar problemas de zona horaria
    const eventToAdd = {
      ...event,
      allDay: true
    };

    setEvents(prev => [...prev, eventToAdd]);
  };

  const handleEventUpdate = (event: CalendarEvent) => {
    // Asegurarnos de que el evento incluya allDay para evitar problemas de zona horaria
    const eventToUpdate = {
      ...event,
      allDay: true
    };

    setEvents(prev => prev.map(e => e.id === event.id ? eventToUpdate : e));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <div className="mx-auto max-w-screen-2xl md:p-6">
      <PageBreadcrumb pageTitle="Calendario escolar" />

      <Calendar
        events={events}
        availableRoles={availableRoles}
        isLoading={isLoading}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
}
