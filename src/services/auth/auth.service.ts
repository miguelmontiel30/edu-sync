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
        // Buscar el usuario directamente en la tabla users
        const {data: userData, error: userError} = await supabaseClient
            .from('users')
            .select('user_id, email, first_name, last_name, plain_password')
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

        // Verificar si el usuario tiene roles asignados
        const {data: userRolesData, error: rolesError} = await supabaseClient
            .from('user_roles')
            .select('role_id, roles:role_id(name)')
            .eq('user_id', userData.user_id)
            .eq('delete_flag', false);

        if (rolesError) {
            console.error('Error al verificar roles del usuario:', rolesError);
            throw new Error(
                'No se pudieron verificar los permisos del usuario. Por favor, contacte al administrador.',
            );
        }

        // Si el usuario no tiene roles asignados
        if (!userRolesData || userRolesData.length === 0) {
            throw new Error(
                'Tu cuenta no tiene permisos asignados para acceder al sistema. Por favor, contacte al administrador.',
            );
        }

        // Intentar iniciar sesión con Supabase Auth para mantener la sesión
        try {
            const {data, error} = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.warn(
                    'No se pudo crear sesión en Supabase Auth, continuando con sesión personalizada',
                );

                // Crear una "sesión personalizada" con los datos del usuario
                // Nota: Esto no crea una sesión real en Supabase Auth
                const customUser: CustomUser = {
                    id: userData.user_id.toString(),
                    email: userData.email,
                    user_metadata: {
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        roles: userRolesData.map((role: any) => ({
                            role_id: role.role_id,
                            name: role.roles?.name || '',
                        })),
                    },
                    app_metadata: {},
                    aud: 'authenticated',
                    created_at: new Date().toISOString(),
                };

                return {
                    session: null,
                    user: customUser as User,
                };
            }

            return data;
        } catch (authError) {
            console.error('Error en la autenticación con Supabase:', authError);

            // Devolver una sesión personalizada con los datos del usuario
            const customUser: CustomUser = {
                id: userData.user_id.toString(),
                email: userData.email,
                user_metadata: {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    roles: userRolesData.map((role: any) => ({
                        role_id: role.role_id,
                        name: role.roles?.name || '',
                    })),
                },
                app_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            };

            return {
                session: null,
                user: customUser as User,
            };
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        throw error;
    }
}

export async function logout() {
    await supabaseClient.auth.signOut();
    localStorage.removeItem('eduSync_user');
    localStorage.removeItem('eduSync_profile');
}

export async function getUser() {
    const {data, error} = await supabaseClient.auth.getUser();

    if (error) {
        // Intentar obtener el usuario desde localStorage si existe algún dato guardado
        const localUser = localStorage.getItem('eduSync_user');
        if (localUser) {
            try {
                return JSON.parse(localUser) as User;
            } catch (e) {
                console.error('Error al parsear el usuario local:', e);
                return null;
            }
        }
        return null;
    }

    return data.user;
}
