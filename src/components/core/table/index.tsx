import React, { ReactNode } from "react";
import DataTable, { Column, SortDirection, DataTableProps } from './DataTable';

export { DataTable, type Column, type SortDirection, type DataTableProps };

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
  maxHeight?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
  onClick?: () => void; // Optional onClick handler
}

// Props for TableCell
export interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  isHeader?: boolean;
  onClick?: () => void;
  colSpan?: number;
}

// Table Component
export const Table: React.FC<TableProps> = ({ children, className = '', maxHeight = '400px', pagination }) => {
  return (
    <div className="relative">
      <div className={`overflow-auto dark-scrollbar ${className}`} style={{ maxHeight }}>
        <table className="w-full">
          {children}
        </table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-outfit">
              Página <span className="font-medium">{pagination.currentPage}</span> de{' '}
              <span className="font-medium">{pagination.totalPages}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white/[0.03] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Anterior
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white/[0.03] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// TableHeader Component
export const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
export const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
export const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return <tr className={className} onClick={onClick}>{children}</tr>;
};

// TableCell Component
export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  isHeader = false,
  onClick,
  colSpan
}) => {
  const baseClasses = 'px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit';
  const headerClasses = isHeader ? 'bg-gray-50 dark:bg-gray-800' : '';
  const combinedClasses = `${baseClasses} ${headerClasses} ${className}`;

  const Component = isHeader ? 'th' : 'td';

  return (
    <Component
      className={combinedClasses}
      onClick={onClick}
      colSpan={colSpan}
    >
      {children}
    </Component>
  );
};
