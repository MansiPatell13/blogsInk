import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useMediaQuery from '../../utils/useMediaQuery';

const ResponsiveTable = ({
  columns,
  data,
  className = '',
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  sortable = false,
  initialSortColumn = null,
  initialSortDirection = 'asc',
  emptyMessage = 'No data available',
  mobileBreakpoint = 'md',
}) => {
  const [sortColumn, setSortColumn] = useState(initialSortColumn);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const [expandedRows, setExpandedRows] = useState([]);
  
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint === 'sm' ? '640px' : mobileBreakpoint === 'md' ? '768px' : '1024px'})`);
  
  // Handle sorting
  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };
  
  // Sort data if needed
  const sortedData = React.useMemo(() => {
    if (!sortable || !sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, sortable]);
  
  // Toggle row expansion for mobile view
  const toggleRowExpansion = (index) => {
    setExpandedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  // Generate table classes
  const tableClasses = [
    'w-full',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100',
    bordered ? 'border border-gray-200 dark:border-gray-700' : '',
    compact ? 'text-sm' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Generate cell classes
  const getCellClasses = (isHeader = false) => [
    isHeader ? 'font-semibold' : '',
    bordered ? 'border border-gray-200 dark:border-gray-700' : '',
    compact ? 'px-3 py-2' : 'px-4 py-3',
    'text-left'
  ].filter(Boolean).join(' ');
  
  // Generate row classes
  const getRowClasses = (index) => [
    hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : '',
    striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700/50' : '',
    'transition-colors'
  ].filter(Boolean).join(' ');
  
  // If no data
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }
  
  // Mobile view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {sortedData.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`border rounded-lg overflow-hidden ${hoverable ? 'hover:shadow-md' : ''} ${striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}`}
          >
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleRowExpansion(rowIndex)}
            >
              {/* Display the first column as the row header */}
              <div className="font-medium">
                {row[columns[0].key]}
              </div>
              <button className="text-gray-500 dark:text-gray-400">
                {expandedRows.includes(rowIndex) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            {/* Expanded row content */}
            {expandedRows.includes(rowIndex) && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                {columns.slice(1).map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{column.header}</span>
                    <span className="font-medium">{row[column.key]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  // Desktop view
  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`${getCellClasses(true)} ${sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''}`}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {sortable && column.sortable !== false && sortColumn === column.key && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className={getRowClasses(rowIndex)}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={getCellClasses()}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;