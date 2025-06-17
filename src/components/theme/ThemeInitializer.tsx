'use client';

import { useEffect } from 'react';

/**
 * Componente que inicializa la configuración del tema al cargar la aplicación
 * usando valores predeterminados o caché local mientras se autentica
 */
export default function ThemeInitializer() {
    // Cargar valores de tema inicial
    useEffect(() => {
        // Establecer tema predeterminado inmediatamente para evitar parpadeos
        const initializeTheme = () => {
            try {
                // Valores predeterminados
                const defaultPrimaryColor = '#465FFF';
                const defaultPalette = {
                    '25': '#f2f7ff',
                    '50': '#ecf3ff',
                    '100': '#dde9ff',
                    '200': '#c2d6ff',
                    '300': '#9cb9ff',
                    '400': '#7592ff',
                    '500': '#465fff',
                    '600': '#3641f5',
                    '700': '#2a31d8',
                    '800': '#252dae',
                    '900': '#262e89',
                    '950': '#161950',
                };

                // Aplicar color principal predeterminado inmediatamente
                document.documentElement.style.setProperty('--primary-color', defaultPrimaryColor);

                // Aplicar paleta predeterminada inmediatamente
                Object.entries(defaultPalette).forEach(([shade, color]) => {
                    document.documentElement.style.setProperty(`--brand-${shade}`, color);
                });

                // Intentar cargar configuración del localStorage
                if (typeof window !== 'undefined') {
                    const cachedTheme = localStorage.getItem('eduSync.theme');

                    if (cachedTheme) {
                        const parsedTheme = JSON.parse(cachedTheme);

                        // Aplicar color desde caché
                        const colorToApply =
                            parsedTheme.use_custom_color && parsedTheme.custom_color
                                ? parsedTheme.custom_color
                                : parsedTheme.primary_color || defaultPrimaryColor;

                        document.documentElement.style.setProperty('--primary-color', colorToApply);

                        // Aplicar paleta desde caché si está disponible
                        if (parsedTheme.palette) {
                            Object.entries(parsedTheme.palette).forEach(([shade, color]) => {
                                document.documentElement.style.setProperty(
                                    `--brand-${shade}`,
                                    color as string,
                                );
                            });
                        }
                    } else {
                        // Si no hay caché, guardar los valores predeterminados
                        localStorage.setItem(
                            'eduSync.theme',
                            JSON.stringify({
                                primary_color: defaultPrimaryColor,
                                custom_color: '',
                                use_custom_color: false,
                                palette: defaultPalette,
                            }),
                        );
                    }
                }
            } catch (error) {
                console.error('Error al inicializar el tema:', error);
            }
        };

        // Inicializar tema inmediatamente
        initializeTheme();
    }, []);

    // Este componente no renderiza nada visible
    return null;
}
