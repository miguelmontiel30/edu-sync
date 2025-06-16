'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/services/config/supabaseClient';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Badge from '@/components/core/badge/Badge';

// Interfaces para los datos
interface Role {
    role_id: number;
    name: string;
    description: string | null;
    delete_flag: boolean;
}

interface Permission {
    permission_id: number;
    name: string;
    description: string | null;
    delete_flag: boolean;
}

// Estructura de los datos de permisos tal como los retorna Supabase
interface PermissionInfo {
    name: string;
    description?: string | null;
}

interface RolePermission {
    role_id: number;
    permission_id: number;
    permissions: PermissionInfo[];
}

export default function RolesPermissions() {
    // Estados
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [isManagePermissionsModalOpen, setIsManagePermissionsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [permissionSearch, setPermissionSearch] = useState('');

    // Formularios
    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
    });
    const [permissionForm, setPermissionForm] = useState({
        name: '',
        description: '',
    });
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData();
    }, []);

    // Función para cargar todos los datos iniciales
    async function loadInitialData() {
        await Promise.all([loadRoles(), loadPermissions()]);
    }

    // Cargar roles
    async function loadRoles() {
        setIsLoading(true);
        try {
            const { data, error } = await supabaseClient
                .from('roles')
                .select('*')
                .eq('delete_flag', false)
                .order('name');

            if (error) throw error;
            setRoles(data || []);
        } catch (error) {
            console.error('Error al cargar roles:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al cargar los roles.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Cargar permisos
    async function loadPermissions() {
        setIsLoading(true);
        try {
            const { data, error } = await supabaseClient
                .from('permissions')
                .select('*')
                .eq('delete_flag', false)
                .order('name');

            if (error) throw error;
            setPermissions(data || []);
        } catch (error) {
            console.error('Error al cargar permisos:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al cargar los permisos.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Cargar permisos de un rol
    async function loadRolePermissions(roleId: number) {
        setIsLoading(true);
        try {
            const { data, error } = await supabaseClient
                .from('role_permissions')
                .select('role_id, permission_id, permissions:permission_id(name, description)')
                .eq('role_id', roleId);

            if (error) throw error;

            // Creamos una copia segura y tipada de los datos
            const formattedData: RolePermission[] = [];

            if (Array.isArray(data)) {
                data.forEach(item => {
                    // Asegurarnos de que tenemos los datos mínimos necesarios
                    if (
                        item &&
                        typeof item.role_id === 'number' &&
                        typeof item.permission_id === 'number'
                    ) {
                        formattedData.push({
                            role_id: item.role_id,
                            permission_id: item.permission_id,
                            permissions: item.permissions,
                        });
                    }
                });
            }

            // Establecer los datos formateados
            setRolePermissions(formattedData);

            // Preparar selección para el modal de gestión
            if (data) {
                const permissionIds = data
                    .map(rp => rp.permission_id)
                    .filter(id => id !== undefined);
                setSelectedPermissions(permissionIds);
            } else {
                setSelectedPermissions([]);
            }
        } catch (error) {
            console.error('Error al cargar permisos del rol:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al cargar los permisos del rol.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Gestionar permisos de un rol
    function handleManagePermissions(role: Role) {
        setSelectedRole(role);
        loadRolePermissions(role.role_id);
        setIsManagePermissionsModalOpen(true);
    }

    // Guardar permisos de un rol
    async function saveRolePermissions() {
        if (!selectedRole) return;

        setIsLoading(true);
        try {
            // Primero eliminamos todos los permisos actuales
            const { error: deleteError } = await supabaseClient
                .from('role_permissions')
                .delete()
                .eq('role_id', selectedRole.role_id);

            if (deleteError) throw deleteError;

            // Si hay permisos seleccionados, los insertamos
            if (selectedPermissions.length > 0) {
                const permissionsToInsert = selectedPermissions.map(permissionId => ({
                    role_id: selectedRole.role_id,
                    permission_id: permissionId,
                }));

                const { error: insertError } = await supabaseClient
                    .from('role_permissions')
                    .insert(permissionsToInsert);

                if (insertError) throw insertError;
            }

            setMessage({
                type: 'success',
                text: 'Permisos actualizados correctamente.',
            });

            // Recargar los permisos del rol
            loadRolePermissions(selectedRole.role_id);
            setIsManagePermissionsModalOpen(false);
        } catch (error) {
            console.error('Error al guardar permisos:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al guardar los permisos.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Crear nuevo rol
    async function createRole(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabaseClient
                .from('roles')
                .insert([
                    {
                        name: roleForm.name,
                        description: roleForm.description,
                    },
                ])
                .select();

            if (error) throw error;

            setRoles([...roles, data[0]]);
            setRoleForm({ name: '', description: '' });
            setIsRoleModalOpen(false);
            setMessage({
                type: 'success',
                text: 'Rol creado correctamente.',
            });
        } catch (error) {
            console.error('Error al crear rol:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al crear el rol.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Crear nuevo permiso
    async function createPermission(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabaseClient
                .from('permissions')
                .insert([
                    {
                        name: permissionForm.name,
                        description: permissionForm.description,
                    },
                ])
                .select();

            if (error) throw error;

            setPermissions([...permissions, data[0]]);
            setPermissionForm({ name: '', description: '' });
            setIsPermissionModalOpen(false);
            setMessage({
                type: 'success',
                text: 'Permiso creado correctamente.',
            });
        } catch (error) {
            console.error('Error al crear permiso:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al crear el permiso.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Eliminar rol
    async function deleteRole(roleId: number) {
        if (
            !confirm(
                '¿Estás seguro que deseas eliminar este rol? Esta acción no se puede deshacer.',
            )
        ) {
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabaseClient
                .from('roles')
                .update({ delete_flag: true })
                .eq('role_id', roleId);

            if (error) throw error;

            // Actualizar la lista de roles
            setRoles(roles.filter(role => role.role_id !== roleId));
            setMessage({
                type: 'success',
                text: 'Rol eliminado correctamente.',
            });
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al eliminar el rol.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Eliminar permiso
    async function deletePermission(permissionId: number) {
        if (
            !confirm(
                '¿Estás seguro que deseas eliminar este permiso? Esta acción no se puede deshacer.',
            )
        ) {
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabaseClient
                .from('permissions')
                .update({ delete_flag: true })
                .eq('permission_id', permissionId);

            if (error) throw error;

            // Actualizar la lista de permisos
            setPermissions(
                permissions.filter(permission => permission.permission_id !== permissionId),
            );
            setMessage({
                type: 'success',
                text: 'Permiso eliminado correctamente.',
            });
        } catch (error) {
            console.error('Error al eliminar permiso:', error);
            setMessage({
                type: 'error',
                text: 'Ha ocurrido un error al eliminar el permiso.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Manejar la selección de permisos
    function togglePermissionSelection(permissionId: number) {
        if (selectedPermissions.includes(permissionId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        }
    }

    // Filtrar permisos por búsqueda
    const filteredPermissions = permissions.filter(
        permission =>
            permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
            (permission.description &&
                permission.description.toLowerCase().includes(permissionSearch.toLowerCase())),
    );

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                    Configuración de Roles y Permisos
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Administra los roles y permisos del sistema para controlar el acceso a las
                    diferentes funcionalidades.
                </p>
            </div>

            {/* Mensaje de estado */}
            {message.text && (
                <div
                    className={`mb-4 rounded-lg p-4 ${
                        message.type === 'success'
                            ? 'bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400'
                            : 'bg-error-50 text-error-700 dark:bg-error-500/20 dark:text-error-400'
                    }`}
                >
                    <div className="flex items-center">
                        <IconFA
                            icon={
                                message.type === 'success' ? 'check-circle' : 'exclamation-circle'
                            }
                            className="mr-2"
                            size="lg"
                        />
                        <span>{message.text}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Gestión de Roles */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-800 dark:text-white">
                            Roles del Sistema
                        </h4>
                        <Button
                            onClick={() => setIsRoleModalOpen(true)}
                            startIcon={<IconFA icon="plus" />}
                            className="bg-brand-500 text-white"
                        >
                            Nuevo Rol
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader>Nombre</TableCell>
                                    <TableCell isHeader>Descripción</TableCell>
                                    <TableCell isHeader className="text-right">
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-4 text-center text-gray-500"
                                        >
                                            No hay roles definidos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.map(role => (
                                        <TableRow key={role.role_id}>
                                            <TableCell className="font-medium">
                                                {role.name}
                                            </TableCell>
                                            <TableCell>{role.description || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    onClick={() => handleManagePermissions(role)}
                                                    variant="outline"
                                                    className="mr-2"
                                                    startIcon={<IconFA icon="key" />}
                                                >
                                                    Permisos
                                                </Button>
                                                <Button
                                                    onClick={() => deleteRole(role.role_id)}
                                                    variant="outline"
                                                    className="text-error-600 hover:bg-error-50"
                                                    startIcon={<IconFA icon="trash" />}
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Gestión de Permisos */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-800 dark:text-white">
                            Permisos del Sistema
                        </h4>
                        <Button
                            onClick={() => setIsPermissionModalOpen(true)}
                            startIcon={<IconFA icon="plus" />}
                            className="bg-brand-500 text-white"
                        >
                            Nuevo Permiso
                        </Button>
                    </div>

                    <div className="mb-4">
                        <Input
                            placeholder="Buscar permisos..."
                            startIcon={<IconFA icon="search" className="text-gray-400" />}
                            value={permissionSearch}
                            onChange={e => setPermissionSearch(e.target.value)}
                        />
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader>Nombre</TableCell>
                                    <TableCell isHeader>Descripción</TableCell>
                                    <TableCell isHeader className="text-right">
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPermissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-4 text-center text-gray-500"
                                        >
                                            {permissionSearch
                                                ? 'No se encontraron resultados'
                                                : 'No hay permisos definidos'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPermissions.map(permission => (
                                        <TableRow key={permission.permission_id}>
                                            <TableCell className="font-medium">
                                                {permission.name}
                                            </TableCell>
                                            <TableCell>{permission.description || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    onClick={() =>
                                                        deletePermission(permission.permission_id)
                                                    }
                                                    variant="outline"
                                                    className="text-error-600 hover:bg-error-50"
                                                    startIcon={<IconFA icon="trash" />}
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Modal de Nuevo Rol */}
            <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)}>
                <form onSubmit={createRole} className="space-y-6">
                    <div>
                        <Label htmlFor="roleName">Nombre del Rol</Label>
                        <Input
                            id="roleName"
                            value={roleForm.name}
                            onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                            placeholder="Ej: admin, teacher, student"
                        />
                    </div>
                    <div>
                        <Label htmlFor="roleDescription">Descripción</Label>
                        <Input
                            id="roleDescription"
                            value={roleForm.description}
                            onChange={e =>
                                setRoleForm({ ...roleForm, description: e.target.value })
                            }
                            placeholder="Describe el propósito de este rol"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsRoleModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            startIcon={
                                <IconFA icon={isLoading ? 'spinner' : 'save'} spin={isLoading} />
                            }
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Nuevo Permiso */}
            <Modal isOpen={isPermissionModalOpen} onClose={() => setIsPermissionModalOpen(false)}>
                <form onSubmit={createPermission} className="space-y-6">
                    <div>
                        <Label htmlFor="permissionName">Nombre del Permiso</Label>
                        <Input
                            id="permissionName"
                            value={permissionForm.name}
                            onChange={e =>
                                setPermissionForm({ ...permissionForm, name: e.target.value })
                            }
                            placeholder="Ej: create_user, edit_group"
                        />
                    </div>
                    <div>
                        <Label htmlFor="permissionDescription">Descripción</Label>
                        <Input
                            id="permissionDescription"
                            value={permissionForm.description}
                            onChange={e =>
                                setPermissionForm({
                                    ...permissionForm,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Describe el propósito de este permiso"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsPermissionModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            startIcon={
                                <IconFA icon={isLoading ? 'spinner' : 'save'} spin={isLoading} />
                            }
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Gestión de Permisos */}
            <Modal
                isOpen={isManagePermissionsModalOpen}
                onClose={() => setIsManagePermissionsModalOpen(false)}
            >
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                        Permisos del Rol: {selectedRole?.name || ''}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Selecciona los permisos que deseas asignar a este rol:
                    </p>

                    <div className="mb-4">
                        <Input
                            placeholder="Buscar permisos..."
                            startIcon={<IconFA icon="search" className="text-gray-400" />}
                            value={permissionSearch}
                            onChange={e => setPermissionSearch(e.target.value)}
                        />
                    </div>

                    <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                        {filteredPermissions.length === 0 ? (
                            <div className="py-6 text-center text-gray-500">
                                No se encontraron permisos
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredPermissions.map(permission => (
                                    <div
                                        key={permission.permission_id}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`permission-${permission.permission_id}`}
                                            checked={selectedPermissions.includes(
                                                permission.permission_id,
                                            )}
                                            onChange={() =>
                                                togglePermissionSelection(permission.permission_id)
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
                                        />
                                        <label
                                            htmlFor={`permission-${permission.permission_id}`}
                                            className="ml-3 flex flex-1 cursor-pointer items-center justify-between"
                                        >
                                            <div>
                                                <span className="block font-medium text-gray-800 dark:text-white">
                                                    {permission.name}
                                                </span>
                                                {permission.description && (
                                                    <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                                                        {permission.description}
                                                    </span>
                                                )}
                                            </div>
                                            {rolePermissions.some(
                                                rp => rp.permission_id === permission.permission_id,
                                            ) && (
                                                <Badge color="primary" variant="light" size="sm">
                                                    Asignado
                                                </Badge>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsManagePermissionsModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={saveRolePermissions}
                            disabled={isLoading}
                            startIcon={
                                <IconFA icon={isLoading ? 'spinner' : 'save'} spin={isLoading} />
                            }
                        >
                            Guardar Permisos
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
