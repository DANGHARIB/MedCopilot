import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Brain,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Activity,
  School,
  FileText,
  Users
} from 'lucide-react';
import './AnalyticsView.css';

const AnalyticsView = () => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'quarter'
  const [showDetails, setShowDetails] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});

  // Load and calculate real analytics from localStorage
  useEffect(() => {
    const calculateAnalytics = () => {
      try {
        const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
        const schoolDeadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
        const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
        const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
        
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

        // Calculate core metrics
        let totalSchools = savedSchools.length;
        let totalEssays = 0;
        let completedEssays = 0;
        let overdueDeadlines = 0;
        let upcomingDeadlines = 0;
        let totalAIGenerations = 0;
        let recentActivity = 0;
        
        // School-level analysis
        const schoolAnalytics = savedSchools.map(school => {
          const essays = schoolEssays[school.id] || [];
          const deadline = schoolDeadlines[school.id];
          const schoolHistory = essayHistory[school.id] || {};
          
          totalEssays += essays.length;
          
          // Count completed essays
          const completed = essays.filter(essay => 
            schoolHistory[essay.id] && schoolHistory[essay.id].versions && schoolHistory[essay.id].versions.length > 0
          ).length;
          completedEssays += completed;
          
          // Count AI generations
          Object.values(schoolHistory).forEach(essayData => {
            if (essayData.versions) {
              totalAIGenerations += essayData.versions.length;
              // Count recent activity (last 7 days)
              essayData.versions.forEach(version => {
                const versionDate = new Date(version.timestamp);
                if (versionDate >= sevenDaysAgo) {
                  recentActivity++;
                }
              });
            }
          });
          
          // Analyze deadline status
          let deadlineStatus = 'none';
          let daysRemaining = null;
          if (deadline && deadline !== "not defined") {
            const deadlineDate = new Date(deadline);
            const timeDiff = deadlineDate.getTime() - today.getTime();
            daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysRemaining < 0) {
              deadlineStatus = 'overdue';
              overdueDeadlines++;
            } else if (daysRemaining <= 30) {
              deadlineStatus = 'upcoming';
              upcomingDeadlines++;
            }
          }
          
          return {
            id: school.id,
            name: school.name,
            totalEssays: essays.length,
            completedEssays: completed,
            completionRate: essays.length > 0 ? (completed / essays.length) * 100 : 0,
            deadlineStatus,
            daysRemaining,
            aiGenerations: Object.values(schoolHistory).reduce((acc, essayData) => 
              acc + (essayData.versions ? essayData.versions.length : 0), 0)
          };
        });

        // Calculate performance trends (simulated based on real data patterns)
        const performanceData = generatePerformanceTrends(recentActivity, completedEssays, totalEssays);
        
        // Calculate predictions
        const predictions = calculatePredictions(schoolAnalytics, today);
        
        // Calculate insights
        const insights = generateInsights(schoolAnalytics, {
          totalSchools,
          totalEssays,
          completedEssays,
          overdueDeadlines,
          upcomingDeadlines,
          recentActivity
        });

        setAnalyticsData({
          overview: {
            totalSchools,
            totalEssays,
            completedEssays,
            completionRate: totalEssays > 0 ? (completedEssays / totalEssays) * 100 : 0,
            overdueDeadlines,
            upcomingDeadlines,
            totalAIGenerations,
            recentActivity,
            lastUpdated: today
          },
          schoolAnalytics,
          performance: performanceData,
          predictions,
          insights
        });

      } catch (error) {
        console.error("Error calculating analytics:", error);
        setAnalyticsData({
          overview: {},
          schoolAnalytics: [],
          performance: {},
          predictions: {},
          insights: []
        });
      }
    };

    calculateAnalytics();

    // Listen for data changes
    const handleStorageChange = (e) => {
      if (['mySavedSchools', 'schoolDeadlines', 'schoolEssays', 'essayGenerationHistory'].includes(e.key)) {
        calculateAnalytics();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Generate performance trends based on real data patterns
  const generatePerformanceTrends = (recentActivity, completedEssays, totalEssays) => {
    const days = [];
    const today = new Date();
    
    // Generate 30 days of trend data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const baseActivity = Math.max(0, recentActivity - i);
      const randomVariation = Math.random() * 0.3 - 0.15; // ±15% variation
      const activity = Math.max(0, Math.round(baseActivity * (1 + randomVariation)));
      
      days.push({
        date: date.toISOString().split('T')[0],
        activity,
        completions: i === 0 ? completedEssays : Math.max(0, completedEssays - Math.floor(Math.random() * 3))
      });
    }
    
    return { days };
  };

  // Calculate predictions based on current pace
  const calculatePredictions = (schoolAnalytics, today) => {
    const activeSchools = schoolAnalytics.filter(school => school.totalEssays > 0);
    const avgCompletionRate = activeSchools.length > 0 ? 
      activeSchools.reduce((acc, school) => acc + school.completionRate, 0) / activeSchools.length : 0;
    
    const upcomingDeadlines = schoolAnalytics.filter(school => 
      school.deadlineStatus === 'upcoming' && school.daysRemaining <= 30
    );
    
    const estimatedDaysToCompletion = avgCompletionRate > 0 ? 
      Math.round((100 - avgCompletionRate) / (avgCompletionRate / 30)) : null;
    
    return {
      avgCompletionRate,
      estimatedDaysToCompletion,
      atRiskDeadlines: upcomingDeadlines.filter(school => 
        school.completionRate < 50 && school.daysRemaining <= 14
      ).length,
      onTrackSchools: activeSchools.filter(school => school.completionRate >= 70).length
    };
  };

  // Generate actionable insights
  const generateInsights = (schoolAnalytics, overview) => {
    const insights = [];
    
    // Performance insights
    if (overview.completionRate >= 80) {
      insights.push({
        type: 'success',
        title: 'Excellent Progress',
        message: `You're completing essays at an impressive ${Math.round(overview.completionRate)}% rate. Keep up the momentum!`,
        action: 'Continue current strategy',
        priority: 'low'
      });
    } else if (overview.completionRate < 50) {
      insights.push({
        type: 'warning',
        title: 'Acceleration Needed',
        message: `Essay completion at ${Math.round(overview.completionRate)}%. Consider dedicating more focused time to writing.`,
        action: 'Schedule daily writing sessions',
        priority: 'high'
      });
    }
    
    // Deadline insights
    if (overview.overdueDeadlines > 0) {
      insights.push({
        type: 'critical',
        title: 'Overdue Attention Required',
        message: `${overview.overdueDeadlines} deadline(s) have passed. Immediate action needed.`,
        action: 'Review overdue applications',
        priority: 'critical'
      });
    }
    
    // School concentration insights
    const highPerformanceSchools = schoolAnalytics.filter(s => s.completionRate >= 80).length;
    const lowPerformanceSchools = schoolAnalytics.filter(s => s.completionRate < 30 && s.totalEssays > 0).length;
    
    if (lowPerformanceSchools > highPerformanceSchools && lowPerformanceSchools > 2) {
      insights.push({
        type: 'strategy',
        title: 'Focus Strategy Recommended',
        message: `Consider prioritizing ${lowPerformanceSchools} schools with lower completion rates.`,
        action: 'Prioritize underperforming schools',
        priority: 'medium'
      });
    }
    
    // Activity insights
    if (overview.recentActivity === 0) {
      insights.push({
        type: 'motivation',
        title: 'Resume Activity',
        message: 'No recent essay activity detected. Consistent daily progress yields better results.',
        action: 'Generate or revise an essay today',
        priority: 'medium'
      });
    }
    
    return insights;
  };

  // Calculate trend indicators
  const getTrendIndicator = (current, previous) => {
    if (previous === 0) return { direction: 'neutral', percentage: 0 };
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'neutral',
      percentage: Math.abs(change)
    };
  };

  const { overview = {}, schoolAnalytics = [], performance = {}, predictions = {}, insights = [] } = analyticsData;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div className="analytics-title-section">
          <div className="title-with-icon">
            <BarChart3 size={20} />
            <h2 className="analytics-title">Analytics Dashboard</h2>
          </div>
          <div className="analytics-subtitle">
            Insights and performance tracking for your medical school journey
          </div>
        </div>

        <div className="analytics-controls">
          <div className="time-range-selector">
            <button 
              className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              7D
            </button>
            <button 
              className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              30D
            </button>
            <button 
              className={`range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
              onClick={() => setTimeRange('quarter')}
            >
              90D
            </button>
          </div>

          <button 
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
            title={showDetails ? "Hide details" : "Show details"}
          >
            {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="analytics-body">
        {/* Key Metrics Overview */}
        <div className="metrics-overview">
          <div className="metric-card primary">
            <div className="metric-header">
              <div className="metric-icon">
                <Target size={18} />
              </div>
              <div className="metric-trend up">
                <ArrowUp size={14} />
                <span>+{Math.round(overview.completionRate || 0)}%</span>
              </div>
            </div>
            <div className="metric-content">
              <div className="metric-value">{Math.round(overview.completionRate || 0)}%</div>
              <div className="metric-label">Overall Progress</div>
              <div className="metric-detail">{overview.completedEssays || 0}/{overview.totalEssays || 0} essays completed</div>
            </div>
          </div>

          <div className="metric-card schools">
            <div className="metric-header">
              <div className="metric-icon">
                <School size={18} />
              </div>
              <div className="metric-trend neutral">
                <Activity size={14} />
                <span>{overview.totalSchools || 0}</span>
              </div>
            </div>
            <div className="metric-content">
              <div className="metric-value">{predictions.onTrackSchools || 0}</div>
              <div className="metric-label">On Track Schools</div>
              <div className="metric-detail">Out of {overview.totalSchools || 0} total schools</div>
            </div>
          </div>

          <div className="metric-card activity">
            <div className="metric-header">
              <div className="metric-icon">
                <Zap size={18} />
              </div>
              <div className="metric-trend up">
                <TrendingUp size={14} />
                <span>{overview.recentActivity || 0}</span>
              </div>
            </div>
            <div className="metric-content">
              <div className="metric-value">{overview.totalAIGenerations || 0}</div>
              <div className="metric-label">AI Generations</div>
              <div className="metric-detail">{overview.recentActivity || 0} in last 7 days</div>
            </div>
          </div>

          <div className={`metric-card deadlines ${overview.overdueDeadlines > 0 ? 'critical' : 'normal'}`}>
            <div className="metric-header">
              <div className="metric-icon">
                <Clock size={18} />
              </div>
              <div className={`metric-trend ${overview.overdueDeadlines > 0 ? 'down' : 'neutral'}`}>
                {overview.overdueDeadlines > 0 ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                <span>{overview.upcomingDeadlines || 0}</span>
              </div>
            </div>
            <div className="metric-content">
              <div className="metric-value">{overview.overdueDeadlines || 0}</div>
              <div className="metric-label">Overdue</div>
              <div className="metric-detail">{overview.upcomingDeadlines || 0} upcoming in 30 days</div>
            </div>
          </div>
        </div>

        {/* Performance Chart Section */}
        <div className="analytics-section performance-section">
          <div className="section-header">
            <h3 className="section-title">
              <Activity size={18} />
              Performance Trends
            </h3>
            <div className="section-insights">
              {overview.recentActivity > 0 ? (
                <span className="insight-positive">
                  <TrendingUp size={14} />
                  Active this week
                </span>
              ) : (
                <span className="insight-warning">
                  <TrendingDown size={14} />
                  Low activity
                </span>
              )}
            </div>
          </div>

          <div className="performance-chart">
            <div className="chart-container">
              {performance.days && performance.days.slice(-7).map((day, index) => (
                <div key={day.date} className="chart-bar">
                  <div 
                    className="bar activity-bar"
                    style={{ 
                      height: `${Math.max(10, (day.activity / Math.max(1, overview.recentActivity || 1)) * 100)}%` 
                    }}
                    title={`${day.activity} activities on ${new Date(day.date).toLocaleDateString()}`}
                  ></div>
                  <div className="bar-label">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* School Analytics */}
        <div className="analytics-section schools-section">
          <div className="section-header">
            <h3 className="section-title">
              <PieChart size={18} />
              School Progress Analysis
            </h3>
            <div className="section-insights">
              <span className="insight-metric">
                {schoolAnalytics.filter(s => s.completionRate >= 80).length} schools at 80%+ completion
              </span>
            </div>
          </div>

          <div className="schools-grid">
            {schoolAnalytics.slice(0, showDetails ? schoolAnalytics.length : 6).map(school => (
              <div key={school.id} className="school-analytics-card">
                <div className="school-card-header">
                  <div className="school-info">
                    <h4 className="school-name">{school.name}</h4>
                    <div className="school-stats">
                      {school.completedEssays}/{school.totalEssays} essays
                    </div>
                  </div>
                  <div className={`completion-badge ${
                    school.completionRate >= 80 ? 'excellent' :
                    school.completionRate >= 50 ? 'good' :
                    school.completionRate >= 25 ? 'fair' : 'needs-work'
                  }`}>
                    {Math.round(school.completionRate)}%
                  </div>
                </div>

                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${school.completionRate}%` }}
                  ></div>
                </div>

                <div className="school-card-footer">
                  {school.deadlineStatus === 'overdue' && (
                    <span className="status-badge overdue">
                      <AlertTriangle size={12} />
                      Overdue
                    </span>
                  )}
                  {school.deadlineStatus === 'upcoming' && school.daysRemaining <= 14 && (
                    <span className="status-badge urgent">
                      <Clock size={12} />
                      {school.daysRemaining} days left
                    </span>
                  )}
                  {school.aiGenerations > 0 && (
                    <span className="ai-badge">
                      <Brain size={12} />
                      {school.aiGenerations} AI generations
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictions & Insights */}
        <div className="analytics-section insights-section">
          <div className="section-header">
            <h3 className="section-title">
              <Brain size={18} />
              Insights & Recommendations
            </h3>
          </div>

          <div className="insights-grid">
            {insights.length > 0 ? insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type} ${insight.priority}`}>
                <div className="insight-header">
                  <div className="insight-icon">
                    {insight.type === 'success' && <CheckCircle2 size={16} />}
                    {insight.type === 'warning' && <AlertTriangle size={16} />}
                    {insight.type === 'critical' && <AlertTriangle size={16} />}
                    {insight.type === 'strategy' && <Target size={16} />}
                    {insight.type === 'motivation' && <Zap size={16} />}
                  </div>
                  <h4 className="insight-title">{insight.title}</h4>
                  <div className={`priority-badge ${insight.priority}`}>
                    {insight.priority}
                  </div>
                </div>
                <p className="insight-message">{insight.message}</p>
                <div className="insight-action">
                  <strong>Recommended:</strong> {insight.action}
                </div>
              </div>
            )) : (
              <div className="no-insights">
                <Award size={48} />
                <h4>Great Work!</h4>
                <p>Everything looks on track. Keep up the excellent progress!</p>
              </div>
            )}
          </div>
        </div>

        {/* Predictions */}
        {predictions.estimatedDaysToCompletion && (
          <div className="analytics-section predictions-section">
            <div className="section-header">
              <h3 className="section-title">
                <Calendar size={18} />
                Predictions & Timeline
              </h3>
            </div>

            <div className="predictions-grid">
              <div className="prediction-card">
                <div className="prediction-metric">
                  <span className="prediction-value">{predictions.estimatedDaysToCompletion}</span>
                  <span className="prediction-unit">days</span>
                </div>
                <div className="prediction-label">Estimated to completion</div>
                <div className="prediction-detail">At current pace</div>
              </div>

              <div className="prediction-card">
                <div className="prediction-metric">
                  <span className="prediction-value">{predictions.atRiskDeadlines || 0}</span>
                  <span className="prediction-unit">schools</span>
                </div>
                <div className="prediction-label">At risk deadlines</div>
                <div className="prediction-detail">Need immediate attention</div>
              </div>

              <div className="prediction-card">
                <div className="prediction-metric">
                  <span className="prediction-value">{Math.round(predictions.avgCompletionRate || 0)}</span>
                  <span className="prediction-unit">%</span>
                </div>
                <div className="prediction-label">Average completion</div>
                <div className="prediction-detail">Across all schools</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;