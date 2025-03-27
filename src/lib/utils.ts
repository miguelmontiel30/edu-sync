import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

// Funcion para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
