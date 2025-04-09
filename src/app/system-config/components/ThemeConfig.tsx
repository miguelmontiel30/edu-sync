'use client';

import { useState, useEffect } from 'react';
import { useThemeSettings } from '@/hooks/useThemeSettings';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import { useSessionContext } from '@/context/SessionContext';

// Objeto de colores predefinidos
const predefinedColors = [
    { name: 'Azul (Default)', value: '#465FFF' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Morado', value: '#8B5CF6' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Amarillo', value: '#F59E0B' },
    { name: 'Celeste', value: '#0EA5E9' },
    { name: 'Esmeralda', value: '#059669' },
];

// Interfaz para la configuración del tema
interface ThemeSettings {
    primary_color: string;
    school_id?: number;
    custom_color?: string;
    use_custom_color: boolean;
}

export default function ThemeConfig() {
    // Usar el hook personalizado para manejar el estado del tema
    const { themeSettings, isLoading: isLoadingSettings, error, updateThemeSettings } = useThemeSettings();
    // Obtener la sesión del contexto
    const { session, isLoading: isLoadingSession } = useSessionContext();

    // Estado local para la interfaz de usuario
    const [localSettings, setLocalSettings] = useState<ThemeSettings>({
        primary_color: '#465FFF',
        custom_color: '',
        use_custom_color: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [previewColor, setPreviewColor] = useState('#465FFF');
    const [schoolId, setSchoolId] = useState<number | null>(null);

    // Obtener el ID de la escuela del contexto de sesión
    useEffect(() => {
        if (session && session.school_id) {
            setSchoolId(session.school_id);
        } else if (!isLoadingSession) {
            console.log('No se encontró school_id en la sesión del usuario');
            setMessage({
                type: 'error',
                text: 'No se encontró la escuela asociada a tu usuario. Por favor, contacta al administrador.'
            });
        }
    }, [session, isLoadingSession]);

    // Actualizar estado local cuando se carguen las configuraciones
    useEffect(() => {
        if (themeSettings) {
            setLocalSettings({
                primary_color: themeSettings.primary_color,
                custom_color: themeSettings.custom_color || '',
                use_custom_color: themeSettings.use_custom_color,
            });
            setPreviewColor(themeSettings.use_custom_color ? themeSettings.custom_color : themeSettings.primary_color);
        }
    }, [themeSettings]);

    // Mostrar errores de carga si hay alguno
    useEffect(() => {
        if (error) {
            setMessage({
                type: 'error',
                text: typeof error === 'string' ? error : 'Ha ocurrido un error al cargar la configuración del tema.'
            });
        }
    }, [error]);

    // Manejar cambios en el color seleccionado
    const handleColorSelect = (color: string) => {
        setLocalSettings({
            ...localSettings,
            primary_color: color,
        });
        if (!localSettings.use_custom_color) {
            setPreviewColor(color);
        }
    };

    // Manejar cambios en el color personalizado
    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setLocalSettings({
            ...localSettings,
            custom_color: newColor,
        });
        if (localSettings.use_custom_color) {
            setPreviewColor(newColor);
        }
    };

    // Manejar cambios en el switch de color personalizado
    const handleToggleCustomColor = (checked: boolean) => {
        const newSettings = {
            ...localSettings,
            use_custom_color: checked,
        };
        setLocalSettings(newSettings);
        setPreviewColor(checked ? newSettings.custom_color || '#FFFFFF' : newSettings.primary_color);
    };

    // Función para calcular tonalidades de un color
    const calculateShades = (hex: string): Record<string, string> => {
        // Este es un cálculo simplificado para generar tonalidades
        const rgb = hexToRgb(hex);
        if (!rgb) return {};

        const shades: Record<string, string> = {};

        // Calcular tonalidades más claras
        for (let i = 1; i <= 4; i++) {
            const factor = 0.15 * i;
            const lighter = lightenColor(rgb, factor);
            shades[`${500 - i * 100}`] = rgbToHex(lighter);
        }

        // Color base
        shades['500'] = hex;

        // Calcular tonalidades más oscuras
        for (let i = 1; i <= 5; i++) {
            const factor = 0.12 * i;
            const darker = darkenColor(rgb, factor);
            shades[`${500 + i * 100}`] = rgbToHex(darker);
        }

        return shades;
    };

    // Funciones auxiliares para conversiones de color
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    };

    const rgbToHex = (rgb: { r: number; g: number; b: number }): string => {
        return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    };

    const lightenColor = (rgb: { r: number; g: number; b: number }, factor: number) => {
        return {
            r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor)),
            g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor)),
            b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor)),
        };
    };

    const darkenColor = (rgb: { r: number; g: number; b: number }, factor: number) => {
        return {
            r: Math.max(0, Math.round(rgb.r * (1 - factor))),
            g: Math.max(0, Math.round(rgb.g * (1 - factor))),
            b: Math.max(0, Math.round(rgb.b * (1 - factor))),
        };
    };

    // Generar paleta de colores para vista previa
    const colorShades = calculateShades(previewColor);

    // Guardar la configuración del tema usando el hook
    const saveThemeSettings = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Verificar si tenemos el ID de la escuela
            if (!schoolId) {
                // Intentar refrescar la sesión para obtener el ID de la escuela
                if (session) {
                    // Si hay sesión pero no school_id, es posible que haya un problema con el perfil
                    throw new Error('No se ha podido identificar la escuela asociada a tu cuenta. Por favor, contacta al administrador.');
                } else {
                    // Si no hay sesión, es posible que haya expirado
                    throw new Error('Tu sesión ha expirado. Por favor, recarga la página o inicia sesión nuevamente.');
                }
            }

            // Asegurarse de que el color de vista previa sea válido
            if (localSettings.use_custom_color && (!localSettings.custom_color || !/^#[0-9A-F]{6}$/i.test(localSettings.custom_color))) {
                throw new Error('El color personalizado no es válido. Debe ser un código HEX válido (ej: #FF5500)');
            }

            // Generar la paleta de colores basada en el color actual
            const colorToUse = localSettings.use_custom_color ? localSettings.custom_color : localSettings.primary_color;
            const generatedPalette = calculateShades(colorToUse || '#465FFF');

            // Preparar los datos para actualizar
            const settingsToUpdate = {
                primary_color: localSettings.primary_color,
                custom_color: localSettings.custom_color || '',
                use_custom_color: localSettings.use_custom_color,
                palette: generatedPalette,
                school_id: schoolId,
            };

            // Actualizar usando el hook
            const result = await updateThemeSettings(settingsToUpdate);

            if (!result.success) {
                throw new Error(result.error instanceof Error ? result.error.message : 'No se pudo actualizar la configuración');
            }

            setMessage({
                type: 'success',
                text: 'Configuración del tema guardada correctamente.',
            });
        } catch (error) {
            console.error('Error al guardar la configuración:', error);
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Ha ocurrido un error al guardar la configuración del tema.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                    Configuración del Tema
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Personaliza los colores y la apariencia de la plataforma para tu escuela.
                </p>
            </div>

            {/* Mensaje de estado */}
            {message.text && (
                <div
                    className={`mb-4 rounded-lg p-4 ${message.type === 'success'
                        ? 'bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400'
                        : 'bg-error-50 text-error-700 dark:bg-error-500/20 dark:text-error-400'
                        }`}
                >
                    <div className="flex items-center">
                        <IconFA
                            icon={message.type === 'success' ? 'check-circle' : 'exclamation-circle'}
                            className="mr-2"
                            size="lg"
                        />
                        <span>{message.text}</span>
                    </div>
                </div>
            )}

            {isLoadingSettings || isLoadingSession ? (
                <div className="flex h-40 items-center justify-center">
                    <IconFA icon="spinner" spin size="2xl" className="text-brand-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Selección de color */}
                    <div>
                        <h4 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
                            Color Principal
                        </h4>

                        {/* Colores predefinidos */}
                        <div className="mb-6">
                            <Label htmlFor="presetColors">Selecciona un color predefinido</Label>
                            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {predefinedColors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        className={`flex h-10 w-full items-center justify-center rounded-lg border ${localSettings.primary_color === color.value
                                            ? 'border-gray-800 dark:border-white'
                                            : 'border-gray-200 dark:border-gray-700'
                                            } p-1`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => handleColorSelect(color.value)}
                                        disabled={localSettings.use_custom_color}
                                    >
                                        {localSettings.primary_color === color.value && !localSettings.use_custom_color && (
                                            <IconFA icon="check" className="text-white" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selector de color personalizado */}
                        <div className="mb-4">
                            <Switch
                                label="Usar color personalizado"
                                defaultChecked={localSettings.use_custom_color}
                                onChange={handleToggleCustomColor}
                            />
                        </div>

                        {localSettings.use_custom_color && (
                            <div className="mb-6">
                                <Label htmlFor="customColor">Color personalizado (código HEX)</Label>
                                <div className="mt-2 flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700"
                                        style={{ backgroundColor: localSettings.custom_color }}
                                    ></div>
                                    <input
                                        type="text"
                                        id="customColor"
                                        value={localSettings.custom_color}
                                        onChange={handleCustomColorChange}
                                        placeholder="#RRGGBB"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    />
                                    <input
                                        type="color"
                                        value={localSettings.custom_color}
                                        onChange={handleCustomColorChange}
                                        className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={saveThemeSettings}
                            disabled={isLoading}
                            className="mt-4"
                            startIcon={<IconFA icon={isLoading ? 'spinner' : 'save'} spin={isLoading} />}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar Configuración'}
                        </Button>
                    </div>

                    {/* Vista previa */}
                    <div>
                        <h4 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
                            Vista Previa
                        </h4>

                        {/* Previsualización del color */}
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="mb-4">
                                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Paleta de colores generada
                                </p>
                                <div className="grid grid-cols-10 gap-1">
                                    {Object.entries(colorShades).map(([shade, color]) => (
                                        <div
                                            key={shade}
                                            className="flex flex-col items-center"
                                            title={`Color ${shade}: ${color}`}
                                        >
                                            <div
                                                className="h-8 w-full rounded-sm"
                                                style={{ backgroundColor: color }}
                                            ></div>
                                            <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                {shade}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ejemplos de componentes */}
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Vista previa de componentes
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-medium text-white transition"
                                        style={{ backgroundColor: previewColor }}
                                    >
                                        <IconFA icon="check" />
                                        Botón Principal
                                    </button>

                                    <span
                                        className="inline-flex items-center rounded-full bg-opacity-10 px-2.5 py-0.5 text-sm font-medium"
                                        style={{
                                            backgroundColor: `${previewColor}20`,
                                            color: previewColor
                                        }}
                                    >
                                        Badge
                                    </span>

                                    <div className="flex items-center">
                                        <div className="relative">
                                            <div
                                                className="block h-6 w-11 rounded-full transition duration-150 ease-linear"
                                                style={{ backgroundColor: previewColor }}
                                            ></div>
                                            <div
                                                className="absolute left-0.5 top-0.5 h-5 w-5 transform translate-x-full rounded-full bg-white shadow-theme-sm"
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-400">Switch</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div
                                        className="h-4 w-4 rounded-full"
                                        style={{ backgroundColor: previewColor }}
                                    ></div>
                                    <span className="text-sm" style={{ color: previewColor }}>
                                        Texto del color primario
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 