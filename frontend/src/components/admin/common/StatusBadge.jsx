import React from 'react';
import PropTypes from 'prop-types';
import './StatusBadge.css';

const StatusBadge = ({ status, type = 'default', size = 'medium' }) => {
  // Format display text
  const getDisplayText = () => {
    if (!status) return '';
    
    // If status is camelCase, convert to spaced words
    const formatted = status
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
      
    return formatted;
  };

  return (
    <div className={`status-badge ${type} ${size}`}>
      {getDisplayText()}
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default StatusBadge;