import {EventInput} from '@fullcalendar/core';

export interface CalendarEvent extends EventInput {
    id: string;
    extendedProps: {
        calendar: string;
        roles: string[];
    };
}

export type CalendarColor = 'Peligro' | 'Éxito' | 'Primario' | 'Advertencia';
