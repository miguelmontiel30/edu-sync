import {EventInput} from '@fullcalendar/core';

/**
 * Interfaz para representar un rol dentro del sistema
 */
export interface Role {
    role_id: string;
    name: string;
    [key: string]: any;
}

/**
 * Interface para representar un evento de calendario
 * Extiende de EventInput de FullCalendar para mantener compatibilidad
 */
export interface CalendarEvent extends EventInput {
    /**
     * ID único del evento
     */
    id: string;

    /**
     * Propiedades extendidas específicas de la aplicación
     */
    extendedProps: {
        /**
         * Categoría/color del evento (Peligro, Éxito, Primario, Advertencia)
         */
        calendar: string;

        /**
         * Roles a los que está dirigido el evento
         */
        roles: Role[];

        /**
         * Campos personalizados adicionales (opcional)
         */
        [key: string]: any;
    };
}

export type CalendarColor = 'Peligro' | 'Éxito' | 'Primario' | 'Advertencia';
