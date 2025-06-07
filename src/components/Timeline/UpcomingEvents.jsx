import React from 'react';
import { format, differenceInDays, isSameDay } from 'date-fns';
import './UpcomingEvents.css';

// Icons with minimalist design
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Modern badge component
const ImportanceBadge = ({ importance }) => {
  const getImportanceLabel = (importance) => {
    switch (importance) {
      case 'critical': return 'Critical';
      case 'high': return 'Important';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Normal';
    }
  };
  
  return (
    <span className={`importance-badge importance-${importance}`}>
      {getImportanceLabel(importance)}
    </span>
  );
};

const UpcomingEvents = ({ events, onEventClick }) => {
  const today = new Date();
  
  // Filter for upcoming events (today and future)
  const upcomingEvents = events
    .filter(event => isSameDay(event.date, today) || event.date > today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3); // Show the next 3 events

  // Function to format time indicator
  const getTimeIndicator = (daysUntil) => {
    if (daysUntil === 0) return 'TODAY';
    if (daysUntil === 1) return 'TOMORROW';
    if (daysUntil < 14) return `IN ${daysUntil} DAYS`;
    const weeks = Math.floor(daysUntil / 7);
    return `IN ${weeks} WEEK${weeks > 1 ? 'S' : ''}`;
  };

  // Helper for importance colors
  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  if (upcomingEvents.length === 0) {
    return (
      <div className="upcoming-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          <path d="M9 16l2 2" />
          <path d="M13 16l-2 2" />
        </svg>
        <p>No upcoming events</p>
      </div>
    );
  }
  
  return (
    <div className="upcoming-events-wrapper">
      <div className="upcoming-events-grid">
        {upcomingEvents.map((event) => {
          const daysUntil = differenceInDays(event.date, today);
          const importanceColor = getImportanceColor(event.importance);
          const timeIndicator = getTimeIndicator(daysUntil);
          
          // English date formatting
          const dayOfWeek = format(event.date, 'EEEE');
          const dayNumber = format(event.date, 'd');
          const monthName = format(event.date, 'MMMM');
          const yearNumber = format(event.date, 'yyyy');
          
          return (
            <div 
              key={event.id}
              className="event-card"
              onClick={() => onEventClick(event)}
              style={{ '--importance-color': importanceColor }}
            >
              <div className="time-indicator">
                {timeIndicator}
              </div>
              
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <ImportanceBadge importance={event.importance} />
              </div>
              
              <div className="event-date-row">
                <CalendarIcon />
                <div className="date-info">
                  <div className="date-time-wrapper">
                    <span className="day-of-week">{dayOfWeek}</span>
                    {event.startTime && (
                      <span className="event-time">{event.startTime}</span>
                    )}
                  </div>
                  <div className="date-details">
                    <span className="month-name">{monthName}</span>
                    <span className="day-number">{dayNumber},</span>
                    <span className="year-number">{yearNumber}</span>
                  </div>
                </div>
              </div>
              
              {event.description && (
                <div className="event-description">
                  <p>{event.description}</p>
                </div>
              )}
              
              <div className="event-footer">
                <button className="event-details-btn">
                  View details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;