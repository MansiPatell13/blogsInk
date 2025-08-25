import React from 'react'

const Table = ({ 
  columns = [], 
  data = [], 
  className = '',
  onRowClick,
  sortable = false,
  onSort,
  sortColumn = '',
  sortDirection = 'asc'
}) => {
  const handleSort = (columnKey) => {
    if (sortable && onSort) {
      const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc'
      onSort(columnKey, newDirection)
    }
  }

  const getSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return null
    }
    
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => sortable && column.sortable !== false ? handleSort(column.key) : null}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortable && column.sortable !== false && (
                    <span className="text-gray-400">{getSortIcon(column.key)}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

export default Table
