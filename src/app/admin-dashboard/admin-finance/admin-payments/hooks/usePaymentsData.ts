import { useState, useEffect } from 'react';

// Interfaces para los datos
interface Payment {
    id: string;
    studentName: string;
    concept: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: 'paid' | 'pending' | 'overdue';
}

interface PaymentOwed {
    id: string;
    studentName: string;
    concept: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'overdue';
    daysOverdue?: number;
}

interface PaymentsData {
    paymentsMade: Payment[];
    paymentsOwed: PaymentOwed[];
}

// Hook para gestionar los datos de pagos
export function usePaymentsData() {
    // Estado para el grupo seleccionado
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    
    // Estado para los filtros
    const [filters, setFilters] = useState({
        date: 'all',
        concept: 'all',
        paymentStatus: 'all'
    });
    
    // Estado para los datos de pagos
    const [paymentsData, setPaymentsData] = useState<PaymentsData>({
        paymentsMade: [],
        paymentsOwed: []
    });
    
    // Estado para indicar carga
    const [isLoading, setIsLoading] = useState(false);
    
    // Datos de ejemplo para pagos realizados
    const mockPaymentsMade: Payment[] = [
        {
            id: 'p001',
            studentName: 'Juan Pérez García',
            concept: 'Colegiatura Agosto',
            amount: 2500,
            paymentDate: '2023-08-05',
            paymentMethod: 'Transferencia',
            status: 'paid'
        },
        {
            id: 'p002',
            studentName: 'María López Sánchez',
            concept: 'Materiales escolares',
            amount: 750,
            paymentDate: '2023-08-03',
            paymentMethod: 'Efectivo',
            status: 'paid'
        },
        {
            id: 'p003',
            studentName: 'Carlos Rodríguez Flores',
            concept: 'Colegiatura Agosto',
            amount: 2500,
            paymentDate: '2023-08-01',
            paymentMethod: 'Tarjeta',
            status: 'paid'
        },
        {
            id: 'p004',
            studentName: 'Ana Martínez Vega',
            concept: 'Inscripción',
            amount: 5000,
            paymentDate: '2023-07-28',
            paymentMethod: 'Transferencia',
            status: 'paid'
        },
        {
            id: 'p005',
            studentName: 'Roberto Sánchez Díaz',
            concept: 'Transporte Agosto',
            amount: 800,
            paymentDate: '2023-08-02',
            paymentMethod: 'Efectivo',
            status: 'paid'
        }
    ];
    
    // Datos de ejemplo para pagos adeudados
    const mockPaymentsOwed: PaymentOwed[] = [
        {
            id: 'po001',
            studentName: 'Luis González Torres',
            concept: 'Colegiatura Septiembre',
            amount: 2500,
            dueDate: '2023-09-10',
            status: 'pending'
        },
        {
            id: 'po002',
            studentName: 'Patricia Ramírez Ortega',
            concept: 'Colegiatura Agosto',
            amount: 2500,
            dueDate: '2023-08-10',
            status: 'overdue',
            daysOverdue: 25
        },
        {
            id: 'po003',
            studentName: 'Alejandro Castro Medina',
            concept: 'Inscripción',
            amount: 5000,
            dueDate: '2023-08-20',
            status: 'overdue',
            daysOverdue: 15
        },
        {
            id: 'po004',
            studentName: 'Sofía Torres Luna',
            concept: 'Materiales escolares',
            amount: 750,
            dueDate: '2023-09-05',
            status: 'pending'
        }
    ];
    
    // Función para cargar datos (simulada)
    const fetchData = async (_groupId: string) => {
        setIsLoading(true);
        
        // Simulamos una petición a API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // En un caso real, aquí realizaríamos la llamada a la API
        // con el ID del grupo y los filtros aplicados
        
        // Por ahora, retornamos datos mock
        setPaymentsData({
            paymentsMade: mockPaymentsMade,
            paymentsOwed: mockPaymentsOwed
        });
        
        setIsLoading(false);
    };
    
    // Efecto para cargar datos cuando cambia el grupo seleccionado
    useEffect(() => {
        if (selectedGroup) {
            fetchData(selectedGroup);
        } else {
            // Reiniciar datos si no hay grupo seleccionado
            setPaymentsData({
                paymentsMade: [],
                paymentsOwed: []
            });
        }
    }, [selectedGroup, filters]);
    
    // Manejador para cambio de grupo
    const handleGroupChange = (groupId: string) => {
        setSelectedGroup(groupId);
    };
    
    // Manejador para cambio de filtros
    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    return {
        selectedGroup,
        filters,
        paymentsData,
        isLoading,
        handleGroupChange,
        handleFilterChange
    };
} 