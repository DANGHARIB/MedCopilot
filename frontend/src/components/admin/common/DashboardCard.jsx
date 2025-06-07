import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  trend = null, 
  description = null, 
  onClick = null, 
  className = '' 
}) => {
  const trendValue = trend ? parseFloat(trend) : 0;
  const isPositive = trendValue > 0;
  const isNeutral = trendValue === 0;
  
  return (
    <div 
      className={`dashboard-card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">{title}</h3>
        {icon && <div className="dashboard-card-icon">{icon}</div>}
      </div>
      
      <div className="dashboard-card-value">{value}</div>
      
      {trend !== null && (
        <div className={`dashboard-card-trend ${isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'}`}>
          {isPositive ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : isNeutral ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
          <span>{Math.abs(trendValue)}%</span>
        </div>
      )}
      
      {description && <div className="dashboard-card-description">{description}</div>}
      
      {onClick && (
        <div className="dashboard-card-action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

export default DashboardCard; 