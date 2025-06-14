import React, { useState } from 'react';

const ChartTab: React.FC = () => {
    const [selected, setSelected] = useState<'optionOne' | 'optionTwo' | 'optionThree'>(
        'optionOne',
    );

    const getButtonClass = (option: 'optionOne' | 'optionTwo' | 'optionThree') =>
        selected === option
            ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
            : 'text-gray-500 dark:text-gray-400';

    return (
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            <button
                type="button"
                onClick={() => setSelected('optionOne')}
                className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                    'optionOne',
                )}`}
            >
                Mensual
            </button>

            <button
                type="button"
                onClick={() => setSelected('optionTwo')}
                className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                    'optionTwo',
                )}`}
            >
                Bimestral
            </button>

            <button
                type="button"
                onClick={() => setSelected('optionThree')}
                className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                    'optionThree',
                )}`}
            >
                Semanal
            </button>
        </div>
    );
};

export default ChartTab;
