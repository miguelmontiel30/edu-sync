import cacheService from '../cache/cacheService';
import {supabaseClient} from '../config/supabaseClient';

// Clave para almacenar la sesión en la caché
const SESSION_CACHE_KEY = 'user_session';

// Tiempo de expiración de la sesión (4 horas)
const SESSION_EXPIRY = 4 * 60 * 60 * 1000;

// Añadir esta variable para controlar refrescos múltiples
const SESSION_REFRESH_COOLDOWN = 10 * 1000; // 10 segundos
let lastRefreshTime = 0;

export interface UserSession {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    school_id?: number;
    token?: string;
}

class SessionService {
    /**
     * Guarda la sesión del usuario en la caché
     * @param sessionData Datos de la sesión del usuario
     */
    saveSession(sessionData: UserSession): void {
        // Verificar que tenemos la información necesaria para guardar la sesión
        if (!sessionData.id || !sessionData.email) {
            console.error('Error al guardar sesión: Datos incompletos', sessionData);
            return;
        }

        // Si no hay rol, añadir un rol por defecto para evitar problemas
        if (!sessionData.role) {
            console.warn('Guardando sesión sin rol definido, asignando "user" por defecto');
            sessionData.role = 'user';
        }

        cacheService.set(SESSION_CACHE_KEY, sessionData, SESSION_EXPIRY);

        // Opcional: Guardar también en localStorage para persistencia entre pestañas
        if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(sessionData));
        }
    }

    /**
     * Recupera la sesión del usuario desde la caché
     * @returns Datos de la sesión o null si no existe/expiró
     */
    getSession(): UserSession | null {
        // Primero intentar obtener de la caché en memoria
        let session = cacheService.get<UserSession>(SESSION_CACHE_KEY);

        // Si no hay datos en la caché, intentar recuperar de localStorage
        if (!session && typeof window !== 'undefined') {
            const storedSession = localStorage.getItem(SESSION_CACHE_KEY);
            if (storedSession) {
                try {
                    const parsedSession = JSON.parse(storedSession) as UserSession;

                    // Validar que la sesión tiene toda la información requerida
                    if (!parsedSession.id || !parsedSession.email) {
                        console.warn(
                            'Sesión recuperada de localStorage incompleta:',
                            parsedSession,
                        );
                        this.clearSession();
                        return null;
                    }

                    // Si no hay rol, añadir un rol por defecto para evitar problemas
                    if (!parsedSession.role) {
                        console.warn('Sesión sin rol definido, asignando "user" por defecto');
                        parsedSession.role = 'user';
                    }

                    // Restaurar en la caché en memoria
                    this.saveSession(parsedSession);
                    session = parsedSession;
                } catch (error) {
                    console.error('Error al recuperar sesión de localStorage:', error);
                    this.clearSession();
                }
            }
        }

        return session;
    }

    /**
     * Comprueba si hay una sesión activa
     */
    hasActiveSession(): boolean {
        return this.getSession() !== null;
    }

    /**
     * Elimina la sesión del usuario
     */
    clearSession(): void {
        cacheService.remove(SESSION_CACHE_KEY);

        if (typeof window !== 'undefined') {
            localStorage.removeItem(SESSION_CACHE_KEY);
        }
    }

    /**
     * Refresca/actualiza la sesión del usuario usando la DB directamente
     * @returns Datos actualizados del usuario o null si hubo error
     */
    async refreshSession(): Promise<UserSession | null> {
        try {
            // Obtener sesión actual
            const currentSession = this.getSession();

            // Si no hay sesión en caché, no podemos refrescar
            if (!currentSession) {
                return null;
            }

            // Evitar refrescos múltiples en un período corto
            const now = Date.now();
            if (now - lastRefreshTime < SESSION_REFRESH_COOLDOWN) {
                return currentSession;
            }

            // Actualizar tiempo de refresco
            lastRefreshTime = now;

            // Obtener datos actualizados del usuario desde la base de datos
            const {data: userData, error: userError} = await supabaseClient
                .from('users')
                .select('user_id, email, first_name, last_name, school_id, linked_type')
                .eq('email', currentSession.email)
                .single();

            if (userError || !userData) {
                console.error('Error al refrescar datos del usuario:', userError);
                // Si hay error, seguimos usando la sesión actual
                return currentSession;
            }

            // Obtener roles del usuario
            const {data: userRoles, error: rolesError} = await supabaseClient
                .from('user_roles')
                .select('role_id, roles:role_id(name)')
                .eq('user_id', userData.user_id)
                .single();

            // Mantener el rol anterior por defecto si no obtenemos uno nuevo
            let userRole = currentSession.role || 'user';

            // Actualizar rol solo si tenemos nueva información
            if (!rolesError && userRoles) {
                if (userRoles.role_id === 1) {
                    userRole = 'admin';
                } else if (userRoles.role_id === 2) {
                    userRole = 'teacher';
                } else if (userRoles.role_id === 3) {
                    userRole = 'student';
                }

                // Si tenemos el nombre directo del rol, usarlo
                // La respuesta de Supabase da un objeto con {name: string}
                if (
                    userRoles.roles &&
                    typeof userRoles.roles === 'object' &&
                    'name' in userRoles.roles
                ) {
                    const roleName = userRoles.roles.name;
                    if (typeof roleName === 'string') {
                        userRole = roleName.toLowerCase();
                    }
                }
            } else if (userData.linked_type) {
                if (userData.linked_type === 'admin') {
                    userRole = 'admin';
                } else if (userData.linked_type === 'teacher') {
                    userRole = 'teacher';
                } else if (userData.linked_type === 'student') {
                    userRole = 'student';
                }
            }

            // Actualizar sesión con datos nuevos
            const updatedSession: UserSession = {
                ...currentSession,
                id: userData.user_id.toString(),
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                school_id: userData.school_id,
                role: userRole,
            };

            // Guardar sesión actualizada
            this.saveSession(updatedSession);

            return updatedSession;
        } catch (error) {
            console.error('Error al refrescar la sesión:', error);
            // En caso de error, devolver la sesión actual sin cambios
            return this.getSession();
        }
    }
}

export default new SessionService();
