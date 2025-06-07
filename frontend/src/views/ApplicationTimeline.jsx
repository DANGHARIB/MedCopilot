import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Eye,
  CalendarDays,
  Plus,
  Clock,
  Award
} from 'lucide-react';
import UserLayout from '../components/user/layout/UserLayout';
import './ApplicationTimeline.css';
import { TimelineBreadcrumbs } from '../components/UI/Breadcrumbs';
// Import de ApplicationTimelineResources supprimé
import ApplicationTimelineSteps from '../components/Timeline/ApplicationTimelineSteps';

// Main Component
const ApplicationTimeline = () => {
  const navigate = useNavigate();

  
  const handleAddToCalendar = () => {
    navigate('/timeline-calendar?openNextDeadline=true');
  };
  
  const timelineSteps = [
    {
      id: 1,
      name: "Begin Personal Statement",
      date: "Mar 1",
      color: "orange",
      status: "upcoming" 
    },
    {
      id: 2,
      name: "Request Letters",
      date: "Mar 1",
      color: "red",
      status: "upcoming"
    },
    {
      id: 3,
      name: "AMCAS Application",
      date: "May 1",
      color: "red-dark",
      status: "upcoming"
    },
    {
      id: 4,
      name: "Finalize Personal Statement",
      date: "May 22",
      color: "amber",
      status: "upcoming"
    },
    {
      id: 5,
      name: "AMCAS Submission",
      date: "Jun 1",
      color: "red-dark",
      status: "upcoming"
    }
  ];
  
  return (
    <UserLayout>
      <div className="app-timeline-container">
        <div className="app-timeline-content">
          {/* Header Section */}
          <div className="application-timeline-header-section">
            <TimelineBreadcrumbs isCalendarPage={false} />
            
            <div className="application-timeline-header-card">
              <div className="application-timeline-header-content">
                <div className="application-timeline-header-text">
                  <h1>Medical School Application Progress</h1>
                  <p>Track your application progress and key milestones 
                    <br />
                    for the AMCAS medical school application process 2025-2026</p>
                </div>
                <button className="application-timeline-create-button" onClick={() => navigate('/timeline-calendar')}>
                  <Eye size={16} />
                  <span>View Calendar</span>
                </button>
              </div>
            </div>
          </div>

          {/* User-Focused Timeline Section */}
          <div className="user-timeline-section">
            <div className="timeline-cards">
              {/* Application Progress */}
              <div className="card">
                <div className="card-content">
                  <h3>Application Progress</h3>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `0%` }}></div>
                  </div>
                  <p className="progress-text">0% completed</p>
                </div>
              </div>

              {/* Next Deadline */}
              <div className="card">
                <div className="card-content">
                  <h3>Next Deadline</h3>
                  <div className="deadline-info">
                    <h4>AMCAS Application Opens</h4>
                    <p>May 1, 2025</p>
                  </div>
                  <div className="deadline-actions">
                    <span className="countdown-badge">
                      <Clock size={14} />
                      <span>39 days</span>
                    </span>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={handleAddToCalendar}
                    >
                      <Calendar size={16} />
                      <span>Add to Calendar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Steps (using the new component) */}
            <ApplicationTimelineSteps
              steps={timelineSteps}
              onAddDeadline={() => console.log('Add personal deadline clicked')}
              onViewFullTimeline={() => navigate('/timeline-calendar')}
            />
          </div>          
        </div>
      </div>
    </UserLayout>
  );
};

export default ApplicationTimeline;