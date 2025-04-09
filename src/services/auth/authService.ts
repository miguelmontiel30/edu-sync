import {supabaseClient} from '../config/supabaseClient';
import sessionService, {UserSession} from './sessionService';

/**
 * Iniciar sesión y guardar los datos en caché
 * @param email Correo del usuario
 * @param password Contraseña del usuario
 * @returns Datos de la sesión si el inicio es exitoso
 */
export async function login(email: string, password: string): Promise<UserSession> {
    try {
        // Validar que los campos no estén vacíos
        if (!email || !password) {
            throw new Error('Debes ingresar un correo y contraseña');
        }

        console.log('Intentando iniciar sesión con:', email);

        // Autenticar directamente contra tabla users
        const {data: userData, error: userError} = await supabaseClient
            .from('users')
            .select('user_id, email, first_name, last_name, school_id, plain_password, linked_type')
            .eq('email', email)
            .single();

        // Manejar errores de búsqueda
        if (userError) {
            console.error('Error al buscar usuario:', userError);
            throw new Error('Error de autenticación. Verifica tus credenciales.');
        }

        // Verificar si el usuario existe
        if (!userData) {
            console.error('Usuario no encontrado en la base de datos');
            throw new Error('Correo electrónico no registrado');
        }

        // Validar contraseña
        if (userData.plain_password !== password) {
            console.error('Contraseña incorrecta');
            throw new Error('Contraseña incorrecta');
        }

        console.log('Autenticación exitosa con la base de datos');

        try {
            // Buscar roles del usuario
            const {data: userRoles, error: rolesError} = await supabaseClient
                .from('user_roles')
                .select('role_id')
                .eq('user_id', userData.user_id)
                .single();

            let userRole = 'user';

            // Determinar rol
            if (!rolesError && userRoles) {
                if (userRoles.role_id === 1) {
                    userRole = 'admin';
                } else if (userRoles.role_id === 2) {
                    userRole = 'teacher';
                } else if (userRoles.role_id === 3) {
                    userRole = 'student';
                }
            } else {
                // Alternativa para determinar rol basado en linked_type
                if (userData.linked_type) {
                    if (userData.linked_type === 'admin') {
                        userRole = 'admin';
                    } else if (userData.linked_type === 'teacher') {
                        userRole = 'teacher';
                    } else if (userData.linked_type === 'student') {
                        userRole = 'student';
                    }
                }
            }

            // Crear objeto de sesión
            const userSession: UserSession = {
                id: userData.user_id.toString(),
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                school_id: userData.school_id,
                role: userRole,
                // No hay token de Supabase al usar autenticación personalizada
                token: `custom_token_${Date.now()}`, // Token personalizado para mantener la estructura
            };

            // Guardar en caché
            sessionService.saveSession(userSession);

            console.log('Sesión guardada en caché correctamente');

            return userSession;
        } catch (profileError) {
            console.error('Error al procesar los roles del usuario:', profileError);

            // Crear sesión mínima si hay problemas con los roles
            const minimumSession: UserSession = {
                id: userData.user_id.toString(),
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                school_id: userData.school_id,
                role: 'user',
                token: `custom_token_${Date.now()}`,
            };

            // Guardar sesión mínima
            sessionService.saveSession(minimumSession);

            console.log('Sesión mínima guardada en caché');

            return minimumSession;
        }
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        throw error;
    }
}

/**
 * Cerrar sesión y limpiar la caché
 */
export async function logout(): Promise<void> {
    try {
        // Ya no necesitamos cerrar sesión en Supabase
        // Solo limpiamos la caché local
        sessionService.clearSession();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
}

/**
 * Verificar si el usuario está autenticado
 * @returns Booleano indicando si hay sesión activa
 */
export function isAuthenticated(): boolean {
    return sessionService.hasActiveSession();
}

/**
 * Obtener la sesión actual del usuario
 * @returns Datos de la sesión o null si no está autenticado
 */
export function getCurrentSession(): UserSession | null {
    return sessionService.getSession();
}

/**
 * Refrescar la sesión del usuario
 * @returns Datos actualizados de la sesión
 */
export async function refreshSession(): Promise<UserSession | null> {
    // Simplemente devolvemos la sesión de caché ya que no usamos tokens de Supabase
    return sessionService.getSession();
}
