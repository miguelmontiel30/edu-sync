"use client";

// React
import { useState, useEffect } from "react";

// Components
import { Modal } from "@/components/ui/modal";
import { CalendarEvent } from "./types";
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
    selectedRoles: string[];
    onTitleChange: (value: string) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onLevelChange: (value: string) => void;
    onRolesChange: (roles: string[]) => void;
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
            // Datos básicos
            setTitle(eventTitle);
            setStartDate(eventStartDate);
            setEndDate(eventEndDate || eventStartDate);

            // Datos extendidos si hay un evento seleccionado
            if (selectedEvent?.extendedProps) {
                setDescription(selectedEvent.extendedProps.description || "");
                setEventTypeId(selectedEvent.extendedProps.event_type_id);
            } else {
                setDescription("");
                setEventTypeId(undefined);
            }

            // Configuración de horario
            setStartTime("00:00");
            setEndTime("23:59");
            setAllDay(true);

            // Debug de roles seleccionados
            console.log("Evento seleccionado:", selectedEvent);
            console.log("Roles seleccionados (array):", selectedRoles);
            console.log("Roles disponibles (array):", availableRoles);

            // Registrar IDs de los roles seleccionados
            const roleIds = selectedRoles
                .map(name => {
                    const role = availableRoles.find(r =>
                        r.name.toLowerCase() === name.toLowerCase()
                    );
                    return role?.role_id;
                })
                .filter(Boolean);

            console.log("IDs de roles que deberían estar seleccionados:", roleIds);
        }
    }, [isOpen, eventTitle, eventStartDate, eventEndDate, selectedEvent, selectedRoles, availableRoles]);

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
            selectedRole => selectedRole.toLowerCase() === role.name.toLowerCase()
        );

        console.log(`Role: ${role.name}, ID: ${role.role_id}, Selected: ${isSelected}`);
        console.log(`SelectedRoles contiene: ${selectedRoles.join(', ')}`);

        return {
            value: role.role_id,
            text: role.name.charAt(0).toUpperCase() + role.name.slice(1),
            selected: isSelected
        };
    });

    // Obtener los IDs de los roles seleccionados para el MultiSelect con mejor depuración
    const selectedRoleIds = selectedRoles
        .map(roleName => {
            // Buscar el role_id correspondiente al nombre del rol seleccionado con comparación case-insensitive
            const matchingRole = availableRoles.find(
                role => role.name.toLowerCase() === roleName.toLowerCase()
            );

            if (matchingRole) {
                console.log(`Rol "${roleName}" coincide con ID: ${matchingRole.role_id}`);
                return matchingRole.role_id;
            } else {
                console.log(`No se encontró coincidencia para el rol "${roleName}"`);
                return "";
            }
        })
        .filter(id => id !== ""); // Filtrar IDs vacíos

    console.log("IDs de roles seleccionados finales:", selectedRoleIds);

    // Manejadores de eventos
    const handleRoleChange = (selectedIds: string[]) => {
        console.log("IDs de roles seleccionados:", selectedIds);

        // Mapear IDs seleccionados a nombres de roles
        const newRoles = selectedIds
            .map(id => {
                // Buscar el rol correspondiente al ID seleccionado
                const role = availableRoles.find(r => r.role_id === id);
                if (role) {
                    console.log(`ID ${id} corresponde al rol "${role.name}"`);
                    return role.name;
                }
                console.log(`No se encontró rol para el ID ${id}`);
                return "";
            })
            .filter(name => name !== ""); // Filtrar nombres vacíos

        console.log("Nuevos roles seleccionados:", newRoles);
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
                            selectedRole.toLowerCase() === role.name.toLowerCase()
                        )
                    )
                    .map(role => ({
                        event_id: savedEvent.event_id,
                        role_id: role.role_id
                    }));

                console.log("Destinatarios a guardar:", recipients);
                await saveEventRecipients(recipients);
            }

            // Actualizar calendario y cerrar modal
            onSave();
            handleClose();
        } catch (err) {
            console.error("Error al guardar el evento:", err);
            setError("Ocurrió un error al guardar el evento. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar evento
    const handleDeleteEvent = async () => {
        if (selectedEvent?.extendedProps?.event_id && onDelete) {
            setIsLoading(true);
            try {
                await deleteEvent(selectedEvent.extendedProps.event_id);
                onDelete();
                handleClose();
            } catch (err) {
                console.error("Error al eliminar el evento:", err);
                setError("Ocurrió un error al eliminar el evento.");
            } finally {
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
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
                {/* Cabecera */}
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        {selectedEvent?.id ? 'Editar Evento' : 'Crear Nuevo Evento'}
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        {selectedEvent?.id ? 'Edita el evento para actualizar sus datos' : 'Crea un nuevo evento para la agenda'}
                    </p>
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
                                    startIcon={<IconFA icon="trash-alt" />}
                                >
                                    Eliminar
                                </Button>
                            )}

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                                startIcon={isLoading ? <IconFA icon="spinner" className="animate-spin" /> : <IconFA icon="save" />}
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