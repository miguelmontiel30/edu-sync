'use client';

/**
 * ------------------------------------------------------------
 * Importaciones básicas
 * ------------------------------------------------------------
 * - React: Import para funciones y tipos base
 * - createContext, useState, useContext, useEffect: Hooks y herramientas
 *   necesarios para crear y usar un Context en React.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import ThemeInitializer from '@/components/theme/ThemeInitializer';

/**
 * ------------------------------------------------------------
 * Definición de tipos
 * ------------------------------------------------------------
 * - Theme: tipo que representa los posibles temas de la aplicación.
 * - ThemeContextType: describe la forma del contexto que exponemos
 *   (incluye el estado "theme" y la función "toggleTheme").
 */
interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const defaultContext: ThemeContextType = {
    isDarkMode: false,
    toggleTheme: () => { },
};

/**
 * ------------------------------------------------------------
 * Creación del Context
 * ------------------------------------------------------------
 * - createContext se inicializa con 'undefined' para forzar un error
 *   si se accede al contexto fuera de su proveedor.
 */
const ThemeContext = createContext<ThemeContextType>(defaultContext);

/**
 * ------------------------------------------------------------
 * ThemeProvider
 * ------------------------------------------------------------
 * - Este componente es el responsable de proveer el valor del tema y
 *   la función "toggleTheme" a toda la aplicación.
 * - 'children' son los componentes que se renderizan dentro del Provider.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    /**
     * ------------------------------------------------------------
     * useEffect #1: Cargar el tema desde localStorage
     * ------------------------------------------------------------
     * - Se ejecuta solo en el cliente y una sola vez (no SSR).
     * - Si encuentra un 'theme' en localStorage, lo asigna al estado.
     * - Si no hay dato en localStorage, se mantiene el default 'light'.
     * - Luego de la carga inicial, establece 'isInitialized' en true.
     */
    useEffect(() => {
        // Verificar tema del sistema o preferencia guardada
        const checkDarkMode = () => {
            // Primero intentamos obtener la preferencia guardada
            const savedTheme = localStorage.getItem('eduSync.darkMode');
            if (savedTheme !== null) {
                return savedTheme === 'dark';
            }
            // Si no hay preferencia guardada, usar preferencia del sistema
            return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
        };

        // Establecer tema inicial
        const darkModeOn = checkDarkMode();
        setIsDarkMode(darkModeOn);

        // Aplicar clase al documento
        if (darkModeOn) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    /**
     * ------------------------------------------------------------
     * useEffect #2: Actualizar la clase del HTML según el tema
     * ------------------------------------------------------------
     * - Se ejecuta cada vez que 'theme' o 'isInitialized' cambien.
     * - Si el tema es 'dark', añade la clase 'dark' al elemento raíz (HTML).
     *   Caso contrario, la remueve.
     * - También guarda el tema en localStorage para futuras recargas.
     */
    useEffect(() => {
        if (isDarkMode) {
            localStorage.setItem('eduSync.darkMode', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            localStorage.setItem('eduSync.darkMode', 'light');
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    /**
     * ------------------------------------------------------------
     * toggleTheme
     * ------------------------------------------------------------
     * - Cambia el estado 'theme' de 'light' a 'dark' o viceversa.
     */
    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newValue = !prev;

            // Guardar preferencia
            localStorage.setItem('eduSync.darkMode', newValue ? 'dark' : 'light');

            // Actualizar clase en el DOM
            if (newValue) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            return newValue;
        });
    };

    /**
     * ------------------------------------------------------------
     * Render del Provider
     * ------------------------------------------------------------
     * - Provee el contexto con el tema actual y la función para cambiarlo.
     * - 'children' representa el árbol de componentes que usará este context.
     * - Añadimos ThemeInitializer para cargar la configuración personalizada.
     */
    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ThemeInitializer />
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * ------------------------------------------------------------
 * useTheme Hook
 * ------------------------------------------------------------
 * - Este hook facilita el uso del ThemeContext, para no tener que
 *   usar "useContext(ThemeContext)" directamente en cada componente.
 * - Lanza un error si se llama fuera del ThemeProvider.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
