import React from 'react';
import PropTypes from 'prop-types';
import './AdminTable.css';

const AdminTable = ({
  columns,
  data,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  actions,
  loading,
  emptyState,
  pagination,
  onPageChange,
  selectableRows = true,
  onRowClick
}) => {
  // Check if all visible rows are selected
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  // Render table headers
  const renderHeaders = () => {
    return (
      <thead>
        <tr>
          {selectableRows && (
            <th className="admin-table-checkbox">
              <div className="admin-checkbox-wrapper">
                <input
                  type="checkbox"
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={allSelected}
                  disabled={data.length === 0}
                  className="admin-checkbox"
                  id="select-all-checkbox"
                />
                <label htmlFor="select-all-checkbox" className="admin-checkbox-label">
                  <svg className="admin-checkbox-icon" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </label>
              </div>
            </th>
          )}
          {columns.map(column => (
            <th 
              key={column.key} 
              className={`admin-table-header ${column.className || ''}`}
              style={{ width: column.width || 'auto' }}
              data-key={column.key}
            >
              {column.header}
            </th>
          ))}
          {actions && <th className="admin-table-actions">ACTIONS</th>}
        </tr>
      </thead>
    );
  };

  // Render table rows
  const renderRows = () => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td colSpan={selectableRows ? columns.length + 2 : columns.length + 1} className="admin-table-loading">
              <div className="admin-loading-indicator">
                <div className="admin-loading-spinner"></div>
                <span>Loading...</span>
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={selectableRows ? columns.length + 2 : columns.length + 1} className="admin-table-empty">
              {emptyState || (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="8" y1="15" x2="16" y2="15"></line>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <p>No results found</p>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {data.map((row, rowIndex) => (
          <tr 
            key={row.id || rowIndex} 
            className={`admin-table-row ${onRowClick ? 'clickable-row' : ''}`}
            onClick={onRowClick ? (e) => {
              // Prevent row click when clicking on checkbox or action buttons
              if (e.target.closest('.admin-checkbox-wrapper') || 
                  e.target.closest('.admin-table-actions-container')) {
                return;
              }
              onRowClick(row);
            } : undefined}
          >
            {selectableRows && (
              <td className="admin-table-checkbox">
                <div className="admin-checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Stop event propagation
                      onSelectRow(row.id, e.target.checked);
                    }}
                    className="admin-checkbox"
                    id={`checkbox-${row.id}`}
                  />
                  <label 
                    htmlFor={`checkbox-${row.id}`} 
                    className="admin-checkbox-label"
                    onClick={(e) => e.stopPropagation()} // Stop event propagation
                  >
                    <svg className="admin-checkbox-icon" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </label>
                </div>
              </td>
            )}
            {columns.map(column => (
              <td 
                key={column.key} 
                className={`admin-table-cell ${column.className || ''}`} 
                data-key={column.key}
              >
                {column.render ? column.render(row, rowIndex) : row[column.key]}
              </td>
            ))}
            {actions && (
              <td className="admin-table-actions">
                <div className="admin-table-actions-container">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      className={`admin-action-button ${action.className || ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        action.onClick(row);
                      }}
                      title={action.label}
                      type="button"
                    >
                      {action.icon}
                      <span className="admin-action-tooltip">{action.label}</span>
                    </button>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    const { page, pageSize, totalCount, totalPages } = pagination;
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, totalCount);

    // Calculate which page numbers to show
    let pageNumbers = [];
    if (totalPages <= 5) {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (page <= 3) {
      pageNumbers = [1, 2, 3, 4, 5];
    } else if (page >= totalPages - 2) {
      pageNumbers = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      pageNumbers = [page - 2, page - 1, page, page + 1, page + 2];
    }

    return (
      <div className="admin-table-pagination">
        <div className="admin-pagination-info">
          <span>{startItem} to {endItem} of {totalCount} items</span>
        </div>
        <div className="admin-pagination-controls">
          <button
            className="admin-pagination-button prev"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          {pageNumbers.map(pageNum => (
            <button
              key={pageNum}
              className={`admin-pagination-button ${page === pageNum ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          
          <button
            className="admin-pagination-button next"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-table-wrapper">
      <div className="admin-table-responsive">
        <table className="admin-table">
          {renderHeaders()}
          {renderRows()}
        </table>
      </div>
      {data.length > 0 && renderPagination()}
    </div>
  );
};

AdminTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node.isRequired,
      render: PropTypes.func,
      className: PropTypes.string,
      width: PropTypes.string
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  selectedIds: PropTypes.array,
  onSelectAll: PropTypes.func,
  onSelectRow: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  emptyState: PropTypes.node,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
  }),
  onPageChange: PropTypes.func,
  selectableRows: PropTypes.bool,
  onRowClick: PropTypes.func
};

export default AdminTable;