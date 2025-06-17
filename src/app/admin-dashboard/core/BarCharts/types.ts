import { ApexOptions } from 'apexcharts';

export interface ChartConfig {
    id: string;
    title: string;
    dataKey: string;
    series: { name: string; data: (number | null)[] }[];
    categories: string[];
    options?: ApexOptions;
}
