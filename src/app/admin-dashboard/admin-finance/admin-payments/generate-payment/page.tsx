'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import StudentSelector from './components/StudentSelector';

// Mock data para los estudiantes
const mockStudents = [
    { value: 'student1', label: 'Juan Pérez García' },
    { value: 'student2', label: 'María López Sánchez' },
    { value: 'student3', label: 'Carlos Rodríguez Flores' },
    { value: 'student4', label: 'Ana Martínez Vega' },
    { value: 'student5', label: 'Roberto Sánchez Díaz' },
    { value: 'student6', label: 'Patricia Ramírez Ortega' },
    { value: 'student7', label: 'Luis González Torres' },
    { value: 'student8', label: 'Sofía Torres Luna' },
    { value: 'student9', label: 'Alejandro Castro Medina' },
];

interface PaymentItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    amount: number;
}

export default function GeneratePaymentPage() {
    const router = useRouter();
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [subject, setSubject] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [currency, setCurrency] = useState('MXN');
    const [items, setItems] = useState<PaymentItem[]>([
        {
            id: '1',
            description: 'Colegiatura Septiembre',
            quantity: 1,
            unitPrice: 2500,
            tax: 0,
            amount: 2500
        }
    ]);
    const [discount, setDiscount] = useState<number | null>(null);
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [notes, setNotes] = useState('');

    // Manejadores de eventos
    const handleStudentChange = (studentId: string) => {
        setSelectedStudent(studentId);
    };

    const handleAddItem = () => {
        const newItem: PaymentItem = {
            id: (items.length + 1).toString(),
            description: '',
            quantity: 1,
            unitPrice: 0,
            tax: 0,
            amount: 0
        };
        setItems([...items, newItem]);
    };

    const handleItemChange = (id: string, field: keyof PaymentItem, value: string | number) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id 
                    ? { 
                        ...item, 
                        [field]: value,
                        amount: field === 'quantity' || field === 'unitPrice' 
                            ? (field === 'quantity' ? (value as number) * item.unitPrice : item.quantity * (value as number)) 
                            : item.amount
                      } 
                    : item
            )
        );
    };

    const handleRemoveItem = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleSaveAsDraft = () => {
        // Implementar lógica para guardar como borrador
        alert('Pago guardado como borrador');
        router.push('/admin-dashboard/admin-finance/admin-payments');
    };

    const handleSendPayment = () => {
        // Implementar lógica para enviar el pago
        alert('Pago generado correctamente');
        router.push('/admin-dashboard/admin-finance/admin-payments');
    };

    // Cálculos
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = discount 
        ? discountType === 'percentage' 
            ? (subtotal * discount) / 100 
            : discount 
        : 0;
    const totalTax = items.reduce((sum, item) => sum + ((item.tax / 100) * item.amount), 0);
    const total = subtotal - discountAmount + totalTax;

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <PageBreadcrumb pageTitle="Generar Pago" />
                <div className="flex space-x-2">
                    <Button 
                        variant="outline" 
                        onClick={handleSaveAsDraft}
                    >
                        <IconFA icon="save" className="mr-2" />
                        Guardar como borrador
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSendPayment}
                    >
                        <IconFA icon="paper-plane" className="mr-2" />
                        Generar pago
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna izquierda - Detalles del pago */}
                <div className="md:col-span-2">
                    <ComponentCard title="Detalle del Pago" className="mb-6">
                        <div className="space-y-4 p-4">
                            {/* Destinatario */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Estudiante
                                </label>
                                <StudentSelector 
                                    selectedStudent={selectedStudent}
                                    onStudentChange={handleStudentChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Asunto */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Concepto
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                        placeholder="Ej. Colegiatura Septiembre"
                                    />
                                </div>

                                {/* Fecha de vencimiento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Fecha límite
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Moneda */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Moneda
                                </label>
                                <div className="relative">
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-300 p-2 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <option value="MXN">MXN - Peso Mexicano</option>
                                        <option value="USD">USD - Dólar Estadounidense</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                        <IconFA icon="chevron-down" className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Productos/Conceptos */}
                    <ComponentCard title="Conceptos" className="mb-6">
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Concepto</th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Cantidad</th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Precio unitario</th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">IVA %</th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Importe</th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {items.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                        className="w-full rounded-md border border-gray-300 p-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                                        placeholder="Descripción del concepto"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="w-full text-center rounded-md border border-gray-300 p-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                                        min="1"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <span className="text-gray-500 dark:text-gray-400">$</span>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            value={item.unitPrice}
                                                            onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                            className="w-full pl-7 text-right rounded-md border border-gray-300 p-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={item.tax}
                                                        onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                                                        className="w-full text-center rounded-md border border-gray-300 p-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                                        min="0"
                                                        max="100"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <div className="text-gray-900 dark:text-white font-medium">
                                                        ${item.amount.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <IconFA icon="trash" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddItem}
                                >
                                    <IconFA icon="plus" className="mr-2" />
                                    Agregar concepto
                                </Button>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Descuentos */}
                    <ComponentCard title="Descuentos" className="mb-6">
                        <div className="p-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="percentage"
                                        name="discountType"
                                        checked={discountType === 'percentage'}
                                        onChange={() => setDiscountType('percentage')}
                                        className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                                    />
                                    <label htmlFor="percentage" className="text-sm text-gray-700 dark:text-gray-300">
                                        Porcentaje (%)
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="fixed"
                                        name="discountType"
                                        checked={discountType === 'fixed'}
                                        onChange={() => setDiscountType('fixed')}
                                        className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                                    />
                                    <label htmlFor="fixed" className="text-sm text-gray-700 dark:text-gray-300">
                                        Monto fijo
                                    </label>
                                </div>
                                <div className="relative flex-1 max-w-xs">
                                    {discountType === 'percentage' && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">%</span>
                                        </div>
                                    )}
                                    {discountType === 'fixed' && (
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">$</span>
                                        </div>
                                    )}
                                    <input
                                        type="number"
                                        value={discountValue || ''}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            setDiscountValue(value);
                                            setDiscount(value > 0 ? value : null);
                                        }}
                                        className={`w-full rounded-md border border-gray-300 p-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 ${
                                            discountType === 'percentage' ? 'text-right pr-7' : 'pl-7'
                                        }`}
                                        min="0"
                                        step={discountType === 'percentage' ? '1' : '0.01'}
                                        placeholder={discountType === 'percentage' ? "Ej. 10%" : "Ej. $100.00"}
                                    />
                                </div>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Notas */}
                    <ComponentCard title="Notas">
                        <div className="p-4">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                rows={3}
                                placeholder="Notas adicionales para el estudiante"
                            ></textarea>
                        </div>
                    </ComponentCard>
                </div>

                {/* Columna derecha - Vista previa */}
                <div className="md:col-span-1">
                    <ComponentCard title="Vista Previa" className="sticky top-20">
                        <div className="p-4 space-y-4">
                            <div className="text-center mb-4">
                                {/* Logo */}
                                <div className="flex justify-center mb-2">
                                    <IconFA icon="graduation-cap" size="xl" className="text-indigo-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">EduSync</h2>
                            </div>
                            
                            {/* Resumen del pago */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Estudiante:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedStudent ? mockStudents.find(s => s.value === selectedStudent)?.label : 'No seleccionado'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Concepto:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {subject || 'No especificado'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Fecha límite:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {dueDate 
                                            ? new Date(dueDate).toLocaleDateString('es-MX', {day: 'numeric', month: 'long', year: 'numeric'}) 
                                            : 'No especificada'}
                                    </span>
                                </div>
                            </div>

                            {/* Tabla de conceptos simplificada */}
                            <div className="mt-4">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-2 py-2 text-left">Concepto</th>
                                            <th className="px-2 py-2 text-right">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-2 py-2 text-left text-gray-600 dark:text-gray-400">
                                                    {item.description || 'Concepto sin definir'}
                                                </td>
                                                <td className="px-2 py-2 text-right text-gray-900 dark:text-white">
                                                    ${item.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totales */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Descuento {discountType === 'percentage' ? `(${discountValue}%)` : ''}:
                                        </span>
                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                            -${discountAmount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {totalTax > 0 && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">IVA:</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${totalTax.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-base font-semibold text-gray-800 dark:text-white">Total:</span>
                                    <span className="text-base font-bold text-brand-600 dark:text-brand-400">
                                        ${total.toFixed(2)} {currency}
                                    </span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-col space-y-2 mt-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-center"
                                    onClick={handleSaveAsDraft}
                                >
                                    <IconFA icon="save" className="mr-2" />
                                    Guardar como borrador
                                </Button>
                                <Button
                                    variant="primary"
                                    className="w-full justify-center"
                                    onClick={handleSendPayment}
                                >
                                    <IconFA icon="paper-plane" className="mr-2" />
                                    Generar pago
                                </Button>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
} 