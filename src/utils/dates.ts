/**
 * Formatea una fecha para mostrarla en formato DD/MM/YYYY HH:MM
 * @param dateString - Fecha en formato string
 * @returns Fecha formateada
 */
export const formatDate = (dateString?: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};
