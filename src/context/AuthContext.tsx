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
                // Intentar cargar desde localStorage primero
                let localProfile: UserProfile | null = null;
                const storedProfile = localStorage.getItem('eduSync_profile');

                if (storedProfile) {
                    try {
                        localProfile = JSON.parse(storedProfile);
                    } catch (e) {
                        console.error('Error al parsear perfil local:', e);
                    }
                }

                // Obtener usuario autenticado
                const authUser = await getUser();

                // Si no hay usuario autenticado, limpiar todo
                if (!authUser) {
                    // Limpiar el usuario
                    setUser(null);

                    // Limpiar el perfil
                    setProfile(null);

                    // Limpiar localStorage
                    localStorage.removeItem('eduSync_profile');
                    localStorage.removeItem('eduSync_user');

                    // Establecer el estado de carga a false
                    setIsLoading(false);
                    return;
                }

                setUser(authUser);

                // Si tenemos el perfil en localStorage y corresponde al usuario actual, usarlo
                if (localProfile && localProfile.email === authUser.email) {
                    setProfile(localProfile);
                    setIsLoading(false);
                    return;
                }

                // Si es un usuario personalizado (CustomUser), usar sus metadatos
                if ((authUser as CustomUser)?.user_metadata?.first_name) {
                    const customUser = authUser as CustomUser;
                    const app_metadata = customUser.app_metadata || {};

                    // Crear el perfil a partir de los metadatos del usuario
                    const profileFromAuth: UserProfile = {
                        user_id: parseInt(customUser.id),
                        school_id: null,
                        email: customUser.email || '',
                        first_name: customUser.user_metadata.first_name,
                        last_name: customUser.user_metadata.last_name,
                        roles: customUser.user_metadata.roles.map(role => ({
                            role_id: role.role_id,
                            name: role.name,
                            description: null
                        })),
                        permissions: Array.isArray(app_metadata.permissions) ? app_metadata.permissions : []
                    };

                    setProfile(profileFromAuth);
                    localStorage.setItem('eduSync_profile', JSON.stringify(profileFromAuth));
                    setIsLoading(false);
                    return;
                }

                // Solo como último recurso, consultar la base de datos
                try {
                    const { data: userData, error: userError } = await supabaseClient
                        .from('users')
                        .select(`
                            user_id, 
                            school_id, 
                            email, 
                            first_name, 
                            last_name, 
                            plain_password,
                            user_roles:user_id(
                                role_id, 
                                roles:role_id(name, description)
                            )
                        `)
                        .eq('email', authUser.email)
                        .eq('user_roles.delete_flag', false)
                        .single();

                    if (userError) {
                        console.warn('Error al cargar perfil del usuario desde DB:', userError);
                        setProfile(null);
                        setIsLoading(false);
                        return;
                    }

                    // Formatear roles
                    const userRoles = (userData.user_roles || []).map((r: any) => ({
                        role_id: r.role_id,
                        name: r.roles?.name || '',
                        description: r.roles?.description || null
                    }));

                    // Cargar permisos en una sola consulta adicional
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

                    // Crear perfil completo
                    const profileData = {
                        ...userData,
                        user_roles: undefined, // Eliminar propiedad anidada que no necesitamos
                        roles: userRoles,
                        permissions: userPermissions
                    };

                    setProfile(profileData);
                    localStorage.setItem('eduSync_profile', JSON.stringify(profileData));
                } catch (dbError) {
                    console.error('Error al cargar datos del usuario desde DB:', dbError);
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

        // Suscribirse a cambios de autenticación solo si es necesario
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
            // Establecer el estado de carga a true
            setIsLoading(true);

            // La autenticación ahora está centralizada y optimizada
            const data = await login(email, password);

            // Establecer el usuario
            setUser(data.user);

            // Cargar el perfil desde localStorage, que fue guardado durante login
            const storedProfile = localStorage.getItem('eduSync_profile');

            // Si hay un perfil en localStorage, establecerlo
            if (storedProfile) {
                try {
                    setProfile(JSON.parse(storedProfile));
                } catch (e) {
                    console.error('Error al parsear perfil después del login:', e);
                }
            }

            // Establecer el estado de carga a false
            setIsLoading(false);
        } catch (error) {
            // Establecer el estado de carga a false
            setIsLoading(false);

            // Lanzar el error
            console.error('Error en inicio de sesión:', error);
            throw error;
        }
    };

    // Función de cierre de sesión
    const handleLogout = async () => {
        try {
            // Establecer el estado de carga a true
            setIsLoading(true);

            // Cerrar la sesión
            await logout();

            // Limpiar el usuario
            setUser(null);

            // Limpiar el perfil
            setProfile(null);

            // Establecer el estado de carga a false
            setIsLoading(false);
        } catch (error) {
            // Establecer el estado de carga a false
            setIsLoading(false);

            // Lanzar el error
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