'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import sessionService, { UserSession } from '@/services/auth/sessionService';

interface SessionContextType {
    session: UserSession | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    refreshSession: () => Promise<UserSession | null>;
    logout: () => void;
    hasRole: (role: string) => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSessionContext debe ser usado dentro de un SessionProvider');
    }
    return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar la sesión al montar el componente
    useEffect(() => {
        const loadSession = () => {
            setIsLoading(true);
            try {
                // Intentar obtener la sesión desde la caché primero
                const userSession = sessionService.getSession();

                // No necesitamos refrescar aquí, lo haremos bajo demanda
                setSession(userSession);
            } catch (error) {
                console.error('Error cargando la sesión:', error);
                setSession(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();
    }, []);

    // Refrescar la sesión del usuario desde la base de datos
    const refreshSession = async (): Promise<UserSession | null> => {
        setIsLoading(true);
        try {
            const userSession = await sessionService.refreshSession();
            setSession(userSession);
            return userSession;
        } catch (error) {
            console.error('Error refrescando la sesión:', error);
            setSession(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Cerrar sesión
    const logout = () => {
        sessionService.clearSession();
        setSession(null);
    };

    // Verificar si el usuario tiene un rol
    const hasRole = (role: string): boolean => {
        if (!session || !session.role) return false;

        // Comparar roles ignorando mayúsculas/minúsculas
        return session.role.toLowerCase() === role.toLowerCase();
    };

    return (
        <SessionContext.Provider
            value={{
                session,
                isLoading,
                isAuthenticated: !!session,
                refreshSession,
                logout,
                hasRole
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export default SessionContext; 