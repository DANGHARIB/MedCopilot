import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UrgencyDashboard.css';
import {
  AlertTriangle,
  Clock,
  Calendar,
  ArrowRight,
  School,
  FileText,
  Target,
  CheckCircle2
} from 'lucide-react';

/**
 * UrgencyDashboard - Satellite spécialisé dans la gestion des priorités
 * Focus sur les tâches critiques et urgentes avec actions directes
 */
const UrgencyDashboard = () => {
  const navigate = useNavigate();
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour analyser et calculer les tâches urgentes
  const analyzeUrgentTasks = () => {
    try {
      const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
      const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
      const deadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');

      const tasks = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      savedSchools.forEach(school => {
        const schoolId = school.id;
        const deadline = deadlines[schoolId];
        const essays = schoolEssays[schoolId] || [];
        const schoolEssayHistory = essayHistory[schoolId] || {};

        // Analyser la deadline de l'école
        if (deadline && deadline !== "not defined") {
          const deadlineDate = new Date(deadline);
          deadlineDate.setHours(0, 0, 0, 0);
          const timeDiff = deadlineDate.getTime() - today.getTime();
          const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

          let urgencyLevel = null;
          let urgencyColor = null;
          let urgencyIcon = null;

          if (daysRemaining < 0) {
            urgencyLevel = 'overdue';
            urgencyColor = '#dc2626';
            urgencyIcon = AlertTriangle;
          } else if (daysRemaining <= 2) {
            urgencyLevel = 'critical';
            urgencyColor = '#dc2626';
            urgencyIcon = AlertTriangle;
          } else if (daysRemaining <= 7) {
            urgencyLevel = 'urgent';
            urgencyColor = '#f59e0b';
            urgencyIcon = Clock;
          } else if (daysRemaining <= 30) {
            urgencyLevel = 'soon';
            urgencyColor = '#10b981';
            urgencyIcon = Calendar;
          }

          if (urgencyLevel && (urgencyLevel === 'overdue' || urgencyLevel === 'critical' || urgencyLevel === 'urgent')) {
            // Calculer le statut des essays pour cette école
            const totalEssays = essays.length;
            let completedEssays = 0;

            essays.forEach(essay => {
              const essayRecord = schoolEssayHistory[essay.id];
              if (essayRecord && essayRecord.versions && essayRecord.versions.length > 0) {
                completedEssays++;
              }
            });

            const essayProgress = totalEssays > 0 ? Math.round((completedEssays / totalEssays) * 100) : 0;

            tasks.push({
              id: `school-${schoolId}`,
              type: 'deadline',
              schoolId: schoolId,
              schoolName: school.name,
              schoolPriority: school.priority,
              urgencyLevel,
              urgencyColor,
              urgencyIcon,
              daysRemaining,
              deadline: deadlineDate,
              essayProgress,
              totalEssays,
              completedEssays,
              primaryAction: essayProgress < 100 ? 'continue-essays' : 'review-school',
              description: daysRemaining < 0 
                ? `Application deadline was ${Math.abs(daysRemaining)} day(s) ago`
                : `Application deadline in ${daysRemaining} day(s)`
            });
          }
        }
      });

      // Trier par urgence puis par jours restants
      tasks.sort((a, b) => {
        const urgencyOrder = { 'overdue': 0, 'critical': 1, 'urgent': 2, 'soon': 3 };
        if (urgencyOrder[a.urgencyLevel] !== urgencyOrder[b.urgencyLevel]) {
          return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
        }
        return a.daysRemaining - b.daysRemaining;
      });

      return tasks;
    } catch (error) {
      console.error("Error analyzing urgent tasks:", error);
      return [];
    }
  };

  // Effect pour analyser les tâches au montage et écouter les changements
  useEffect(() => {
    const refreshTasks = () => {
      const tasks = analyzeUrgentTasks();
      setUrgentTasks(tasks);
      setLoading(false);
    };

    refreshTasks();

    // Écouter les changements localStorage
    const handleStorageChange = (e) => {
      if (['mySavedSchools', 'schoolEssays', 'schoolDeadlines', 'essayGenerationHistory'].includes(e.key)) {
        refreshTasks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handlers pour les actions
  const handleTaskAction = (task) => {
    switch (task.primaryAction) {
      case 'continue-essays':
        navigate(`/schools/${task.schoolId}/essays`);
        break;
      case 'review-school':
        navigate(`/schools/${task.schoolId}`);
        break;
      default:
        navigate(`/schools/${task.schoolId}`);
    }
  };

  const handleViewAllSchools = () => {
    navigate('/profile/schools');
  };

  // Fonction pour obtenir le message d'urgence
  const getUrgencyMessage = (urgencyLevel, daysRemaining) => {
    switch (urgencyLevel) {
      case 'overdue':
        return `${Math.abs(daysRemaining)} day(s) overdue`;
      case 'critical':
        return daysRemaining === 0 ? 'Due today' : `${daysRemaining} day(s) left`;
      case 'urgent':
        return `${daysRemaining} day(s) left`;
      default:
        return `${daysRemaining} day(s) left`;
    }
  };

  // Fonction pour obtenir le texte d'action
  const getActionText = (task) => {
    if (task.essayProgress < 100) {
      return `Continue Essays (${task.completedEssays}/${task.totalEssays})`;
    }
    return 'Review School';
  };

  if (loading) {
    return (
      <div className="urgency-dashboard">
        <div className="urgency-loading">
          <Clock className="urgency-loading-icon" />
          <span>Analyzing deadlines...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="urgency-dashboard">
      <div className="urgency-header">
        <div className="urgency-title-section">
          <Target className="urgency-title-icon" />
          <h3 className="urgency-title">Priority Focus</h3>
          <span className="urgency-count">{urgentTasks.length}</span>
        </div>
        
        {urgentTasks.length > 0 && (
          <button 
            className="urgency-view-all"
            onClick={handleViewAllSchools}
          >
            View All Schools
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="urgency-content">
        {urgentTasks.length === 0 ? (
          <div className="urgency-empty-state">
            <CheckCircle2 className="urgency-empty-icon" />
            <h4>All caught up!</h4>
            <p>No urgent deadlines at the moment. Great work!</p>
          </div>
        ) : (
          <div className="urgency-tasks-list">
            {urgentTasks.map((task) => {
              const IconComponent = task.urgencyIcon;
              
              return (
                <div 
                  key={task.id} 
                  className={`urgency-task urgency-${task.urgencyLevel}`}
                >
                  <div className="urgency-task-header">
                    <div className="urgency-task-icon">
                      <IconComponent size={18} />
                    </div>
                    
                    <div className="urgency-task-info">
                      <h4 className="urgency-task-title">{task.schoolName}</h4>
                      <p className="urgency-task-description">{task.description}</p>
                    </div>

                    <div className="urgency-task-badge">
                      <span className="urgency-badge-text">
                        {getUrgencyMessage(task.urgencyLevel, task.daysRemaining)}
                      </span>
                    </div>
                  </div>

                  <div className="urgency-task-progress">
                    <div className="urgency-progress-info">
                      <span className="urgency-progress-label">Essay Progress:</span>
                      <span className="urgency-progress-value">{task.essayProgress}%</span>
                    </div>
                    <div className="urgency-progress-bar">
                      <div 
                        className="urgency-progress-fill"
                        style={{ width: `${task.essayProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="urgency-task-actions">
                    <button 
                      className="urgency-action-btn primary"
                      onClick={() => handleTaskAction(task)}
                    >
                      {task.essayProgress < 100 ? (
                        <>
                          <FileText size={16} />
                          {getActionText(task)}
                        </>
                      ) : (
                        <>
                          <School size={16} />
                          {getActionText(task)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrgencyDashboard; 