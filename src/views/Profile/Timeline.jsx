import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Timeline.css';
import UrgencyDashboard from '../../components/user/profile/UrgencyDashboard';
import RecentActivity from '../../components/user/profile/RecentActivity';
import QuickInsights from '../../components/user/profile/QuickInsights';
import SmartCalendarView from '../../components/user/profile/SmartCalendarView';
import AnalyticsView from '../../components/user/profile/AnalyticsView';
import {
  Clock,
  Target,
  Calendar,
  BarChart3,
  Brain,
  Zap,
  School,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

/**
 * Timeline Command Center - Intelligent hub for medical school applications
 * Design Philosophy: "Digital Brain" with gravitational architecture
 * Center: Intelligent and actionable overview
 * Satellites: Easily accessible specialized tools
 */
const Timeline = () => {
  const navigate = useNavigate();

  // State for active Command Center view
  const [currentView, setCurrentView] = useState('dashboard');
  

  
  // State for consolidated data
  const [timelineData, setTimelineData] = useState({
    totalSchools: 0,
    totalEssays: 0,
    urgentTasks: 0,
    criticalTasks: 0,
    overallProgress: 0,
    lastUpdated: new Date()
  });

  // Function to calculate global metrics from localStorage
  const calculateMetrics = () => {
    try {
      // Retrieve saved schools
      const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
      const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
      const deadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');

      let totalEssays = 0;
      let completedEssays = 0;
      let urgentTasks = 0;
      let criticalTasks = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate for each school
      savedSchools.forEach(school => {
        const schoolId = school.id;
        const essays = schoolEssays[schoolId] || [];
        const deadline = deadlines[schoolId];
        const schoolEssayHistory = essayHistory[schoolId] || {};

        // Count essays
        totalEssays += essays.length;
        
        // Completed essays
        essays.forEach(essay => {
          const essayRecord = schoolEssayHistory[essay.id];
          if (essayRecord && essayRecord.versions && essayRecord.versions.length > 0) {
            completedEssays++;
          }
        });

        // Analyze deadlines for urgency
        if (deadline && deadline !== "not defined") {
          const deadlineDate = new Date(deadline);
          deadlineDate.setHours(0, 0, 0, 0);
          const timeDiff = deadlineDate.getTime() - today.getTime();
          const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysRemaining < 0) {
            criticalTasks++; // Overdue
          } else if (daysRemaining <= 2) {
            criticalTasks++; // Critical (≤2 days)
          } else if (daysRemaining <= 7) {
            urgentTasks++; // Urgent (≤7 days)
          }
        }
      });

      const overallProgress = totalEssays > 0 ? Math.round((completedEssays / totalEssays) * 100) : 0;

      return {
        totalSchools: savedSchools.length,
        totalEssays,
        completedEssays,
        urgentTasks,
        criticalTasks,
        overallProgress,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error("Error calculating Timeline metrics:", error);
      return {
        totalSchools: 0,
        totalEssays: 0,
        completedEssays: 0,
        urgentTasks: 0,
        criticalTasks: 0,
        overallProgress: 0,
        lastUpdated: new Date()
      };
    }
  };

  // Effect to calculate metrics on mount and listen for changes
  useEffect(() => {
    const refreshMetrics = () => {
      const metrics = calculateMetrics();
      setTimelineData(metrics);
    };

    // Initial calculation
    refreshMetrics();

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (['mySavedSchools', 'schoolEssays', 'schoolDeadlines', 'essayGenerationHistory'].includes(e.key)) {
        refreshMetrics();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Navigation handlers
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'view-schools':
        navigate('/profile/schools');
        break;
      case 'view-all-schools':
        navigate('/viewAllSchool');
        break;
      case 'generate-essay':
        navigate('/essay-generator');
        break;
      case 'view-all-essays':
        navigate('/get-all-essays');
        break;
      default:
        console.log('Action:', action);
    }
  };

  // Handler pour les clics sur les métriques
  const handleMetricClick = (metricType) => {
    switch (metricType) {
      case 'schools':
        navigate('/schools');
        break;
      case 'essays':
        navigate('/get-all-essays');
        break;
      case 'progress':
        navigate('/get-all-essays');
        break;
      case 'urgent':
        // Reste sur la page actuelle, les métriques urgentes sont déjà visibles
        break;
      default:
        console.log('Unknown metric type:', metricType);
    }
  };

  // Determine global urgency status
  const getGlobalUrgencyStatus = () => {
    if (timelineData.criticalTasks > 0) {
      return { level: 'critical', message: `${timelineData.criticalTasks} critical task(s)` };
    } else if (timelineData.urgentTasks > 0) {
      return { level: 'urgent', message: `${timelineData.urgentTasks} urgent task(s)` };
    } else if (timelineData.totalSchools === 0) {
      return { level: 'setup', message: 'Ready to start your journey' };
    } else {
      return { level: 'normal', message: 'All good' };
    }
  };





  const urgencyStatus = getGlobalUrgencyStatus();
    
    return (
    <div className="timeline-container">
      {/* Header inspired by MySchoolTab */}
      <div className="timeline-header">
        <div className="timeline-header-left">
          <h1 className="timeline-title">
            Command{" "}
            <span className="timeline-title-highlight">Center</span>
          </h1>
          <p className="timeline-subtitle">
            Your digital brain for medical school applications
          </p>
        </div>
        
        <div className="timeline-status-indicator">
          <div className={`timeline-status-badge status-${urgencyStatus.level}`}>
            {urgencyStatus.level === 'critical' && <AlertTriangle size={16} />}
            {urgencyStatus.level === 'urgent' && <Clock size={16} />}
            {urgencyStatus.level === 'normal' && <CheckCircle2 size={16} />}
            {urgencyStatus.level === 'setup' && <Target size={16} />}
            <span>{urgencyStatus.message}</span>
          </div>
        </div>
      </div>

      {/* View navigation */}
      <div className="timeline-navigation">
        <div className="timeline-nav-buttons">
          <button 
            className={`timeline-nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleViewChange('dashboard')}
          >
            <Target size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`timeline-nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => handleViewChange('calendar')}
          >
            <Calendar size={18} />
            <span>Calendar</span>
          </button>
          <button 
            className={`timeline-nav-btn ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => handleViewChange('analytics')}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Hero Card - Main Command Center container */}
      <div className="timeline-hero-card">
        {/* Metrics in Hero Card header */}
        <div className="timeline-metrics-bar">
          <div 
            className="timeline-metric clickable" 
            onClick={() => handleMetricClick('schools')}
          >
            <div className="timeline-metric-icon schools">
              <School size={20} />
            </div>
            <div className="timeline-metric-content">
              <span className="timeline-metric-value">{timelineData.totalSchools}</span>
              <span className="timeline-metric-label">Schools</span>
            </div>
          </div>

          <div 
            className="timeline-metric clickable"
            onClick={() => handleMetricClick('essays')}
          >
            <div className="timeline-metric-icon essays">
              <FileText size={20} />
            </div>
            <div className="timeline-metric-content">
              <span className="timeline-metric-value">
                {timelineData.completedEssays || 0}/{timelineData.totalEssays}
              </span>
              <span className="timeline-metric-label">Essays</span>
            </div>
          </div>

          <div 
            className="timeline-metric clickable"
            onClick={() => handleMetricClick('progress')}
          >
            <div className="timeline-metric-icon progress">
              <TrendingUp size={20} />
            </div>
            <div className="timeline-metric-content">
              <span className="timeline-metric-value">{timelineData.overallProgress}%</span>
              <span className="timeline-metric-label">Progress</span>
            </div>
          </div>

          {(timelineData.urgentTasks > 0 || timelineData.criticalTasks > 0) && (
            <div className="timeline-metric urgent">
              <div className="timeline-metric-icon alerts">
                <Zap size={20} />
              </div>
              <div className="timeline-metric-content">
                <span className="timeline-metric-value">
                  {timelineData.criticalTasks + timelineData.urgentTasks}
                </span>
                <span className="timeline-metric-label">Urgent</span>
              </div>
            </div>
          )}
        </div>

        {/* Main content of active view */}
        <div className="timeline-main-content">
          {currentView === 'dashboard' && (
            <div className="timeline-dashboard-view">
              <div className="timeline-welcome-section">
                <h2 className="timeline-welcome-title">
                  {timelineData.totalSchools === 0 
                    ? "Welcome to your Command Center" 
                    : "Overview of your applications"
                  }
                </h2>
                
                {timelineData.totalSchools === 0 ? (
                  <div className="timeline-empty-state">
                    <div className="timeline-empty-content">
                      <Target className="timeline-empty-icon" />
                      <h3>Ready to transform your medical journey?</h3>
                      <p>Start by adding your target schools and let the Command Center orchestrate your success.</p>
                      
                      <div className="timeline-quick-actions">
                        <button 
                          className="timeline-action-btn primary"
                          onClick={() => handleQuickAction('view-all-schools')}
                        >
                          <School size={18} />
                          Explore Schools
                        </button>
                        <button 
                          className="timeline-action-btn secondary"
                          onClick={() => handleQuickAction('generate-essay')}
                        >
                          <FileText size={18} />
                          Create Essay
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="timeline-dashboard-content">
                    {/* UrgencyDashboard - Satellite pour les tâches critiques */}
                    <div className="timeline-dashboard-section">
                      <UrgencyDashboard />
                    </div>

                    {/* RecentActivity - Satellite pour le momentum */}
                    <div className="timeline-dashboard-section">
                      <RecentActivity />
                    </div>

                    {/* QuickInsights - Satellite pour l'intelligence contextuelle */}
                    <div className="timeline-dashboard-section">
                      <QuickInsights />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'calendar' && (
            <div className="timeline-calendar-view">
              <SmartCalendarView />
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="timeline-analytics-view">
              <AnalyticsView />
            </div>
          )}
        </div>
      </div>

      {/* Footer with last update */}
      <div className="timeline-footer">
        <span className="timeline-last-update">
          Last updated: {timelineData.lastUpdated.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
        </div>
    );
};

export default Timeline; 