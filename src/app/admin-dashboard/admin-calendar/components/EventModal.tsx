"use client";

// React
import { useState, useEffect } from "react";

// Components
import { Modal } from "@/components/ui/modal";
import IconFA from "@/components/ui/IconFA";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/core/button/Button";
import MultiSelect from "@/components/form/MultiSelect";
import SelectWithCategories from "@/components/core/select/SelectWithCategories";

// API y Datos
import {
    saveEvent,
    updateEvent,
    deleteEvent,
    saveEventRecipients,
    deleteEventRecipients,
    getEventTypes
} from "@/app/admin-dashboard/admin-calendar/module-utils/queries";

// Types
import { CalendarEvent, Role } from "@/components/core/calendar/types";

// Constantes
const DEFAULT_COLOR = 'primary';
const ACTIVE_STATUS_ID = 21; // ID del estado "Programado" en la base de datos

// Interfaces
interface Option {
    value: string;
    text: string;
    selected: boolean;
}

interface EventType {
    event_type_id: number;
    name: string;
    color: string;
    icon: string;
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete?: () => void;
    selectedEvent: CalendarEvent | null;
    eventTitle: string;
    eventStartDate: string;
    eventEndDate: string;
    eventLevel: string;
    selectedRoles: Role[];
    onTitleChange: (value: string) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onLevelChange: (value: string) => void;
    onRolesChange: (roles: Role[]) => void;
    onSave: () => void;
    availableRoles?: { role_id: string; name: string }[];
    _eventTypes?: any[];
    schoolId?: number;
    schoolYearId?: number;
    userId?: number;
}

export function EventModal({
    isOpen,
    onClose,
    onDelete,
    selectedEvent,
    eventTitle,
    eventStartDate,
    eventEndDate,
    eventLevel,
    selectedRoles,
    onTitleChange,
    onStartDateChange,
    onEndDateChange,
    onLevelChange,
    onRolesChange,
    onSave,
    availableRoles = [],
    _eventTypes = [],
    schoolId = 1,
    schoolYearId = 4,
    userId = 1
}: EventModalProps) {
    // Estado local
    const [title, setTitle] = useState(eventTitle);
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(eventStartDate);
    const [endDate, setEndDate] = useState(eventEndDate || eventStartDate);
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("23:59");
    const [allDay, setAllDay] = useState(true);
    const [eventTypeId, setEventTypeId] = useState<number | undefined>(undefined);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [availableEventTypes, setAvailableEventTypes] = useState<EventType[]>([]);

    // Cargar tipos de eventos cuando se abre el modal
    useEffect(() => {
        const loadEventTypes = async () => {
            if (isOpen && schoolId) {
                try {
                    const response = await getEventTypes();
                    if (response.data) {
                        setAvailableEventTypes(response.data);
                    }
                } catch (err) {
                    console.error("Error al cargar tipos de eventos:", err);
                    setError("No se pudieron cargar los tipos de eventos");
                }
            }
        };

        loadEventTypes();
    }, [isOpen, schoolId]);

    // Inicializar datos cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            console.log("Inicializando datos del modal con evento:", selectedEvent);

            // Datos básicos
            setTitle(eventTitle);
            setStartDate(eventStartDate);
            setEndDate(eventEndDate || eventStartDate);

            // Datos extendidos si hay un evento seleccionado
            if (selectedEvent) {
                // Buscar descripción tanto en el nivel principal como en extendedProps
                const eventDescription = selectedEvent.description ||
                    selectedEvent.extendedProps?.description || "";

                // Buscar tipo de evento tanto en el nivel principal como en extendedProps
                const typeId = selectedEvent.event_type_id ||
                    selectedEvent.extendedProps?.event_type_id;

                console.log("Cargando datos existentes:", {
                    descripcion: eventDescription,
                    tipoEvento: typeId
                });

                setDescription(eventDescription);
                setEventTypeId(typeId !== undefined ? Number(typeId) : undefined);
            } else {
                setDescription("");
                setEventTypeId(undefined);
            }

            // Configuración de horario
            setStartTime("00:00");
            setEndTime("23:59");
            setAllDay(true);
        }
    }, [isOpen, eventTitle, eventStartDate, eventEndDate, selectedEvent]);

    // Limpiar el error cuando cambia el estado del modal
    useEffect(() => {
        if (isOpen) {
            setError("");
        }
    }, [isOpen]);

    // Asegurar que siempre haya un color seleccionado
    useEffect(() => {
        if (isOpen && !eventLevel) {
            onLevelChange(DEFAULT_COLOR);
        }
    }, [isOpen, eventLevel, onLevelChange]);

    // Preparar datos para MultiSelect de roles
    const roleOptions: Option[] = availableRoles.map(role => {
        // Detección mejorada de roles seleccionados con depuración
        const isSelected = selectedRoles.some(
            selectedRole => selectedRole.name.toLowerCase() === role.name.toLowerCase()
        );

        return {
            value: role.role_id,
            text: role.name.charAt(0).toUpperCase() + role.name.slice(1),
            selected: isSelected
        };
    });

    // Obtener los IDs de los roles seleccionados para el MultiSelect con mejor depuración
    const selectedRoleIds = selectedRoles
        .map(role => {
            // Buscar el role_id correspondiente al nombre del rol seleccionado con comparación case-insensitive
            const matchingRole = availableRoles.find(
                availableRole => availableRole.role_id === role.role_id
            );

            if (matchingRole) {
                return matchingRole.role_id;
            } else {
                return "";
            }
        })
        .filter(id => id !== ""); // Filtrar IDs vacíos

    // Manejadores de eventos
    const handleRoleChange = (selectedIds: string[]) => {
        // Mapear IDs seleccionados a objetos de roles
        const newRoles = selectedIds
            .map(id => {
                // Buscar el rol correspondiente al ID seleccionado
                const role = availableRoles.find(r => r.role_id === id);
                if (role) {
                    return {
                        role_id: role.role_id,
                        name: role.name
                    };
                }
                return null;
            })
            .filter(role => role !== null) as Role[]; // Filtrar roles nulos

        onRolesChange(newRoles);
    };

    // Manejador para cerrar el modal correctamente
    const handleClose = () => {
        setError("");
        setIsLoading(false);
        onClose();
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validación
        if (!title.trim()) {
            setError("El título es obligatorio");
            setIsLoading(false);
            return;
        }

        if (!startDate) {
            setError("La fecha de inicio es obligatoria");
            setIsLoading(false);
            return;
        }

        try {
            // Preparar fechas
            const startDateTime = `${startDate}T${allDay ? '00:00:00' : startTime}:00Z`;
            const endDateTime = endDate
                ? `${endDate}T${allDay ? '23:59:59' : endTime}:00Z`
                : `${startDate}T${allDay ? '23:59:59' : endTime}:00Z`;

            // Añadir propiedades adicionales al evento para asegurar que se pasan correctamente
            if (selectedEvent) {
                // Si estamos editando, actualizamos las propiedades del evento seleccionado
                selectedEvent.title = title;
                selectedEvent.description = description;
                selectedEvent.event_type_id = eventTypeId !== undefined ? eventTypeId.toString() : "";
                selectedEvent.start = startDateTime;
                selectedEvent.end = endDateTime;

                // También actualizamos extendedProps para mantener consistencia
                if (!selectedEvent.extendedProps) {
                    selectedEvent.extendedProps = {
                        calendar: eventLevel || DEFAULT_COLOR,
                        roles: selectedRoles || []
                    };
                }

                selectedEvent.extendedProps.description = description;
                selectedEvent.extendedProps.event_type_id = eventTypeId;
            }

            // Datos para el evento
            const eventData = {
                school_id: schoolId,
                event_type_id: eventTypeId,
                school_year_id: schoolYearId,
                title,
                description,
                start_time: startDateTime,
                end_time: endDateTime,
                all_day: allDay,
                status_id: ACTIVE_STATUS_ID,
                created_by: userId
            };

            console.log("Datos del evento a guardar:", {
                ...eventData,
                selectedRoles,
                eventoActual: selectedEvent
            });

            let savedEvent;

            // Actualizar o crear evento
            if (selectedEvent?.extendedProps?.event_id) {
                const result = await updateEvent(selectedEvent.extendedProps.event_id, eventData);
                savedEvent = result.data;
                await deleteEventRecipients(selectedEvent.extendedProps.event_id);
            } else {
                const result = await saveEvent(eventData);
                savedEvent = result.data;
            }

            // Guardar destinatarios
            if (savedEvent && selectedRoles.length > 0) {
                // Mejorar la comparación con case-insensitive
                const recipients = availableRoles
                    .filter(role =>
                        selectedRoles.some(selectedRole =>
                            selectedRole.name.toLowerCase() === role.name.toLowerCase()
                        )
                    )
                    .map(role => ({
                        event_id: savedEvent.event_id,
                        role_id: role.role_id
                    }));

                await saveEventRecipients(recipients);
            }

            // Actualizar calendario y cerrar modal
            onSave();
            handleClose();
        } catch (err) {
            console.error("Error al guardar el evento:", err);
            setError("Ocurrió un error al guardar el evento. Inténtalo de nuevo.");
            setIsLoading(false);
        }
    };

    // Eliminar evento
    const handleDeleteEvent = async () => {
        setIsLoading(true);
        setError("");

        console.log("Solicitud de eliminación para evento:", selectedEvent);

        // Extraer el ID del evento de FullCalendar (puede venir en diferentes formatos)
        let eventDbId = null;

        if (selectedEvent?.extendedProps?.event_id) {
            // Formato estándar en nuestro modelo
            eventDbId = selectedEvent.extendedProps.event_id;
        } else if (selectedEvent?._def?.extendedProps?.event_id) {
            // Formato de FullCalendar cuando viene como objeto nativo
            eventDbId = selectedEvent._def.extendedProps.event_id;
        } else if (typeof selectedEvent === 'object' && selectedEvent !== null) {
            // Buscar en todas las propiedades anidadas posibles
            console.log("Buscando ID en el objeto evento:", selectedEvent);

            // Si es un objeto nativo de FullCalendar
            const fcEvent = selectedEvent as any;
            if (fcEvent._def?.extendedProps?.event_id) {
                eventDbId = fcEvent._def.extendedProps.event_id;
            }
        }

        console.log("ID de base de datos encontrado:", eventDbId);

        if (eventDbId && onDelete) {
            try {
                console.log("Eliminando evento con ID en DB:", eventDbId);
                await deleteEvent(eventDbId);

                // Llamar a onDelete para actualizar la UI
                onDelete();
                handleClose();
            } catch (err) {
                console.error("Error al eliminar el evento:", err);
                setError("Ocurrió un error al eliminar el evento.");
                setIsLoading(false);
            }
        } else {
            console.error("No se puede eliminar el evento: ID de base de datos no disponible", selectedEvent);
            // Si no tenemos ID de BD pero sí onDelete, intentemos eliminarlo solo de la UI
            if (onDelete) {
                console.log("Eliminando solo de la UI sin ID de base de datos");
                onDelete();
                handleClose();
            } else {
                setError("No se puede eliminar: falta información del evento");
                setIsLoading(false);
            }
        }
    };

    // Obtener categorías de eventos organizadas por color
    const getEventTypeCategories = () => {
        // Retornar una sola categoría con todos los tipos de eventos
        return [{
            label: 'Tipos de eventos',
            options: availableEventTypes.map(eventType => ({
                value: eventType.event_type_id.toString(),
                label: eventType.name
            }))
        }];
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} isFullscreen={false} className="max-w-[900px] p-2 lg:p-6">
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh] relative">
                {/* Overlay de carga */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                            <IconFA icon="spinner" className="animate-spin text-primary text-xl mb-2" />
                            <span className="text-gray-800 dark:text-gray-200">Procesando...</span>
                        </div>
                    </div>
                )}

                {/* Cabecera */}
                <div className="flex justify-between items-center">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            {selectedEvent?.id ? 'Editar Evento' : 'Crear Nuevo Evento'}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            {selectedEvent?.id ? 'Edita el evento para actualizar sus datos' : 'Crea un nuevo evento para la agenda'}
                        </p>
                    </div>

                    {isLoading && (
                        <div className="flex items-center text-primary">
                            <IconFA icon="spinner" className="animate-spin mr-2" />
                            <span className="text-sm">Procesando...</span>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    {/* Mensaje de error */}
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
                            <p className="flex items-center">
                                <IconFA icon="circle-exclamation" className="mr-2" />
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Título */}
                            <div>
                                <Label htmlFor="title">
                                    Título <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        onTitleChange(e.target.value);
                                    }}
                                    placeholder="Título del evento"
                                />
                            </div>

                            {/* Tipo de Evento */}
                            <div>
                                <Label htmlFor="eventType">Tipo de Evento</Label>
                                <SelectWithCategories
                                    options={getEventTypeCategories()}
                                    placeholder="Seleccionar tipo de evento"
                                    onChange={(value) => {
                                        const eventTypeIdNum = value ? parseInt(value) : undefined;
                                        setEventTypeId(eventTypeIdNum);

                                        // Aplicar color del tipo de evento
                                        if (value) {
                                            const selectedType = availableEventTypes.find(
                                                t => t.event_type_id === eventTypeIdNum
                                            );
                                            if (selectedType?.color) {
                                                onLevelChange(selectedType.color);
                                            }
                                        }
                                    }}
                                    defaultValue={eventTypeId ? eventTypeId.toString() : ''}
                                />
                            </div>

                            {/* Destinatarios con control de altura */}
                            <div className="relative z-30">
                                <MultiSelect
                                    label="Agrega participantes"
                                    options={roleOptions}
                                    defaultSelected={selectedRoleIds}
                                    onChange={handleRoleChange}
                                    key={`multiselect-${isOpen}-${selectedRoleIds.join('-')}`}
                                />
                            </div>

                            {/* Opción de todo el día */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="allDay"
                                    checked={allDay}
                                    onChange={(e) => setAllDay(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <Label htmlFor="allDay" className="m-0">Todo el día</Label>
                            </div>

                            {/* Fecha y hora de inicio */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="startDate">
                                        Fecha de inicio <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            onStartDateChange(e.target.value);
                                        }}
                                        startIcon={<IconFA icon="calendar" />}
                                    />
                                </div>

                                {!allDay && (
                                    <div>
                                        <Label htmlFor="startTime">Hora de inicio</Label>
                                        <Input
                                            id="startTime"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            startIcon={<IconFA icon="clock" />}
                                        />
                                    </div>
                                )}
                            </div>


                            {/* Fecha y hora de finalización */}
                            {!allDay && (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="endDate">Fecha de finalización</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                setEndDate(e.target.value);
                                                onEndDateChange(e.target.value);
                                            }}
                                            startIcon={<IconFA icon="calendar" />}
                                        />
                                    </div>

                                    {!allDay && (
                                        <div>
                                            <Label htmlFor="endTime">Hora de finalización</Label>
                                            <Input
                                                id="endTime"
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                startIcon={<IconFA icon="clock" />}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="space-y-4 pt-2">
                                <div>
                                    <Label htmlFor="description">Descripción</Label>

                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Descripción del evento"
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                type="button"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>

                            {selectedEvent?.id && (
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={handleDeleteEvent}
                                    disabled={isLoading}
                                    className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                                    startIcon={isLoading ? <IconFA icon="spinner" className="animate-spin" /> : <IconFA icon="trash-alt" />}
                                >
                                    {isLoading ? 'Eliminando...' : 'Eliminar'}
                                </Button>
                            )}

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                                startIcon={isLoading ? <IconFA icon="spinner" className="animate-spin text-white" /> : <IconFA icon="save" />}
                            >
                                {isLoading ? 'Guardando...' : 'Guardar evento'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
} 