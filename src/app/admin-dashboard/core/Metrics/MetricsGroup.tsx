// Components
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';

// Types
import { MetricConfig } from './types';

interface MetricsGroupProps {
    readonly metricsConfig: MetricConfig[];
    readonly isLoading: boolean;
    readonly isEmpty?: boolean;
    readonly emptyMessage?: string;
}

export default function MetricsGroup({
    metricsConfig,
    isLoading,
    isEmpty = false,
    emptyMessage = 'No hay datos disponibles para mostrar métricas',
}: Readonly<MetricsGroupProps>) {
    const renderMetricCard = (config: MetricConfig) => {
        if (isLoading) {
            return (
                <div className="flex h-full items-center justify-center">
                    <IconFA icon="spinner" spin className="text-gray-400" />
                </div>
            );
        }

        if (isEmpty) {
            return (
                <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <IconFA
                            icon={config.icon}
                            style="duotone"
                            size="xl"
                            className="text-gray-800 dark:text-white/90"
                        />
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                        <div>
                            <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                                {config.title}
                            </span>
                            <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                                {typeof config.value === 'number'
                                    ? config.value.toString()
                                    : config.value}
                            </h4>
                        </div>
                    </div>
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                        <span className="px-4 text-center font-outfit text-lg font-semibold text-white">
                            {emptyMessage}
                        </span>
                    </div>
                </>
            );
        }

        const badge = config.badgeText ? (
            <Badge color={config.badgeColor || 'info'}>
                <span className="font-outfit">{config.badgeText}</span>
            </Badge>
        ) : null;

        return (
            <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                    <IconFA
                        icon={config.icon}
                        style="duotone"
                        size="xl"
                        className="text-gray-800 dark:text-white/90"
                    />
                </div>

                <div className="mt-5 flex items-end justify-between">
                    <div>
                        <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                            {config.title}
                        </span>

                        <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                            {typeof config.value === 'number'
                                ? config.value.toString()
                                : config.value}
                        </h4>
                    </div>

                    {badge}
                </div>
            </>
        );
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {metricsConfig.map(config => (
                <div
                    key={config.id}
                    className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
                >
                    {renderMetricCard(config)}
                </div>
            ))}
        </div>
    );
}
