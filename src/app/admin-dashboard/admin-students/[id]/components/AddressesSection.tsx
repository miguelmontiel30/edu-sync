// Components
import IconFA from '@/components/ui/IconFA';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';

// Types
import { Address } from '../module-utils/types';

interface AddressesSectionProps {
    addresses: Address[];
    onEdit: () => void;
}

const AddressesSection: React.FC<AddressesSectionProps> = ({ addresses, onEdit }) => (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-6 py-5 flex justify-between items-center">
            <div>
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                    <IconFA icon="map-location-dot" style='solid' className="mr-2" />
                    Direcciones
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Direcciones registradas del estudiante</p>
            </div>
            <Button
                variant="outline"
                size="sm"
                startIcon={<IconFA icon="pen" />}
                onClick={onEdit}
            >
                Editar
            </Button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-2">
            {addresses.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">No hay direcciones registradas</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map(address => (
                        <div key={address.id} className="border rounded-md p-4 relative">
                            {address.is_current && (
                                <Badge color="success">
                                    Actual
                                </Badge>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Calle</h3>
                                    <p>{address.street} {address.exterior_number}{address.interior_number ? `, Int. ${address.interior_number}` : ''}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Colonia</h3>
                                    <p>{address.neighborhood}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Código Postal</h3>
                                    <p>{address.postal_code}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</h3>
                                    <p className="capitalize">{address.address_type === 'home' ? 'Casa' : 'Otro'}</p>
                                </div>
                                {address.reference && (
                                    <div className="col-span-2">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Referencia</h3>
                                        <p>{address.reference}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

export default AddressesSection; 