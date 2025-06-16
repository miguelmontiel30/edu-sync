/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// React
import { FC, useRef } from 'react';

// FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

// Components
import IconFA from '@/components/ui/IconFA';
import { renderEventContent } from './renderEventContent';

// Types
import { CalendarEvent } from './types';

// Styles
import './calendar.css';

interface CalendarProps {
    /** Eventos para mostrar en el calendario */
    events: CalendarEvent[];
    /** Si está cargando los datos */
    isLoading?: boolean;
    /** Callback cuando se hace click en un evento */
    onEventClick?: (eventInfo: any) => void;
    /** Callback cuando se selecciona una fecha o rango */
    onDateSelect?: (info: any) => void;
    /** Callback cuando se quiere agregar un evento */
    onAddEventClick?: () => void;
}

export const Calendar: FC<CalendarProps> = ({
    events = [],
    isLoading = false,
    onEventClick,
    onDateSelect,
    onAddEventClick,
}) => {
    const calendarRef = useRef<FullCalendar>(null);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
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
                            left: 'prev,next addEventButton',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        buttonText={{
                            today: 'Hoy',
                            month: 'Mes',
                            week: 'Semana',
                            day: 'Día',
                        }}
                        events={events}
                        selectable
                        select={onDateSelect}
                        eventClick={onEventClick}
                        eventContent={renderEventContent}
                        customButtons={{
                            addEventButton: {
                                text: 'Agregar Evento +',
                                click: onAddEventClick,
                            },
                        }}
                        timeZone="UTC"
                        displayEventTime={false}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: false,
                        }}
                        dayMaxEventRows={false}
                        height="auto"
                        weekends={false}
                    />
                </div>
            )}
        </div>
    );
};
