import { EventContentArg } from "@fullcalendar/core";
import IconFA from "@/components/ui/IconFA";

// Color por defecto para eventos sin color
const DEFAULT_COLOR = 'primary';

export const renderEventContent = (eventInfo: EventContentArg) => {
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
                                    : roles[0].name}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 