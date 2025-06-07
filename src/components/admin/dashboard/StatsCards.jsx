import React from 'react';
import { Link } from 'react-router-dom';
import { Users, School, Calendar, Bot } from 'lucide-react';
import './StatsCards.css';

// eslint-disable-next-line no-unused-vars
const StatisticCard = ({ title, value, icon: Icon, linkTo, linkText, color = "#4f46e5" }) => (
  <div className="dashboard-stat-card">
    <div className="stat-card-header">
      <div className="stat-card-icon" style={{ backgroundColor: `${color}15` }}>
        <Icon size={20} color={color} />
      </div>
      <h3 className="stat-card-title">{title}</h3>
    </div>
    <div className="stat-card-value">{value}</div>
    <Link to={linkTo} className="stat-card-link">
      {linkText}
    </Link>
  </div>
);

const StatsCards = () => {
  // Sample data
  const stats = {
    usersCount: 1245,
    schoolsCount: 87,
    eventsCount: 32,
    agentsCount: 15
  };

  return (
    <div className="dashboard-stats">
      <StatisticCard 
        title="Users" 
        value={stats.usersCount} 
        icon={Users} 
        linkTo="/admin/users"
        linkText="Manage Users"
        color="#4f46e5"
      />
      
      <StatisticCard 
        title="Medical Schools" 
        value={stats.schoolsCount} 
        icon={School} 
        linkTo="/admin/schools"
        linkText="Manage Schools"
        color="#0ea5e9"
      />
      
      <StatisticCard 
        title="Events" 
        value={stats.eventsCount} 
        icon={Calendar} 
        linkTo="/admin/events"
        linkText="Manage Events"
        color="#10b981"
      />
      
      <StatisticCard 
        title="AI Agents" 
        value={stats.agentsCount} 
        icon={Bot} 
        linkTo="/admin/agents"
        linkText="Manage Agents"
        color="#f59e0b"
      />
    </div>
  );
};

export default StatsCards;