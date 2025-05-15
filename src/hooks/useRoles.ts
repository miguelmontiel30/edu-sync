import {useEffect, useState} from 'react';
import {supabaseClient} from '@/services/config/supabaseClient';

interface Role {
    role_id: number;
    name: string;
    description: string;
}

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadRoles() {
            try {
                const {data, error} = await supabaseClient
                    .from('roles')
                    .select('role_id, name, description')
                    .eq('delete_flag', false)
                    .order('name');

                if (error) throw error;

                setRoles(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar los roles');
            } finally {
                setIsLoading(false);
            }
        }

        loadRoles();
    }, []);

    return {roles, isLoading, error};
}
