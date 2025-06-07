import React from 'react';
import './LoadingState.css';

/**
 * Loading state component for SchoolEssaySingle
 */
const LoadingState = () => {
  return (
    <div className="ses-essay-loading-state">
      <div className="ses-essay-loading-animation">
        <div className="ses-essay-loading-circle"></div>
        <div className="ses-essay-loading-circle"></div>
        <div className="ses-essay-loading-circle"></div>
      </div>
      <h2 className="ses-essay-loading-title">Loading Essay</h2>
      <p className="ses-essay-loading-text">Please wait while we retrieve your essay data...</p>
    </div>
  );
};

export default LoadingState; 