import React from 'react';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import RecentActivity from '../../components/admin/dashboard/RecentActivity';
import UsageStats from '../../components/admin/dashboard/UsageStats';
import QuickActions from '../../components/admin/dashboard/QuickActions';
import AdminTasks from '../../components/admin/dashboard/AdminTasks';
import './Dashboard.css';

/**
 * Main Dashboard Component with modular approach
 */
const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">
            Key metrics and administrative tools for Medschool Copilot
        </p>
        </div>
      </div>
      
      {/* Statistics Cards Component */}
      <StatsCards />
      
      <div className="dashboard-content">
        <div className="dashboard-main">
           {/* Usage Statistics Component */}
           <UsageStats />

          {/* Recent Activity Component */}
          <RecentActivity />
        </div>
        
        <div className="dashboard-sidebar">
          {/* Quick Actions Component */}
          <QuickActions />
          
          {/* Admin Tasks Component */}
          <AdminTasks />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;