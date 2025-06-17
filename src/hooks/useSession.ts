import { useState, useEffect } from 'react';
import sessionService, { UserSession } from '@/services/auth/sessionService';

/**
 * Hook personalizado para acceder a la sesión del usuario en memoria
 * @returns Datos de la sesión y funciones para gestionarla
 */
export function useSession() {
    const [session, setSession] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Cargar la sesión al inicio
    useEffect(() => {
        const loadSession = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Intentar obtener sesión desde la caché
                let userSession = sessionService.getSession();

                // Si no hay sesión en caché, intentar refrescarla desde el servidor
                if (!userSession) {
                    userSession = await sessionService.refreshSession();
                }

                setSession(userSession);
            } catch (err) {
                console.error('Error al cargar la sesión:', err);
                setError(
                    err instanceof Error ? err : new Error('Error desconocido al cargar la sesión'),
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();
    }, []);

    /**
     * Refrescar la sesión del usuario
     */
    const refreshSession = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const userSession = await sessionService.refreshSession();
            setSession(userSession);
            return userSession;
        } catch (err) {
            console.error('Error al refrescar la sesión:', err);
            setError(
                err instanceof Error ? err : new Error('Error desconocido al refrescar la sesión'),
            );
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Cerrar la sesión del usuario
     */
    const clearSession = () => {
        sessionService.clearSession();
        setSession(null);
    };

    /**
     * Verificar si el usuario tiene cierto rol
     * @param role Rol a verificar
     */
    const hasRole = (role: string): boolean => {
        return session?.role === role;
    };

    return {
        session,
        isLoading,
        error,
        isAuthenticated: !!session,
        refreshSession,
        clearSession,
        hasRole,
    };
}

export default useSession;
