import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Table.css';

const Table = ({ 
  data, 
  columns, 
  actions = [],
  expandable = false,
  rowsPerPage = 10,
  currentPage: controlledPage,
  onPageChange,
  sortable = false,
  emptyMessage = "No data available",
  isLoading = false,
  // New props for external control of expanded rows
  expandedRows: externalExpandedRows,
  onRowExpand,
  // New prop for controlling if row is clickable
  rowClickable = expandable,
  tableClassName = ''
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalExpandedRows, setInternalExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  
  const currentPage = controlledPage || internalCurrentPage;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  // Use external expanded rows if provided, otherwise use internal state
  const expandedRows = externalExpandedRows !== undefined ? externalExpandedRows : internalExpandedRows;
  
  // Reset expanded rows when data changes unless using external control
  useEffect(() => {
    if (externalExpandedRows === undefined) {
      setInternalExpandedRows({});
    }
  }, [data, externalExpandedRows]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
    
    // Close expanded rows on page change unless using external control
    if (externalExpandedRows === undefined) {
      setInternalExpandedRows({});
    }
  };

  const toggleRowExpand = (rowId) => {
    // Use external control if provided
    if (onRowExpand) {
      onRowExpand(rowId);
    } else {
      setInternalExpandedRows(prev => ({
        ...prev,
        [rowId]: !prev[rowId]
      }));
    }
  };
  
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : comparison * -1;
    });
  }, [data, sortConfig]);

  const renderPagination = () => {
    const pages = [];
    const maxDisplayedPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
    
    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="table-pagination">
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={16} />
        </button>
        
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        {pages}
        
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
        
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    );
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const renderSortIcon = (column) => {
    if (!sortable || !column.sortable) return null;
    
    return (
      sortConfig.key === column.accessor && sortConfig.direction === 'asc' ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      )
    );
  };

  const handleRowClick = (e, rowId) => {
    // Only trigger if the click wasn't on a button or action column
    const isActionColumn = e.target.closest('.actions-column');
    const isExpandButton = e.target.closest('.expand-button');
    if (!isActionColumn && !isExpandButton) {
      toggleRowExpand(rowId);
    }
  };

  return (
    <div className="table-container" style={{ position: 'relative' }}>
      {isLoading && (
        <div className="table-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <table className={`custom-table ${tableClassName}`}>
        <thead>
          <tr>
            {expandable && <th className="expand-column"></th>}
            {columns.map((column, index) => (
              <th 
                key={index}
                onClick={() => column.sortable && handleSort(column.accessor)}
                className={sortable && column.sortable ? 'sortable-header' : ''}
                aria-sort={sortConfig.key === column.accessor ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                style={{ width: column.width || 'auto'}}
              >
                <div className="header-content">
                  <span className="header-text">{column.header}  {column.sortable && <span className="header-sort-icon">{renderSortIcon(column)}</span>}</span>
                </div>
              </th>
            ))}
            {actions.length > 0 && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => {
              const actualRowId = row.id || rowIndex;
              return (
                <React.Fragment key={actualRowId}>
                  <tr 
                    className={rowClickable ? 'clickable-row' : ''}
                    onClick={rowClickable ? (e) => handleRowClick(e, actualRowId) : undefined}
                  >
                    {expandable && (
                      <td className="expand-column">
                        <button
                          className={`expand-button ${expandedRows[actualRowId] ? 'expanded' : ''}`}
                          onClick={() => toggleRowExpand(actualRowId)}
                          aria-label={expandedRows[actualRowId] ? "Collapse row" : "Expand row"}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} style={{ width: column.width || 'auto' }}>
                        {column.render ? column.render(row) : row[column.accessor]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="actions-column">
                        {actions.map((action, actionIndex) => (
                          <button 
                            key={actionIndex}
                            className="action-button"
                            onClick={() => action.onClick(row)}
                            aria-label={action.label}
                          >
                            {action.icon && (
                              <span className="action-icon">{action.icon}</span>
                            )}
                            {action.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                  {expandable && expandedRows[actualRowId] && (
                    <tr className="expanded-row">
                      <td colSpan={columns.length + (actions.length > 0 ? 2 : 1)}>
                        <div className="expanded-row-content">
                          {typeof row.expandedContent === 'function' 
                            ? row.expandedContent() 
                            : row.expandedContent}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + (expandable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="table-empty">
                <div className="table-empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default Table;