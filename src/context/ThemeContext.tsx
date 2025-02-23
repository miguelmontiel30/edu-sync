'use client';

/**
 * ------------------------------------------------------------
 * Importaciones básicas
 * ------------------------------------------------------------
 * - React: Import para funciones y tipos base
 * - createContext, useState, useContext, useEffect: Hooks y herramientas
 *   necesarios para crear y usar un Context en React.
 */
import type React from 'react';
import {createContext, useState, useContext, useEffect, useMemo} from 'react';

/**
 * ------------------------------------------------------------
 * Definición de tipos
 * ------------------------------------------------------------
 * - Theme: tipo que representa los posibles temas de la aplicación.
 * - ThemeContextType: describe la forma del contexto que exponemos
 *   (incluye el estado "theme" y la función "toggleTheme").
 */
type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

/**
 * ------------------------------------------------------------
 * Creación del Context
 * ------------------------------------------------------------
 * - createContext se inicializa con 'undefined' para forzar un error
 *   si se accede al contexto fuera de su proveedor.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ------------------------------------------------------------
 * ThemeProvider
 * ------------------------------------------------------------
 * - Este componente es el responsable de proveer el valor del tema y
 *   la función "toggleTheme" a toda la aplicación.
 * - 'children' son los componentes que se renderizan dentro del Provider.
 */
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    // States para el tema actual y si ya se cargó desde localStorage
    const [theme, setTheme] = useState<Theme>('light');
    const [isInitialized, setIsInitialized] = useState(false);

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
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const initialTheme = savedTheme || 'light'; // Por defecto: 'light'
        setTheme(initialTheme);
        setIsInitialized(true);
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
        if (isInitialized) {
            localStorage.setItem('theme', theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme, isInitialized]);

    /**
     * ------------------------------------------------------------
     * toggleTheme
     * ------------------------------------------------------------
     * - Cambia el estado 'theme' de 'light' a 'dark' o viceversa.
     */
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    /**
     * ------------------------------------------------------------
     * Render del Provider
     * ------------------------------------------------------------
     * - Provee el contexto con el tema actual y la función para cambiarlo.
     * - 'children' representa el árbol de componentes que usará este context.
     */
    const value = useMemo(() => ({theme, toggleTheme}), [theme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
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
