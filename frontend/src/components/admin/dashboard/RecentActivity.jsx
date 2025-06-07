import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  School, 
  Bot, 
  Users, 
  CheckCircle, 
  Calendar 
} from 'lucide-react';
import './RecentActivity.css';

// eslint-disable-next-line no-unused-vars
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="section-title-container">
    <h2 className="section-title">
      <Icon size={20} className="section-title-icon" />
      {title}
    </h2>
  </div>
);

// eslint-disable-next-line no-unused-vars
const ActivityItem = ({ user, action, time, icon: Icon }) => (
  <div className="activity-item">
    <div className="activity-icon">
      <Icon size={16} />
    </div>
    <div className="activity-content">
      <div className="activity-details">
        <span className="activity-user">{user}</span>
        <span className="activity-action">{action}</span>
      </div>
      <span className="activity-time">{time}</span>
    </div>
  </div>
);

const RecentActivity = () => {
  // Sample recent activity data
  const recentActivity = [
    { id: 1, user: "Jessica Chen", action: "added a new medical school", time: "2 hours ago", icon: School },
    { id: 2, user: "Michael Rodriguez", action: "created a new AI agent", time: "4 hours ago", icon: Bot },
    { id: 3, user: "Sarah Johnson", action: "updated her profile", time: "Yesterday", icon: Users },
    { id: 4, user: "David Kim", action: "registered for Boston Med School", time: "2 days ago", icon: CheckCircle },
    { id: 5, user: "Emily Wilson", action: "scheduled a new event", time: "3 days ago", icon: Calendar }
  ];

  return (
    <div className="dashboard-section activity-section">
      <div className="section-header">
        <SectionTitle icon={Activity} title="Recent Activity" />
        <div className="section-actions">
          <button className="section-button">
            <Bell size={16} />
            Notifications
          </button>
        </div>
      </div>
      
      <div className="activity-list">
        {recentActivity.map(activity => (
          <ActivityItem 
            key={activity.id}
            user={activity.user}
            action={activity.action}
            time={activity.time}
            icon={activity.icon}
          />
        ))}
      </div>
      
      <div className="section-footer">
        <Link to="/admin/activity" className="view-all-link">
          View all activity
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;