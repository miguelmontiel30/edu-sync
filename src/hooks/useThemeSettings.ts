import { useState, useEffect } from 'react';
import { supabaseClient } from '@/services/config/supabaseClient';
import sessionService from '@/services/auth/sessionService';

interface ThemeSettings {
    primary_color: string;
    custom_color: string;
    use_custom_color: boolean;
    palette?: Record<string, string>;
    school_id?: number;
}

/**
 * Hook personalizado para cargar la configuración del tema desde Supabase
 * y aplicar los colores dinámicamente a la aplicación
 */
export function useThemeSettings() {
    const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
        primary_color: '#465FFF',
        custom_color: '',
        use_custom_color: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar la configuración de tema de la escuela
    useEffect(() => {
        const loadThemeSettings = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 1. Intentar obtener la sesión desde el servicio de sesión
                const userSession = sessionService.getSession();
                let school_id = userSession?.school_id;

                // 2. Si no hay sesión en el servicio, intentar obtenerla de Supabase
                if (!userSession || !school_id) {
                    try {
                        // Verificar si hay sesión activa en Supabase
                        const { data: sessionData } = await supabaseClient.auth.getSession();

                        if (sessionData?.session) {
                            // Si hay sesión en Supabase pero no en el servicio, intentar obtener el ID de escuela
                            const { data: userData } = await supabaseClient.auth.getUser();

                            if (userData?.user) {
                                const { data: profileData } = await supabaseClient
                                    .from('users')
                                    .select('school_id')
                                    .eq('email', userData.user.email)
                                    .single();

                                if (profileData?.school_id) {
                                    school_id = profileData.school_id;
                                }
                            }
                        }
                    } catch (supabaseError) {
                        console.error('Error al verificar sesión de Supabase:', supabaseError);
                    }
                }

                // 3. Si no se pudo obtener el ID de escuela, usar la configuración por defecto
                if (!school_id) {
                    // Intentar cargar desde localStorage
                    if (typeof window !== 'undefined') {
                        const cachedTheme = localStorage.getItem('eduSync.theme');
                        if (cachedTheme) {
                            const parsedTheme = JSON.parse(cachedTheme);
                            setThemeSettings(parsedTheme);
                        }
                    }

                    setIsLoading(false);
                    return;
                }

                // 4. Obtener la configuración de tema para la escuela
                const { data, error: settingsError } = await supabaseClient
                    .from('school_settings')
                    .select('*')
                    .eq('school_id', school_id)
                    .eq('key', 'theme.settings')
                    .single();

                if (settingsError && settingsError.code !== 'PGRST116') {
                    throw settingsError;
                }

                if (data) {
                    // Extraer la configuración desde el campo value
                    const themeData = data.value;

                    const settings: ThemeSettings = {
                        primary_color: themeData.primary_color || '#465FFF',
                        custom_color: themeData.custom_color || '',
                        use_custom_color: themeData.use_custom_color || false,
                        palette: themeData.palette || undefined,
                        school_id: school_id,
                    };

                    setThemeSettings(settings);

                    // Aplicar el color primario al root
                    const colorToApply =
                        settings.use_custom_color && settings.custom_color
                            ? settings.custom_color
                            : settings.primary_color;

                    document.documentElement.style.setProperty('--primary-color', colorToApply);

                    // Aplicar la paleta completa si está disponible
                    if (settings.palette) {
                        Object.entries(settings.palette).forEach(([shade, color]) => {
                            document.documentElement.style.setProperty(`--brand-${shade}`, color);
                        });
                    }

                    // Guardar en localStorage para acceso sin conexión
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('eduSync.theme', JSON.stringify(settings));
                    }
                }
            } catch (err) {
                console.error('Error al cargar la configuración de tema:', err);
                setError(
                    err instanceof Error ? err.message : 'Error desconocido al cargar el tema',
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadThemeSettings();
    }, []);

    // Función para actualizar el tema
    const updateThemeSettings = async (newSettings: Partial<ThemeSettings>) => {
        try {
            setIsLoading(true);

            // Verificar si se proporciona el school_id en los parámetros
            let school_id = newSettings.school_id;

            // Si no se proporciona, intentar obtenerlo de múltiples fuentes
            if (!school_id) {
                // 1. Intentar obtenerlo del servicio de sesión
                const userSession = sessionService.getSession();
                school_id = userSession?.school_id;

                // 2. Si no está en el servicio, intentar obtenerlo de Supabase
                if (!school_id) {
                    try {
                        const { data: sessionData } = await supabaseClient.auth.getSession();

                        if (sessionData?.session) {
                            const { data: userData } = await supabaseClient.auth.getUser();

                            if (userData?.user) {
                                const { data: profileData } = await supabaseClient
                                    .from('users')
                                    .select('school_id')
                                    .eq('email', userData.user.email)
                                    .single();

                                if (profileData?.school_id) {
                                    school_id = profileData.school_id;
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error al obtener school_id desde Supabase:', error);
                    }
                }
            }

            if (!school_id) {
                throw new Error(
                    'No se ha podido identificar la escuela. Por favor, inicia sesión nuevamente.',
                );
            }

            // Combinar configuración actual con nuevos valores
            const updatedSettings = {
                ...themeSettings,
                ...newSettings,
                school_id, // Asegurarnos de que el school_id esté incluido
            };

            // Determinar el color a aplicar
            const colorToApply =
                updatedSettings.use_custom_color && updatedSettings.custom_color
                    ? updatedSettings.custom_color
                    : updatedSettings.primary_color;

            // Verificar si ya existe la configuración
            const { data: existingSettings, error: checkError } = await supabaseClient
                .from('school_settings')
                .select('setting_id')
                .eq('school_id', school_id)
                .eq('key', 'theme.settings')
                .maybeSingle();

            if (checkError) throw checkError;

            let saveError;

            if (existingSettings) {
                // Actualizar configuración existente
                const { error } = await supabaseClient
                    .from('school_settings')
                    .update({
                        value: updatedSettings,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('school_id', school_id)
                    .eq('key', 'theme.settings');

                saveError = error;
            } else {
                // Crear nueva configuración
                const { error } = await supabaseClient.from('school_settings').insert([
                    {
                        school_id: school_id,
                        key: 'theme.settings',
                        value: updatedSettings,
                        description: 'Configuración del tema principal del sistema',
                        is_system: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ]);

                saveError = error;
            }

            if (saveError) throw saveError;

            // Actualizar el estado
            setThemeSettings(updatedSettings);

            // Aplicar cambios al DOM
            document.documentElement.style.setProperty('--primary-color', colorToApply);

            // Aplicar la paleta completa si está disponible
            if (updatedSettings.palette) {
                Object.entries(updatedSettings.palette).forEach(([shade, color]) => {
                    document.documentElement.style.setProperty(`--brand-${shade}`, color);
                });
            }

            // Guardar en localStorage para acceso sin conexión
            if (typeof window !== 'undefined') {
                localStorage.setItem('eduSync.theme', JSON.stringify(updatedSettings));
            }

            return { success: true };
        } catch (err) {
            console.error('Error al actualizar la configuración de tema:', err);
            setError(
                err instanceof Error ? err.message : 'Error desconocido al actualizar el tema',
            );
            return { success: false, error: err };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        themeSettings,
        isLoading,
        error,
        updateThemeSettings,
    };
}
