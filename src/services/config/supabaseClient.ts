// Supabase Client
import {createClient} from '@supabase/supabase-js';

// Environment variables
import process from 'node:process';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verificar si las variables de entorno están correctamente configuradas
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Variables de entorno de Supabase no configuradas correctamente');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Configurado' : 'No configurado');
    console.error(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY:',
        supabaseAnonKey ? 'Configurado' : 'No configurado',
    );
}

// Crear cliente con manejo de persistencia de sesión
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? globalThis.localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

// Variable para evitar logs duplicados
let connectionChecked = false;

/**
 * Función para verificar la conexión a Supabase
 * @param verbose Mostrar logs detallados de la conexión
 * @returns Booleano indicando si hay conexión
 */
export async function checkSupabaseConnection(verbose = false): Promise<boolean> {
    try {
        const {data, error} = await supabaseClient.auth.getSession();

        if (error) {
            console.error('Error verificando conexión a Supabase:', error);
            connectionChecked = false;
            return false;
        }

        // Solo mostrar mensaje si se solicita explícitamente o no se ha comprobado antes
        if (verbose || !connectionChecked) {
            connectionChecked = true;
        }

        return true;
    } catch (error) {
        console.error('Error grave verificando conexión a Supabase:', error);
        connectionChecked = false;
        return false;
    }
}
