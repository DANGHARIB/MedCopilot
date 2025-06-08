import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentActivity.css';
import {
  Clock,
  FileText,
  School,
  Calendar,
  Zap,
  Plus,
  Target,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

/**
 * RecentActivity - Satellite spécialisé dans le suivi du momentum et progression
 * Focus sur les activités récentes pour maintenir la motivation
 */
const RecentActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour analyser et extraire les activités récentes
  const analyzeRecentActivity = () => {
    try {
      const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
      const deadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');

      const activities = [];
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // 1. Essays récemment générés (dernières 48h)
      Object.keys(essayHistory).forEach(schoolId => {
        const schoolEssayHistory = essayHistory[schoolId];
        const school = savedSchools.find(s => s.id === schoolId);
        
        if (school && schoolEssayHistory) {
          Object.keys(schoolEssayHistory).forEach(essayId => {
            const essayRecord = schoolEssayHistory[essayId];
            if (essayRecord.versions && essayRecord.versions.length > 0) {
              const lastVersion = essayRecord.versions[essayRecord.versions.length - 1];
              const generatedAt = new Date(lastVersion.generatedAt);
              
              // Activités des dernières 48h
              if ((now - generatedAt) <= 48 * 60 * 60 * 1000) {
                activities.push({
                  id: `essay-${schoolId}-${essayId}`,
                  type: 'essay_generated',
                  timestamp: generatedAt,
                  schoolId,
                  schoolName: school.name,
                  essayId,
                  essayTitle: essayRecord.prompt ? essayRecord.prompt.substring(0, 60) + '...' : 'Essay',
                  action: 'continue-essay',
                  icon: FileText,
                  title: 'Essay Generated',
                  description: `Generated essay for ${school.name}`,
                  actionText: 'Continue Essay'
                });
              }
            }
          });
        }
      });

      // 2. Écoles récemment ajoutées (dernière semaine)
      savedSchools.forEach(school => {
        // Supposons que dateAdded existe ou utilisons une heuristique
        // Pour cette démo, on va simuler avec un timestamp basé sur l'ordre
        const estimatedAddedDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        if (estimatedAddedDate > sevenDaysAgo) {
          activities.push({
            id: `school-added-${school.id}`,
            type: 'school_added',
            timestamp: estimatedAddedDate,
            schoolId: school.id,
            schoolName: school.name,
            action: 'view-school',
            icon: School,
            title: 'School Added',
            description: `Added ${school.name} to your list`,
            actionText: 'View Details'
          });
        }
      });

      // 3. Deadlines récemment définies
      Object.keys(deadlines).forEach(schoolId => {
        const deadline = deadlines[schoolId];
        const school = savedSchools.find(s => s.id === schoolId);
        
        if (school && deadline && deadline !== "not defined") {
          // Simuler une date de définition récente
          const definedDate = new Date(now.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000);
          
          if (definedDate > sevenDaysAgo) {
            activities.push({
              id: `deadline-set-${schoolId}`,
              type: 'deadline_set',
              timestamp: definedDate,
              schoolId,
              schoolName: school.name,
              deadline: new Date(deadline),
              action: 'view-school',
              icon: Calendar,
              title: 'Deadline Set',
              description: `Set application deadline for ${school.name}`,
              actionText: 'View School'
            });
          }
        }
      });

      // 4. Milestones (achievements)
      if (savedSchools.length === 5) {
        activities.push({
          id: 'milestone-5-schools',
          type: 'milestone',
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          action: 'view-schools',
          icon: Target,
          title: 'Milestone Reached!',
          description: 'You\'ve added 5 schools to your list',
          actionText: 'View All Schools',
          isMilestone: true
        });
      }

      if (savedSchools.length === 10) {
        activities.push({
          id: 'milestone-10-schools',
          type: 'milestone',
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          action: 'view-schools',
          icon: TrendingUp,
          title: 'Great Progress!',
          description: 'You\'ve reached 10 schools in your list',
          actionText: 'Keep Going',
          isMilestone: true
        });
      }

      // Trier par timestamp (plus récent en premier) et limiter à 6 activités
      activities.sort((a, b) => b.timestamp - a.timestamp);
      return activities.slice(0, 6);

    } catch (error) {
      console.error("Error analyzing recent activity:", error);
      return [];
    }
  };

  // Effect pour analyser les activités au montage et écouter les changements
  useEffect(() => {
    const refreshActivities = () => {
      const recentActivities = analyzeRecentActivity();
      setActivities(recentActivities);
      setLoading(false);
    };

    refreshActivities();

    // Écouter les changements localStorage
    const handleStorageChange = (e) => {
      if (['mySavedSchools', 'schoolEssays', 'schoolDeadlines', 'essayGenerationHistory'].includes(e.key)) {
        refreshActivities();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handlers pour les actions
  const handleActivityAction = (activity) => {
    switch (activity.action) {
      case 'continue-essay':
        navigate(`/schools/${activity.schoolId}/essays/${activity.essayId}`);
        break;
      case 'view-school':
        navigate(`/schools/${activity.schoolId}`);
        break;
      case 'view-schools':
        navigate('/profile/schools');
        break;
      default:
        console.log('Unknown action:', activity.action);
    }
  };

  const handleViewAllActivity = () => {
    navigate('/profile/schools'); // Pour l'instant, rediriger vers schools
  };

  // Fonction pour formater le timestamp relatif
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="recent-activity">
        <div className="recent-activity-loading">
          <Clock className="recent-activity-loading-icon" />
          <span>Loading recent activity...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="recent-activity-header">
        <div className="recent-activity-title-section">
          <Clock className="recent-activity-title-icon" />
          <h3 className="recent-activity-title">Recent Activity</h3>
          {activities.length > 0 && (
            <span className="recent-activity-count">{activities.length}</span>
          )}
        </div>
        
        {activities.length > 0 && (
          <button 
            className="recent-activity-view-all"
            onClick={handleViewAllActivity}
          >
            View All
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="recent-activity-content">
        {activities.length === 0 ? (
          <div className="recent-activity-empty-state">
            <Plus className="recent-activity-empty-icon" />
            <h4>Start your journey!</h4>
            <p>Your recent activities will appear here as you make progress.</p>
          </div>
        ) : (
          <div className="recent-activity-timeline">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              
              return (
                <div 
                  key={activity.id} 
                  className={`recent-activity-item ${activity.isMilestone ? 'milestone' : activity.type}`}
                >
                  <div className="recent-activity-timeline-marker">
                    <div className="recent-activity-icon">
                      <IconComponent size={16} />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="recent-activity-timeline-line"></div>
                    )}
                  </div>
                  
                  <div className="recent-activity-content-item">
                    <div className="recent-activity-header-item">
                      <div className="recent-activity-info">
                        <h4 className="recent-activity-item-title">{activity.title}</h4>
                        <p className="recent-activity-item-description">{activity.description}</p>
                      </div>
                      
                      <div className="recent-activity-meta">
                        <span className="recent-activity-timestamp">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="recent-activity-actions">
                      <button 
                        className="recent-activity-action-btn"
                        onClick={() => handleActivityAction(activity)}
                      >
                        {activity.actionText}
                      </button>
                    </div>
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

export default RecentActivity; 