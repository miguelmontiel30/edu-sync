"use client";

// React
import { useState, useEffect } from "react";

// Components
import { Calendar, CalendarEvent } from "@/components/core/calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

// Hooks
import { useSession } from "@/hooks/useSession";

// Services
import { loadSchoolYearsBySchoolId } from "../admin-school-year/module-utils/services";
import { getCalendarData, createEvent, updateEventWithRecipients, removeEvent } from "./module-utils/services";

// Utils
import { processEvents, translateRolesToSpanish } from "./module-utils/utils";

// Types
import { EventData, EventRecipient } from "./module-utils/types";

// Interfaz para el ciclo escolar desde la base de datos
interface DatabaseSchoolYear {
  school_year_id: number;
  name: string;
  status_id: number;
  [key: string]: any;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availableRoles, setAvailableRoles] = useState<{ role_id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSchoolYear, setActiveSchoolYear] = useState<DatabaseSchoolYear | null>(null);

  // Hook de sesion
  const { session } = useSession();
  const schoolId = session?.school_id;

  useEffect(() => {
    if (!schoolId) {
      setIsLoading(false);
      return;
    }

    fetchActiveSchoolYear(schoolId);
  }, [schoolId]);

  const fetchActiveSchoolYear = async (schoolId: number) => {
    try {
      console.log(`Buscando ciclo escolar activo para escuela ${schoolId}`);
      const schoolYears = await loadSchoolYearsBySchoolId(schoolId);

      // Transformar los datos al formato esperado de DatabaseSchoolYear
      const formattedSchoolYears: DatabaseSchoolYear[] = schoolYears.map(year => ({
        school_year_id: year.id,
        name: year.name,
        status_id: parseInt(year.status),
        start_date: year.startDate,
        end_date: year.endDate
      }));

      // Buscar el ciclo escolar activo (status_id = 1 significa activo)
      const activeYear = formattedSchoolYears.find(year => year.status_id === 1);

      if (activeYear) {
        console.log("Ciclo escolar activo encontrado:", activeYear);
        setActiveSchoolYear(activeYear);

        // Cargar los eventos del ciclo escolar activo
        fetchCalendarData(schoolId, activeYear.school_year_id);
      } else {
        console.warn("No se encontró un ciclo escolar activo");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al buscar el ciclo escolar activo:", error);
      setIsLoading(false);
    }
  };

  const fetchCalendarData = async (schoolId: number, schoolYearId: number) => {
    try {
      setIsLoading(true);
      console.log(`Cargando eventos para escuela ${schoolId} y ciclo escolar ${schoolYearId}`);

      // Obtener datos del calendario usando el servicio
      const calendarData = await getCalendarData(schoolId, schoolYearId);

      // Establecer eventos en el estado
      if (calendarData.events && calendarData.events.length > 0) {
        // Procesar eventos para corregir problemas de zona horaria
        const processedEvents = processEvents(calendarData.events);
        console.log(`Eventos cargados: ${processedEvents.length}`);
        setEvents(processedEvents);
      } else {
        console.log("No se encontraron eventos para este ciclo escolar");
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

  const handleEventAdd = async (event: CalendarEvent) => {
    try {
      if (!activeSchoolYear || !schoolId) {
        console.error("No hay ciclo escolar activo o ID de escuela");
        return;
      }

      // Preparar el evento para la base de datos
      const eventData: EventData = {
        school_id: schoolId,
        event_type_id: event.extendedProps?.event_type_id || 1,
        school_year_id: activeSchoolYear.school_year_id,
        title: event.title || "Evento sin título",
        description: event.extendedProps?.description || "",
        start_time: event.start?.toString() || new Date().toISOString(),
        end_time: event.end?.toString(),
        all_day: true,
        status_id: 21, // Estado "Programado"
        created_by: Number(session?.id) || 0,
        delete_flag: false
      };

      // Preparar destinatarios (roles)
      const recipients: EventRecipient[] = event.extendedProps?.roles?.map((role: any) => ({
        role_id: Number(role.role_id)
      })) || [];

      // Crear evento en la base de datos
      const result = await createEvent(eventData, recipients);

      if (result.success && result.data) {
        // Asegurarnos de que el evento incluya allDay para evitar problemas de zona horaria
        const eventToAdd = {
          ...event,
          allDay: true,
          extendedProps: {
            ...event.extendedProps,
            event_id: result.data.event_id
          }
        };

        setEvents(prev => [...prev, eventToAdd]);
      } else {
        console.error("Error al crear el evento:", result.error);
      }
    } catch (error) {
      console.error("Error en la operación de añadir evento:", error);
    }
  };

  const handleEventUpdate = async (event: CalendarEvent) => {
    try {
      if (!activeSchoolYear || !schoolId) {
        console.error("No hay ciclo escolar activo o ID de escuela");
        return;
      }

      // Verificar si el evento tiene un ID de base de datos
      const eventId = event.extendedProps?.event_id;
      if (!eventId) {
        console.error("No se puede actualizar el evento: ID de evento no disponible");
        return;
      }

      // Preparar el evento para la base de datos
      const eventData: Partial<EventData> = {
        school_id: schoolId,
        event_type_id: event.extendedProps?.event_type_id || 1,
        school_year_id: activeSchoolYear.school_year_id,
        title: event.title || "Evento sin título",
        description: event.extendedProps?.description || "",
        start_time: event.start?.toString() || new Date().toISOString(),
        end_time: event.end?.toString(),
        all_day: true,
        status_id: 21, // Estado "Programado"
      };

      // Preparar destinatarios (roles)
      const recipients: EventRecipient[] = event.extendedProps?.roles?.map((role: any) => ({
        role_id: Number(role.role_id)
      })) || [];

      // Actualizar evento en la base de datos
      const result = await updateEventWithRecipients(eventId, eventData, recipients);

      if (result.success) {
        // Asegurarnos de que el evento incluya allDay para evitar problemas de zona horaria
        const eventToUpdate = {
          ...event,
          allDay: true
        };

        setEvents(prev => prev.map(e => e.id === event.id ? eventToUpdate : e));
      } else {
        console.error("Error al actualizar el evento:", result.error);
      }
    } catch (error) {
      console.error("Error en la operación de actualizar evento:", error);
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      // Buscar el evento para obtener su ID de base de datos
      const eventToDelete = events.find(e => e.id === eventId);

      if (!eventToDelete || !eventToDelete.extendedProps?.event_id) {
        console.error("No se puede eliminar el evento: ID de base de datos no disponible");
        return;
      }

      // Eliminar evento (borrado lógico) en la base de datos
      const result = await removeEvent(eventToDelete.extendedProps.event_id);

      if (result.success) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } else {
        console.error("Error al eliminar el evento:", result.error);
      }
    } catch (error) {
      console.error("Error en la operación de eliminar evento:", error);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl md:p-6">
      <PageBreadcrumb pageTitle={`Calendario escolar ${activeSchoolYear ? `- ${activeSchoolYear.name}` : ''}`} />

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
