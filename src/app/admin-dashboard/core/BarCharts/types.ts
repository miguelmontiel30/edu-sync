import { ApexOptions } from 'apexcharts';

export interface ChartConfig {
    id?: string;
    title: string;
    dataKey: string;
    color?: string;
    yAxisTitle?: string;
    isEmpty?: boolean;
    blurMessage?: string;
    series?: { name: string; data: (number | null)[] }[];
    categories?: string[];
    options?: ApexOptions;
}
