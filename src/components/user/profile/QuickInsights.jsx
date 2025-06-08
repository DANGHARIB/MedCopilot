import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickInsights.css';
import {
  Lightbulb,
  TrendingUp,
  Target,
  Clock,
  School,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react';

/**
 * QuickInsights - Satellite spécialisé dans l'intelligence contextuelle
 * Génère des recommandations personnalisées basées sur l'analyse des données
 */
const QuickInsights = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour analyser les données et générer des insights intelligents
  const generateInsights = () => {
    try {
      const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
      const deadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
      
      const insights = [];
      const now = new Date();

      // 1. Analyse du portfolio d'écoles
      const schoolAnalysis = analyzeSchoolPortfolio(savedSchools);
      if (schoolAnalysis.insight) {
        insights.push(schoolAnalysis.insight);
      }

      // 2. Priorités des essays basées sur les deadlines
      const essayPriorities = analyzeEssayPriorities(savedSchools, deadlines, essayHistory, now);
      if (essayPriorities.insight) {
        insights.push(essayPriorities.insight);
      }

      // 3. Suggestions de progression
      const progressSuggestions = analyzeProgressOpportunities(savedSchools, essayHistory);
      if (progressSuggestions.insight) {
        insights.push(progressSuggestions.insight);
      }

      // 4. Insights de timing et urgence
      const timingInsights = analyzeTimingOpportunities(savedSchools, deadlines, now);
      if (timingInsights.insight) {
        insights.push(timingInsights.insight);
      }

      // 5. Suggestions stratégiques
      const strategicSuggestions = analyzeStrategicOpportunities(savedSchools, essayHistory);
      if (strategicSuggestions.insight) {
        insights.push(strategicSuggestions.insight);
      }

      // Trier par priorité et limiter à 4 insights
      insights.sort((a, b) => {
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      return insights.slice(0, 4);

    } catch (error) {
      console.error("Error generating insights:", error);
      return [];
    }
  };

  // Analyse du portfolio d'écoles
  const analyzeSchoolPortfolio = (schools) => {
    if (schools.length === 0) {
      return {
        insight: {
          id: 'portfolio-start',
          type: 'portfolio',
          priority: 'high',
          title: 'Build Your School List',
          description: 'Start by adding 8-12 schools with a balanced mix of reach, match, and safety schools.',
          action: 'explore-schools',
          actionText: 'Explore Schools',
          icon: School,
          color: 'blue'
        }
      };
    }

    if (schools.length < 8) {
      return {
        insight: {
          id: 'portfolio-expand',
          type: 'portfolio',
          priority: 'medium',
          title: 'Expand Your School List',
          description: `You have ${schools.length} schools. Consider adding ${8 - schools.length} more for a well-rounded application strategy.`,
          action: 'view-all-schools',
          actionText: 'Add More Schools',
          icon: TrendingUp,
          color: 'green'
        }
      };
    }

    if (schools.length > 15) {
      return {
        insight: {
          id: 'portfolio-optimize',
          type: 'portfolio',
          priority: 'low',
          title: 'Consider Optimizing',
          description: `${schools.length} schools is quite ambitious. Consider focusing on your top choices for better essay quality.`,
          action: 'view-schools',
          actionText: 'Review List',
          icon: Target,
          color: 'orange'
        }
      };
    }

    return { insight: null };
  };

  // Analyse des priorités essays
  const analyzeEssayPriorities = (schools, deadlines, essayHistory, now) => {
    const urgentSchools = schools.filter(school => {
      const deadline = deadlines[school.id];
      if (deadline && deadline !== "not defined") {
        const deadlineDate = new Date(deadline);
        const daysRemaining = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        return daysRemaining <= 14 && daysRemaining > 0;
      }
      return false;
    });

    if (urgentSchools.length > 0) {
      const schoolWithEssays = urgentSchools.find(school => {
        const schoolEssayHistory = essayHistory[school.id] || {};
        return Object.keys(schoolEssayHistory).length === 0;
      });

      if (schoolWithEssays) {
        const deadline = deadlines[schoolWithEssays.id];
        const daysRemaining = Math.ceil((new Date(deadline) - now) / (1000 * 60 * 60 * 24));
        
        return {
          insight: {
            id: 'essay-priority',
            type: 'essay',
            priority: 'high',
            title: 'Essay Priority Alert',
            description: `Focus on ${schoolWithEssays.name} essays first - deadline in ${daysRemaining} days with no essays started.`,
            action: 'continue-essays',
            actionText: 'Start Essays',
            schoolId: schoolWithEssays.id,
            icon: AlertCircle,
            color: 'red'
          }
        };
      }
    }

    return { insight: null };
  };

  // Analyse des opportunités de progression
  const analyzeProgressOpportunities = (schools, essayHistory) => {
    if (schools.length === 0) return { insight: null };

    let totalEssays = 0;
    let completedEssays = 0;

    schools.forEach(school => {
      const schoolEssayHistory = essayHistory[school.id] || {};
      const essayCount = Object.keys(schoolEssayHistory).length;
      totalEssays += essayCount;
      
      Object.values(schoolEssayHistory).forEach(essay => {
        if (essay.versions && essay.versions.length > 0) {
          completedEssays++;
        }
      });
    });

    if (totalEssays === 0) {
      return {
        insight: {
          id: 'progress-start',
          type: 'progress',
          priority: 'medium',
          title: 'Ready to Start Writing?',
          description: 'Begin with your top choice school or the one with the earliest deadline.',
          action: 'generate-essay',
          actionText: 'Generate First Essay',
          icon: FileText,
          color: 'blue'
        }
      };
    }

    const progressPercentage = Math.round((completedEssays / totalEssays) * 100);

    if (progressPercentage >= 80) {
      return {
        insight: {
          id: 'progress-excellent',
          type: 'progress',
          priority: 'low',
          title: 'Excellent Progress!',
          description: `You're at ${progressPercentage}% completion. Consider reviewing and polishing your essays.`,
          action: 'view-all-essays',
          actionText: 'Review Essays',
          icon: CheckCircle,
          color: 'green'
        }
      };
    }

    if (progressPercentage >= 50) {
      return {
        insight: {
          id: 'progress-good',
          type: 'progress',
          priority: 'medium',
          title: 'Great Momentum!',
          description: `You're at ${progressPercentage}% completion. Keep the momentum going with ${totalEssays - completedEssays} essays remaining.`,
          action: 'view-all-essays',
          actionText: 'Continue Writing',
          icon: TrendingUp,
          color: 'green'
        }
      };
    }

    return {
      insight: {
        id: 'progress-boost',
        type: 'progress',
        priority: 'medium',
        title: 'Time to Accelerate',
        description: `Complete ${Math.ceil((totalEssays * 0.5) - completedEssays)} more essays to reach 50% milestone.`,
        action: 'generate-essay',
        actionText: 'Generate Essays',
        icon: Zap,
        color: 'orange'
      }
    };
  };

  // Analyse des opportunités de timing
  const analyzeTimingOpportunities = (schools, deadlines, now) => {
    const currentHour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    // Suggestions de timing optimal
    if (currentHour >= 9 && currentHour <= 11 && !isWeekend) {
      return {
        insight: {
          id: 'timing-optimal',
          type: 'timing',
          priority: 'low',
          title: 'Peak Productivity Time',
          description: 'Morning hours are ideal for focused essay writing. Take advantage of your mental clarity!',
          action: 'generate-essay',
          actionText: 'Start Writing',
          icon: Clock,
          color: 'purple'
        }
      };
    }

    // Analyse des deadlines à venir
    const upcomingDeadlines = schools.filter(school => {
      const deadline = deadlines[school.id];
      if (deadline && deadline !== "not defined") {
        const deadlineDate = new Date(deadline);
        const daysRemaining = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        return daysRemaining > 7 && daysRemaining <= 30;
      }
      return false;
    });

    if (upcomingDeadlines.length > 0) {
      return {
        insight: {
          id: 'timing-deadlines',
          type: 'timing',
          priority: 'medium',
          title: 'Plan Ahead',
          description: `${upcomingDeadlines.length} deadlines approaching in the next month. Great time to get ahead.`,
          action: 'view-schools',
          actionText: 'View Timeline',
          icon: Calendar,
          color: 'blue'
        }
      };
    }

    return { insight: null };
  };

  // Analyse des opportunités stratégiques
  const analyzeStrategicOpportunities = (schools, essayHistory) => {
    if (schools.length >= 5) {
      // Analyser la distribution des priorités
      const highPriority = schools.filter(s => s.priority === 'HIGH').length;
      const totalSchools = schools.length;
      const highPriorityRatio = highPriority / totalSchools;

      if (highPriorityRatio > 0.7) {
        return {
          insight: {
            id: 'strategy-balance',
            type: 'strategy',
            priority: 'medium',
            title: 'Diversify Your Strategy',
            description: 'Consider adding more match and safety schools to balance your high-reach strategy.',
            action: 'view-all-schools',
            actionText: 'Find Match Schools',
            icon: BarChart3,
            color: 'orange'
          }
        };
      }
    }

    return { insight: null };
  };

  // Effect pour générer les insights au montage et écouter les changements
  useEffect(() => {
    const refreshInsights = () => {
      const newInsights = generateInsights();
      setInsights(newInsights);
      setLoading(false);
    };

    refreshInsights();

    // Écouter les changements localStorage
    const handleStorageChange = (e) => {
      if (['mySavedSchools', 'schoolEssays', 'schoolDeadlines', 'essayGenerationHistory'].includes(e.key)) {
        refreshInsights();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handlers pour les actions
  const handleInsightAction = (insight) => {
    switch (insight.action) {
      case 'explore-schools':
      case 'view-all-schools':
        navigate('/viewAllSchool');
        break;
      case 'view-schools':
        navigate('/profile/schools');
        break;
      case 'generate-essay':
        navigate('/essay-generator');
        break;
      case 'view-all-essays':
        navigate('/get-all-essays');
        break;
      case 'continue-essays':
        if (insight.schoolId) {
          navigate(`/schools/${insight.schoolId}/essays`);
        } else {
          navigate('/essay-generator');
        }
        break;
      default:
        console.log('Unknown action:', insight.action);
    }
  };

  if (loading) {
    return (
      <div className="quick-insights">
        <div className="quick-insights-loading">
          <Lightbulb className="quick-insights-loading-icon" />
          <span>Analyzing your data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-insights">
      <div className="quick-insights-header">
        <div className="quick-insights-title-section">
          <Lightbulb className="quick-insights-title-icon" />
          <h3 className="quick-insights-title">Smart Recommendations</h3>
          {insights.length > 0 && (
            <span className="quick-insights-count">{insights.length}</span>
          )}
        </div>
      </div>

      <div className="quick-insights-content">
        {insights.length === 0 ? (
          <div className="quick-insights-empty-state">
            <CheckCircle className="quick-insights-empty-icon" />
            <h4>All optimized!</h4>
            <p>Your application strategy looks great. Keep up the excellent work!</p>
          </div>
        ) : (
          <div className="quick-insights-grid">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              
              return (
                <div 
                  key={insight.id} 
                  className={`quick-insights-card priority-${insight.priority} color-${insight.color}`}
                >
                  <div className="quick-insights-card-header">
                    <div className="quick-insights-icon">
                      <IconComponent size={18} />
                    </div>
                    <div className="quick-insights-priority-badge">
                      <span className={`priority-indicator priority-${insight.priority}`}></span>
                    </div>
                  </div>
                  
                  <div className="quick-insights-card-content">
                    <h4 className="quick-insights-card-title">{insight.title}</h4>
                    <p className="quick-insights-card-description">{insight.description}</p>
                  </div>

                  <div className="quick-insights-card-actions">
                    <button 
                      className="quick-insights-action-btn"
                      onClick={() => handleInsightAction(insight)}
                    >
                      {insight.actionText}
                      <ArrowRight size={14} />
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

export default QuickInsights;