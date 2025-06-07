import React from 'react';
import { TrendingUp } from 'lucide-react';
import './UsageStats.css';

// eslint-disable-next-line no-unused-vars
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="section-title-container">
    <h2 className="section-title">
      <Icon size={20} className="section-title-icon" />
      {title}
    </h2>
  </div>
);

const UsageStats = () => {
  // Stats data
  const stats = {
    newUsers: 142,
    conversionRate: '4.3%',
    activeUsers: 867,
    activePlans: 4
  };

  return (
    <div className="dashboard-section usage-stats-section">
      <div className="section-header">
        <SectionTitle icon={TrendingUp} title="Usage Statistics" />
      </div>
      
      <div className="statistics-grid">
        <div className="statistic-item">
          <span className="statistic-label">New Users (30d)</span>
          <span className="statistic-value">{stats.newUsers}</span>
        </div>
        
        <div className="statistic-item">
          <span className="statistic-label">Conversion Rate</span>
          <span className="statistic-value">{stats.conversionRate}</span>
        </div>
        
        <div className="statistic-item">
          <span className="statistic-label">Active Users</span>
          <span className="statistic-value">{stats.activeUsers}</span>
        </div>
        
        <div className="statistic-item">
          <span className="statistic-label">Active Plans</span>
          <span className="statistic-value">{stats.activePlans}</span>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;