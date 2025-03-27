// React
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';

// Libraries
import { User } from '@supabase/supabase-js';

// Services
import { supabaseClient } from '@/services/config/supabaseClient';
import { login, logout, getUser } from '@/services/auth/auth.service';

// Interfaces
interface UserRole {
    role_id: number;
    name: string;
    description: string | null;
}

interface UserProfile {
    user_id: number;
    school_id: number | null;
    email: string;
    first_name: string;
    last_name: string;
    roles: UserRole[];
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAdmin: boolean;
    hasPermission: (permission: string) => boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    // States
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Cargar usuario y perfil al iniciar
    useEffect(() => {
        const loadUserAndProfile = async () => {
            setIsLoading(true);
            try {
                // Obtener usuario autenticado
                const authUser = await getUser();
                setUser(authUser);

                if (authUser) {
                    // Cargar perfil del usuario con sus roles y permisos
                    const { data: userData, error: userError } = await supabaseClient
                        .from('users')
                        .select('user_id, school_id, email, first_name, last_name')
                        .eq('email', authUser.email)
                        .single();

                    if (userError) throw userError;

                    // Cargar roles del usuario
                    const { data: rolesData, error: rolesError } = await supabaseClient
                        .from('user_roles')
                        .select(`
                            role_id,
                            roles:role_id(name, description)
                        `)
                        .eq('user_id', userData.user_id)
                        .eq('delete_flag', false);

                    if (rolesError) throw rolesError;

                    // Cargar permisos por roles
                    const roleIds = rolesData.map(r => r.role_id);
                    const { data: permissionsData, error: permissionsError } = await supabaseClient
                        .from('role_permissions')
                        .select(`
                            permissions:permission_id(name)
                        `)
                        .in('role_id', roleIds);

                    if (permissionsError) throw permissionsError;

                    // Formatear los datos del perfil usando any para sortear problemas de tipo
                    const userRoles = (rolesData as any[]).map(r => ({
                        role_id: r.role_id,
                        name: r.roles?.name || '',
                        description: r.roles?.description || null
                    }));

                    const userPermissions = (permissionsData as any[]).map(p =>
                        p.permissions?.name || ''
                    );

                    setProfile({
                        ...userData,
                        roles: userRoles,
                        permissions: userPermissions
                    });
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
                setUser(null);
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserAndProfile();

        // Suscribirse a cambios de autenticación
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    loadUserAndProfile();
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setProfile(null);
                }
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    // Función de inicio de sesión
    const handleLogin = async (email: string, password: string) => {
        try {
            const data = await login(email, password);
            setUser(data.user);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Función de cierre de sesión
    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            setProfile(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    // Verificar si el usuario es administrador
    const isAdmin = profile?.roles.some(role => role.name === 'admin') || false;

    // Verificar si el usuario tiene un permiso específico
    const hasPermission = (permission: string) => {
        return profile?.permissions.includes(permission) || false;
    };

    // Envolver el valor del contexto en useMemo para evitar recreaciones en cada renderizado
    const contextValue = useMemo(() => ({
        user,
        profile,
        isLoading,
        isAdmin,
        hasPermission,
        login: handleLogin,
        logout: handleLogout
    }), [user, profile, isLoading, isAdmin]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export function useAuth() {
    // Obtener el contexto  
    const context = useContext(AuthContext);

    // Si el contexto no está definido, lanzar un error
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    // Retornar el contexto
    return context;
} 