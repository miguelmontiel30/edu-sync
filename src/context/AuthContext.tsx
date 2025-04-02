// React
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';

// Libraries
import { User } from '@supabase/supabase-js';

// Services
import { supabaseClient } from '@/services/config/supabaseClient';
import { login, logout, getUser, CustomUser } from '@/services/auth/auth.service';

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
    plain_password?: string;
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
                if (authUser) {
                    setUser(authUser);
                    try {
                        // Cargar perfil del usuario con sus roles y permisos
                        const { data: userData, error: userError } = await supabaseClient
                            .from('users')
                            .select('user_id, school_id, email, first_name, last_name, plain_password')
                            .eq('email', authUser.email)
                            .single();

                        if (userError) {
                            console.warn('No se encontró el usuario en la tabla users:', userError);
                            // Intentar usar datos del usuario de Supabase si está disponible
                            if ((authUser as CustomUser)?.user_metadata?.first_name) {
                                const customUser = authUser as CustomUser;
                                const userRoles = customUser.user_metadata.roles.map(role => ({
                                    role_id: role.role_id,
                                    name: role.name,
                                    description: null
                                }));

                                // Cargar permisos para los roles
                                let userPermissions: string[] = [];
                                if (userRoles.length > 0) {
                                    const roleIds = userRoles.map(r => r.role_id);
                                    const { data: permissionsData } = await supabaseClient
                                        .from('role_permissions')
                                        .select(`
                                            permissions:permission_id(name)
                                        `)
                                        .in('role_id', roleIds);

                                    if (permissionsData) {
                                        userPermissions = permissionsData
                                            .map((p: any) => p.permissions?.name || '')
                                            .filter(Boolean);
                                    }
                                }

                                const profileFromAuth = {
                                    user_id: parseInt(customUser.id),
                                    school_id: null,
                                    email: customUser.email || '',
                                    first_name: customUser.user_metadata.first_name,
                                    last_name: customUser.user_metadata.last_name,
                                    roles: userRoles,
                                    permissions: userPermissions
                                };

                                setProfile(profileFromAuth);
                                localStorage.setItem('eduSync_profile', JSON.stringify(profileFromAuth));
                                setIsLoading(false);
                                return;
                            }

                            // Si no hay datos en user_metadata, intentar cargar desde localStorage
                            const localProfile = localStorage.getItem('eduSync_profile');
                            if (localProfile) {
                                try {
                                    setProfile(JSON.parse(localProfile));
                                    setIsLoading(false);
                                    return;
                                } catch (e) {
                                    console.error('Error al parsear perfil local:', e);
                                }
                            }

                            setProfile(null);
                            setIsLoading(false);
                            return;
                        }

                        // Cargar roles del usuario
                        const { data: rolesData, error: rolesError } = await supabaseClient
                            .from('user_roles')
                            .select(`
                                role_id,
                                roles:role_id(name, description)
                            `)
                            .eq('user_id', userData.user_id)
                            .eq('delete_flag', false);

                        if (rolesError) {
                            console.warn('Error al cargar roles del usuario:', rolesError);
                            // Continuar sin roles
                        }

                        // Cargar permisos por roles
                        let userPermissions: string[] = [];
                        if (rolesData && rolesData.length > 0) {
                            const roleIds = rolesData.map(r => r.role_id);
                            const { data: permissionsData, error: permissionsError } = await supabaseClient
                                .from('role_permissions')
                                .select(`
                                    permissions:permission_id(name)
                                `)
                                .in('role_id', roleIds);

                            if (permissionsError) {
                                console.warn('Error al cargar permisos del usuario:', permissionsError);
                            } else if (permissionsData) {
                                userPermissions = permissionsData
                                    .map((p: any) => p.permissions?.name || '')
                                    .filter(Boolean);
                            }
                        }

                        // Formatear los datos del perfil usando any para sortear problemas de tipo
                        const userRoles = (rolesData || []).map((r: any) => ({
                            role_id: r.role_id,
                            name: r.roles?.name || '',
                            description: r.roles?.description || null
                        }));

                        const profileData = {
                            ...userData,
                            roles: userRoles,
                            permissions: userPermissions
                        };

                        setProfile(profileData);
                        // Guardar el perfil en localStorage para persistencia
                        localStorage.setItem('eduSync_profile', JSON.stringify(profileData));
                    } catch (profileError) {
                        console.error('Error al cargar el perfil completo:', profileError);
                        // Intentar cargar desde localStorage si hay error
                        const localProfile = localStorage.getItem('eduSync_profile');
                        if (localProfile) {
                            try {
                                setProfile(JSON.parse(localProfile));
                            } catch (e) {
                                console.error('Error al parsear perfil local:', e);
                                setProfile(null);
                            }
                        } else {
                            setProfile(null);
                        }
                    }
                } else {
                    setUser(null);
                    setProfile(null);
                    localStorage.removeItem('eduSync_profile');
                    localStorage.removeItem('eduSync_user');
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
                    localStorage.removeItem('eduSync_profile');
                    localStorage.removeItem('eduSync_user');
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
            // Toda la lógica de autenticación, incluida la verificación de plain_password,
            // ahora está centralizada en el servicio de autenticación
            const data = await login(email, password);
            setUser(data.user);

            // Guardar el usuario en localStorage para persistencia
            localStorage.setItem('eduSync_user', JSON.stringify(data.user));
        } catch (error) {
            console.error('Error en inicio de sesión:', error);
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
            console.error('Error en cierre de sesión:', error);
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