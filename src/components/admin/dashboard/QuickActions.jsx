import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, FileText } from 'lucide-react';
import './QuickActions.css';

// eslint-disable-next-line no-unused-vars
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="section-title-container">
    <h2 className="section-title">
      <Icon size={20} className="section-title-icon" />
      {title}
    </h2>
  </div>
);

const QuickActions = () => {
  return (
    <div className="dashboard-section quick-actions-section">
      <SectionTitle icon={PlusCircle} title="Quick Actions" />
      
      <div className="quick-actions">
        <Link to="/admin/users/create" className="action-button-ab primary">
          <PlusCircle size={16} />
          <span className="action-button-ab-text">Add User</span>
        </Link>
        
        <Link to="/admin/schools/create" className="action-button-ab">
          <PlusCircle size={16} />
          <span className="action-button-ab-text">Add School</span>
        </Link>
        
        <Link to="/admin/events/new" className="action-button-ab">
          <Calendar size={16} />
          <span className="action-button-ab-text">Schedule Event</span>
        </Link>
        
        <Link to="/admin/blog/new" className="action-button-ab">
          <FileText size={16} />
          <span className="action-button-ab-text">Publish Article</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;