import React, { useState } from 'react';
import { format } from 'date-fns';
import './EventList.css';

// Icons as React Components with improved styling
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const EmptyCalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const EventList = ({ events, onEventClick }) => {
  // State to manage collapsed/expanded sections
  const [collapsedMonths, setCollapsedMonths] = useState({});
  
  // Function to toggle the collapsed/expanded state of a month
  const toggleMonth = (monthYear) => {
    setCollapsedMonths(prev => ({
      ...prev,
      [monthYear]: !prev[monthYear]
    }));
  };
  
  // Group events by month
  const eventsByMonth = events.reduce((acc, event) => {
    const monthYear = format(event.date, 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {});
  
  // Sort months chronologically
  const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });
  
  // Function to determine badge class based on importance
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-default';
    }
  };

  // Function to determine badge class based on category
  const getCategoryClass = (category) => {
    switch (category) {
      case 'deadline': return 'badge-deadline';
      case 'exam': return 'badge-exam';
      case 'task': return 'badge-task';
      case 'personal': return 'badge-personal';
      default: return 'badge-default';
    }
  };
  
  // Function to format importance label
  const formatImportanceLabel = (importance) => {
    switch (importance) {
      case 'critical': return 'Critical';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return importance;
    }
  };
  
  // Function to format category label
  const formatCategoryLabel = (category) => {
    switch (category) {
      case 'deadline': return 'Deadline';
      case 'exam': return 'Exam';
      case 'task': return 'Task';
      case 'personal': return 'Personal';
      default: return category;
    }
  };
  
  // Function to get day of week
  const getDayOfWeek = (date) => {
    return format(date, 'EEEE');
  };

  return (
    <div className="event-list-container">
      {sortedMonths.length === 0 ? (
        <div className="empty-events">
          <EmptyCalendarIcon />
          <p>No events found</p>
        </div>
      ) : (
        sortedMonths.map((monthYear) => (
          <div key={monthYear} className="event-month-group">
            <div 
              className={`month-heading ${collapsedMonths[monthYear] ? 'collapsed' : ''}`}
              onClick={() => toggleMonth(monthYear)}
            >
              <div className="month-heading-content">
                <CalendarIcon />
                <h3>{monthYear}</h3>
              </div>
              <div className="collapse-indicator">
                {collapsedMonths[monthYear] ? <ChevronDownIcon /> : <ChevronDownIcon />}
              </div>
            </div>
            
            <div className={`event-list ${collapsedMonths[monthYear] ? 'collapsed' : ''}`}>
              {eventsByMonth[monthYear].map(event => (
                <div 
                  key={event.id}
                  className={`event-list-item ${event.importance || ''}`}
                  onClick={() => onEventClick(event)}
                >
                  <div className="event-date-container">
                    <div className="event-date">
                      <span className="event-date-month">{format(event.date, 'MMM').toUpperCase()}</span>
                      <span className="event-date-day">{format(event.date, 'd')}</span>
                    </div>
                    <span className="event-day-of-week">{getDayOfWeek(event.date)}</span>
                  </div>
                  
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-time">
                      <ClockIcon />
                      <span>
                        {event.startTime ? 
                          `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}` : 
                          'All day'
                        }
                      </span>
                    </div>
                    
                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                    
                    <div className="event-badges">
                      {event.isOfficial && (
                        <span className="badge badge-official">
                          Official
                        </span>
                      )}
                      {event.category && (
                        <span className={`badge ${getCategoryClass(event.category)}`}>
                          {formatCategoryLabel(event.category)}
                        </span>
                      )}
                      {event.importance && (
                        <span className={`badge ${getImportanceClass(event.importance)}`}>
                          {formatImportanceLabel(event.importance)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="event-action">
                    <button className="event-details-btn">
                      Details
                    </button>
                    <ChevronRightIcon />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;