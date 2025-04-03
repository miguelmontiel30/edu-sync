// Config
import {supabaseClient} from '@/services/config/supabaseClient';
import {User} from '@supabase/supabase-js';

// Tipo personalizado que extiende User para nuestro caso
export interface CustomUser extends Partial<User> {
    id: string;
    email: string | undefined;
    user_metadata: {
        first_name: string;
        last_name: string;
        roles: {
            role_id: number;
            name: string;
        }[];
    };
}

/**
 * Intenta iniciar sesión con el email y contraseña proporcionados
 * @param email Email del usuario
 * @param password Contraseña del usuario
 * @returns Datos de la sesión y usuario autenticado
 */
export async function login(email: string, password: string) {
    try {
        // Primero buscar el usuario sin relación con roles
        const {data: userData, error: userError} = await supabaseClient
            .from('users')
            .select('user_id, email, first_name, last_name, plain_password, school_id')
            .eq('email', email)
            .single();

        if (userError) {
            console.error('Usuario no encontrado en la tabla users:', userError);

            // Verificar si el error es porque no existe el usuario o por otro motivo
            if (userError.code === 'PGRST116') {
                // No rows returned
                throw new Error(
                    `No existe un usuario con el email ${email} en el sistema. Por favor, contacte al administrador.`,
                );
            }

            throw new Error('Error al buscar el usuario. Por favor, intente más tarde.');
        }

        // Verificar si la contraseña coincide con plain_password
        if (!userData.plain_password || userData.plain_password !== password) {
            throw new Error(
                'La contraseña proporcionada no es correcta. Por favor, intente de nuevo.',
            );
        }

        // Obtener roles del usuario
        const {data: userRoles, error: rolesError} = await supabaseClient
            .from('user_roles')
            .select(
                `
                role_id, 
                roles:role_id(
                    name
                )
            `,
            )
            .eq('user_id', userData.user_id)
            .eq('delete_flag', false);

        if (rolesError) {
            console.error('Error al obtener roles del usuario:', rolesError);
            throw new Error('Error al verificar roles. Por favor, intente más tarde.');
        }

        // Si el usuario no tiene roles asignados
        if (!userRoles || userRoles.length === 0) {
            throw new Error(
                'Tu cuenta no tiene permisos asignados para acceder al sistema. Por favor, contacte al administrador.',
            );
        }

        // Obtener permisos en una sola consulta adicional
        const roleIds = userRoles.map((role: any) => role.role_id);
        let userPermissions: string[] = [];

        if (roleIds.length > 0) {
            const {data: permissionsData, error: permissionsError} = await supabaseClient
                .from('role_permissions')
                .select(
                    `
                    permissions:permission_id(name)
                `,
                )
                .in('role_id', roleIds);

            if (!permissionsError && permissionsData) {
                userPermissions = permissionsData
                    .map((p: any) => p.permissions?.name || '')
                    .filter(Boolean);
            }
        }

        // Formatear los roles
        const formattedRoles = userRoles.map((r: any) => ({
            role_id: r.role_id,
            name: r.roles?.name || '',
        }));

        // Crear un usuario personalizado
        const customUser: CustomUser = {
            id: userData.user_id.toString(),
            email: userData.email,
            user_metadata: {
                first_name: userData.first_name,
                last_name: userData.last_name,
                roles: formattedRoles,
            },
            app_metadata: {
                permissions: userPermissions,
            },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        };

        // Guardar los datos en localStorage
        localStorage.setItem('eduSync_user', JSON.stringify(customUser));

        // Crear el perfil completo con permisos
        const profileData = {
            user_id: userData.user_id,
            school_id: userData.school_id || null,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            roles: formattedRoles.map(role => ({
                ...role,
                description: null,
            })),
            permissions: userPermissions,
        };

        localStorage.setItem('eduSync_profile', JSON.stringify(profileData));

        // Solo intentar la autenticación de Supabase si hay un motivo específico para ello
        // Por ejemplo, si se necesita un token JWT para acceder a funciones protegidas
        // De lo contrario, omitimos esta llamada ya que nuestra autenticación personalizada es suficiente
        const skipSupabaseAuth = true; // Cambiar a false si se necesita autenticación con Supabase

        if (!skipSupabaseAuth) {
            try {
                const {data, error} = await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });

                if (!error) {
                    return {
                        session: data.session,
                        user: customUser as User,
                    };
                }
            } catch (authError) {
                console.warn(
                    'No se pudo autenticar con Supabase, usando autenticación personalizada',
                );
            }
        }

        // Devolver una sesión personalizada
        return {
            session: null,
            user: customUser as User,
        };
    } catch (error) {
        console.error('Error en autenticación:', error);
        throw error;
    }
}

export async function logout() {
    // Limpiar el localStorage primero
    localStorage.removeItem('eduSync_user');
    localStorage.removeItem('eduSync_profile');

    // Luego hacer logout en Supabase solo si es necesario
    try {
        await supabaseClient.auth.signOut();
    } catch (error) {
        console.warn('Error al cerrar sesión en Supabase:', error);
        // No propagar el error ya que el cierre de sesión local es suficiente
    }
}

export async function getUser() {
    // Intentar primero obtener el usuario desde localStorage
    const localUser = localStorage.getItem('eduSync_user');
    if (localUser) {
        try {
            return JSON.parse(localUser) as User;
        } catch (e) {
            console.error('Error al parsear el usuario local:', e);
            // Continuar para intentar obtener desde Supabase
        }
    }

    // Solo si no está en localStorage, intentar obtener desde Supabase
    try {
        const {data, error} = await supabaseClient.auth.getUser();
        if (!error) {
            return data.user;
        }
    } catch (e) {
        console.warn('Error al obtener usuario de Supabase:', e);
    }

    return null;
}
