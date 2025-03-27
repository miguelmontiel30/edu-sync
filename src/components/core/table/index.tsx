import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
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
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
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

export { Table, TableHeader, TableBody, TableRow, TableCell };
