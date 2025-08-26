import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import { calculateAttendanceRate, getColorByPercentage } from '../module-utils/utils';
import { Attendance } from '../module-utils/types';

interface AttendanceWidgetProps {
    attendance: Attendance[];
}

const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({ attendance }) => {
    const attendanceRate = calculateAttendanceRate(attendance);

    const presentDays = attendance.filter(a => a.status === 'present').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;

    return (
        <ComponentCard title="Asistencia" desc="Registro de asistencia reciente" className="mt-6">
            <div className="p-2 flex flex-col items-center">
                {/* Attendance Rate */}
                <div className="w-32 h-32 rounded-full mb-6">
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center border-8"
                        style={{ borderColor: getColorByPercentage(attendanceRate) }}
                    >
                        <span className="text-2xl font-bold">{Math.round(attendanceRate)}%</span>
                    </div>
                </div>

                {/* Attendance Details */}
                <div className="w-full max-w-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                                    <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Días</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="font-medium">Presente</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center font-medium">{presentDays} días</td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <span className="font-medium">Retardo</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center font-medium">{lateDays} días</td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span className="font-medium">Ausente</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center font-medium">{absentDays} días</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ComponentCard>
    );
};

export default AttendanceWidget; 