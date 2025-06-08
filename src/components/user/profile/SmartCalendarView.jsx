import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import './SmartCalendarView.css';

const SmartCalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('intensity'); // 'intensity', 'urgency'
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // Real Command Center data
  const [timelineData, setTimelineData] = useState({
    deadlines: {},
    workload: {},
    urgencies: {},
    schools: []
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load real data from localStorage like in Dashboard
  useEffect(() => {
    const loadRealData = () => {
      try {
        const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
        const schoolDeadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
        const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
        const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
        
        const deadlines = {};
        const workload = {};
        const urgencies = {};
        const today = new Date();
        
        savedSchools.forEach(school => {
          const deadline = schoolDeadlines[school.id];
          const essays = schoolEssays[school.id] || [];
          
          if (deadline && deadline !== "not defined") {
            const deadlineDate = new Date(deadline);
            const dateKey = deadlineDate.toISOString().split('T')[0];
            
            // Calculate urgency based on days remaining
            const timeDiff = deadlineDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            let urgencyLevel = 'normal';
            if (daysRemaining < 0) urgencyLevel = 'overdue';
            else if (daysRemaining <= 2) urgencyLevel = 'critical';
            else if (daysRemaining <= 7) urgencyLevel = 'urgent';
            else if (daysRemaining <= 30) urgencyLevel = 'upcoming';
            
            // Calculate workload intensity based on number of essays and completion status
            const schoolHistory = essayHistory[school.id] || {};
            const completedEssays = essays.filter(essay => 
              schoolHistory[essay.id] && schoolHistory[essay.id].versions && schoolHistory[essay.id].versions.length > 0
            ).length;
            const pendingEssays = essays.length - completedEssays;
            
            let intensity = Math.min(pendingEssays + 1, 5); // Base intensity on pending work
            if (urgencyLevel === 'critical' || urgencyLevel === 'overdue') intensity = Math.min(intensity + 2, 5);
            else if (urgencyLevel === 'urgent') intensity = Math.min(intensity + 1, 5);
            
            deadlines[dateKey] = {
              schools: school.name,
              type: essays.length > 0 ? 'essays' : 'application',
              intensity: intensity,
              urgency: urgencyLevel,
              count: essays.length,
              completedCount: completedEssays,
              daysRemaining: daysRemaining
            };
            
            workload[dateKey] = intensity;
            urgencies[dateKey] = urgencyLevel;
          }
        });

        setTimelineData({ 
          deadlines, 
          workload, 
          urgencies, 
          schools: savedSchools.map(s => s.name) 
        });
      } catch (error) {
        console.error("Error loading calendar data:", error);
        setTimelineData({ deadlines: {}, workload: {}, urgencies: {}, schools: [] });
      }
    };

    loadRealData();

    // Listen for localStorage changes to update calendar
    const handleStorageChange = (e) => {
      if (['mySavedSchools', 'schoolDeadlines', 'schoolEssays', 'essayGenerationHistory'].includes(e.key)) {
        loadRealData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Smart calculation of month metrics
  const monthMetrics = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    let totalDeadlines = 0;
    let overdueCount = 0;
    let criticalCount = 0;
    let urgentCount = 0;
    let peakDay = null;
    let maxIntensity = 0;

    Object.entries(timelineData.deadlines).forEach(([dateKey, data]) => {
      if (dateKey.startsWith(monthKey)) {
        totalDeadlines += data.count;
        if (data.urgency === 'overdue') overdueCount++;
        if (data.urgency === 'critical') criticalCount++;
        if (data.urgency === 'urgent') urgentCount++;
        
        if (data.intensity > maxIntensity) {
          maxIntensity = data.intensity;
          peakDay = new Date(dateKey + 'T00:00:00').getDate();
        }
      }
    });

    return { totalDeadlines, overdueCount, criticalCount, urgentCount, peakDay, maxIntensity };
  }, [currentDate, timelineData]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    const days = [];
    
    for (let i = startDay; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        fullDate: prevDate,
        dateKey: prevDate.toISOString().split('T')[0]
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      const dateKey = fullDate.toISOString().split('T')[0];
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: fullDate,
        dateKey: dateKey,
        deadlines: timelineData.deadlines[dateKey] || null,
        workload: timelineData.workload[dateKey] || 0,
        urgency: timelineData.urgencies[dateKey] || null
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: nextDate,
        dateKey: nextDate.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getIntensityClass = (intensity) => {
    if (intensity === 0) return '';
    if (intensity <= 1) return 'intensity-low';
    if (intensity <= 2) return 'intensity-medium';
    if (intensity <= 3) return 'intensity-high';
    return 'intensity-critical';
  };

  const getUrgencyClass = (urgency) => {
    switch(urgency) {
      case 'overdue': return 'urgency-overdue';
      case 'critical': return 'urgency-critical';
      case 'urgent': return 'urgency-urgent';
      case 'upcoming': return 'urgency-upcoming';
      default: return '';
    }
  };

  const handleDayClick = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day);
    }
  };

  const getDayClasses = (day) => {
    let classes = ['smart-calendar-day'];
    
    if (!day.isCurrentMonth) classes.push('other-month');
    if (isToday(day.fullDate)) classes.push('today');
    if (selectedDate?.dateKey === day.dateKey) classes.push('selected');
    
    if (viewMode === 'intensity' && day.workload > 0) {
      classes.push(getIntensityClass(day.workload));
    }
    
    if (viewMode === 'urgency' && day.urgency) {
      classes.push(getUrgencyClass(day.urgency));
    }
    
    if (day.deadlines && monthMetrics.peakDay === day.date) {
      classes.push('peak-day');
    }
    
    return classes.join(' ');
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="smart-calendar-container">
      <div className="smart-calendar-header">
        <div className="calendar-title-section">
          <div className="title-with-icon">
            <CalendarIcon size={20} />
            <h2 className="smart-calendar-title">Smart Calendar</h2>
          </div>
          <div className="calendar-insights">
            <span className="insight-metric">
              <Target size={14} />
              {monthMetrics.totalDeadlines} deadlines this month
            </span>
            {monthMetrics.overdueCount > 0 && (
              <span className="insight-overdue">
                <AlertTriangle size={14} />
                {monthMetrics.overdueCount} overdue
              </span>
            )}
            {monthMetrics.criticalCount > 0 && (
              <span className="insight-critical">
                <AlertTriangle size={14} />
                {monthMetrics.criticalCount} critical
              </span>
            )}
          </div>
        </div>

        <div className="calendar-controls">
          <div className="view-mode-selector">
            <button 
              className={`mode-btn ${viewMode === 'intensity' ? 'active' : ''}`}
              onClick={() => setViewMode('intensity')}
              title="Deadline intensity"
            >
              <TrendingUp size={16} />
              Intensity
            </button>
            <button 
              className={`mode-btn ${viewMode === 'urgency' ? 'active' : ''}`}
              onClick={() => setViewMode('urgency')}
              title="Urgency level"
            >
              <Clock size={16} />
              Urgency
            </button>
          </div>

          <button 
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? "Hide details" : "Show details"}
          >
            {showSidebar ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="smart-calendar-body">
        <div className="smart-calendar-navigation">
          <button className="nav-btn sophisticated" onClick={() => navigateMonth(-1)}>
            <ChevronLeft size={18} />
          </button>
          
          <div className="month-display">
            <h3 className="calendar-month-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            {monthMetrics.peakDay && (
              <span className="peak-indicator">
                Peak activity on {monthMetrics.peakDay}
              </span>
            )}
          </div>
          
          <button className="nav-btn sophisticated" onClick={() => navigateMonth(1)}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className={`smart-calendar-content ${showSidebar ? 'with-sidebar' : ''}`}>
          <div className="smart-calendar-grid">
            <div className="smart-calendar-weekdays">
              {weekDays.map(day => (
                <div key={day} className="weekday-header">
                  {day}
                </div>
              ))}
            </div>

            <div className="smart-calendar-days">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={getDayClasses(day)}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="day-number">{day.date}</span>
                  
                  {day.deadlines && (
                    <div className="day-content">
                      <div className="deadline-indicator">
                        <span className="deadline-count">{day.deadlines.count}</span>
                        <span className="deadline-type">{day.deadlines.type}</span>
                      </div>
                    </div>
                  )}
                  
                  {day.workload > 0 && viewMode === 'intensity' && (
                    <div className="intensity-indicator">
                      <div className="intensity-dots">
                        {Array(Math.min(day.workload, 5)).fill().map((_, i) => (
                          <div key={i} className="intensity-dot" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showSidebar && (
            <div className="smart-calendar-sidebar">
              {selectedDate ? (
                <div className="selected-date-details">
                  <h4 className="sidebar-title">
                    {selectedDate.fullDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </h4>
                  
                  {selectedDate.deadlines ? (
                    <div className="date-deadlines">
                      <div className={`urgency-badge ${selectedDate.urgency || 'normal'}`}>
                        {selectedDate.urgency === 'overdue' && <AlertTriangle size={14} />}
                        {selectedDate.urgency === 'critical' && <AlertTriangle size={14} />}
                        {selectedDate.urgency === 'urgent' && <Clock size={14} />}
                        {selectedDate.urgency === 'overdue' ? 'Overdue' : 
                         selectedDate.urgency === 'critical' ? 'Critical' :
                         selectedDate.urgency === 'urgent' ? 'Urgent' :
                         selectedDate.urgency === 'upcoming' ? 'Upcoming' : 'Normal'}
                      </div>
                      
                      <div className="deadline-details">
                        <p className="school-name">{selectedDate.deadlines.schools}</p>
                        <p className="deadline-type-detail">{selectedDate.deadlines.type}</p>
                        <p className="deadline-count-detail">{selectedDate.deadlines.count} deadline(s)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="no-deadlines">
                      <p>No deadlines this day</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="month-overview">
                  <h4 className="sidebar-title">Overview</h4>
                  
                  <div className="overview-metrics">
                    <div className="metric-card">
                      <span className="metric-value">{monthMetrics.totalDeadlines}</span>
                      <span className="metric-label">Total deadlines</span>
                    </div>
                    
                    {monthMetrics.overdueCount > 0 && (
                      <div className="metric-card overdue">
                        <span className="metric-value">{monthMetrics.overdueCount}</span>
                        <span className="metric-label">Overdue</span>
                      </div>
                    )}
                    
                    {monthMetrics.criticalCount > 0 && (
                      <div className="metric-card critical">
                        <span className="metric-value">{monthMetrics.criticalCount}</span>
                        <span className="metric-label">Critical</span>
                      </div>
                    )}
                    
                    {monthMetrics.urgentCount > 0 && (
                      <div className="metric-card urgent">
                        <span className="metric-value">{monthMetrics.urgentCount}</span>
                        <span className="metric-label">Urgent</span>
                      </div>
                    )}
                  </div>

                  <div className="legend">
                    <h5>Legend</h5>
                    {viewMode === 'intensity' && (
                      <div className="legend-items">
                        <div className="legend-item">
                          <div className="legend-color intensity-low"></div>
                          <span>Low intensity</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color intensity-medium"></div>
                          <span>Medium intensity</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color intensity-high"></div>
                          <span>High intensity</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color intensity-critical"></div>
                          <span>Critical intensity</span>
                        </div>
                      </div>
                    )}
                    
                    {viewMode === 'urgency' && (
                      <div className="legend-items">
                        <div className="legend-item">
                          <div className="legend-color urgency-overdue"></div>
                          <span>Overdue</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color urgency-critical"></div>
                          <span>Critical (≤2 days)</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color urgency-urgent"></div>
                          <span>Urgent (≤7 days)</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color urgency-upcoming"></div>
                          <span>Upcoming (≤30 days)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartCalendarView;