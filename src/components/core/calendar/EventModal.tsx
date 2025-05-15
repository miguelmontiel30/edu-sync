"use client";

// Components
import { Modal } from "@/components/ui/modal";
import { CalendarEvent } from "./types";
import { useRoles } from "@/hooks/useRoles";
import IconFA from "@/components/ui/IconFA";
import Checkbox from "@/components/form/input/Checkbox";
import Radio from "@/components/form/input/Radio";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
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
}

const CALENDAR_COLORS = {
    Peligro: "danger",
    Éxito: "success",
    Primario: "primary",
    Advertencia: "warning",
} as const;

export function EventModal({
    isOpen,
    onClose,
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
}: EventModalProps) {
    const { roles, isLoading } = useRoles();

    const handleRoleToggle = (roleName: string) => {
        const newRoles = selectedRoles.includes(roleName)
            ? selectedRoles.filter(r => r !== roleName)
            : [...selectedRoles, roleName];
        onRolesChange(newRoles);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 lg:p-10">
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {selectedEvent ? "Editar Evento" : "Crear Evento"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Planifica tu próximo evento: programa o edita un evento para mantener el control
                    </p>
                </div>

                <div className="mt-8">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Título del Evento
                        </label>
                        <input
                            id="event-title"
                            type="text"
                            value={eventTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                            Color del Evento
                        </label>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                            {Object.entries(CALENDAR_COLORS).map(([key, value]) => (
                                <Radio
                                    key={key}
                                    id={`modal${key}`}
                                    name="event-level"
                                    value={key}
                                    checked={eventLevel === key}
                                    label={key}
                                    onChange={onLevelChange}
                                    className={`text-${value}-500`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                            Público Objetivo
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {isLoading ? (
                                <div className="w-full flex items-center justify-center py-4">
                                    <IconFA icon="spinner" spin className="text-gray-400" />
                                </div>
                            ) : (
                                roles.map((role) => (
                                    <Checkbox
                                        key={role.role_id}
                                        id={`role-${role.role_id}`}
                                        label={role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                        checked={selectedRoles.includes(role.name)}
                                        onChange={() => handleRoleToggle(role.name)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Fecha de Inicio
                        </label>
                        <input
                            id="event-start-date"
                            type="date"
                            value={eventStartDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Fecha de Fin
                        </label>
                        <input
                            id="event-end-date"
                            type="date"
                            value={eventEndDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                    <button
                        onClick={onClose}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        type="button"
                        className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                    >
                        {selectedEvent ? "Actualizar" : "Crear Evento"}
                    </button>
                </div>
            </div>
        </Modal>
    );
} 