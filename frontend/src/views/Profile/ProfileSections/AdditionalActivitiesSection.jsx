import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Check, AlertCircle, Info, ChevronUp, ChevronDown, Heart, Sparkles, Home, ChevronRight, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProfileSections.css';

const AdditionalActivitiesSection = () => {
  // Structure d'une activité par défaut (comme dans OtherImpactful)
  const emptyActivity = {
    id: `activity_${Date.now()}`,
    title: '',
    explanation: '',
    order: 1
  };

  // États pour gérer les données - initialiser avec des activités vides ou existantes
  const [activities, setActivities] = useState([]);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const lastUpdateRef = useRef({ activities: [] });

  // Constantes
  const MAX_ACTIVITIES = 10;

  // Mettre à jour les données avec debounce
  useEffect(() => {
    if (JSON.stringify(activities) !== JSON.stringify(lastUpdateRef.current.activities)) {
      const timer = setTimeout(() => {
        console.log('Sauvegarde des activités:', activities);
        lastUpdateRef.current = { activities };
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [activities]);

  // Gestion de l'état de saisie
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [activities]);

  // Ajouter une première activité
  const handleAddFirstActivity = () => {
    const newActivity = { 
      ...emptyActivity,
      id: `activity_${Date.now()}`
    };
    setActivities([newActivity]);
    setExpandedActivity(newActivity.id);
  };

  // Ajouter une nouvelle activité
  const addActivity = () => {
    if (activities.length >= MAX_ACTIVITIES) return;
    
    const newId = `activity_${Date.now()}`;
    const newOrder = activities.length + 1;
    
    const newActivity = {
      ...emptyActivity,
      id: newId,
      order: newOrder
    };
    
    setActivities([...activities, newActivity]);
    setExpandedActivity(newId);
  };

  // Supprimer une activité
  const removeActivity = (id) => {
    if (activities.length <= 1) {
      setActivities([]);
      setExpandedActivity(null);
      return;
    }
    
    const updatedActivities = activities
      .filter(activity => activity.id !== id)
      .map((activity, index) => ({ ...activity, order: index + 1 }));
    
    setActivities(updatedActivities);
    
    if (expandedActivity === id && updatedActivities.length > 0) {
      setExpandedActivity(updatedActivities[0].id);
    }
  };

  // Mettre à jour une activité
  const updateActivity = (id, field, value) => {
    const updatedActivities = activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    );
    
    setActivities(updatedActivities);
  };

  return (
    <div className="profile-section-wrapper">
      {/* Breadcrumb */}
      <div className="profile-breadcrumb">
        <Link to="/profile" className="profile-breadcrumb-link">
          <Home size={16} className="profile-breadcrumb-icon" />
          Profile
        </Link>
        <span className="profile-breadcrumb-separator">
          <ChevronRight size={14} />
        </span>
        <Link to="/profile/information" className="profile-breadcrumb-link">
          Profile Information
        </Link>
        <span className="profile-breadcrumb-separator">
          <ChevronRight size={14} />
        </span>
        <span className="profile-breadcrumb-current">Additional Activities</span>
      </div>

      <div className="profile-section-container">
        {/* Header */}
        <div className="profile-section-header-modern">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Impactful{" "}
                <span className="header-title-highlight">Activities</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="help-toggle"
                onClick={() => setShowHelp(!showHelp)}
                aria-label="Toggle help information"
              >
                <Info className="help-toggle-icon" />
                <span>Examples</span>
              </button>

           
            </div>
          </div>
          
          {/* Panel d'aide */}
          {showHelp && (
            <div className="help-panel">
              <div className="help-content">
                <h3 className="help-title">What to Include</h3>
                <div className="help-tips">
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Volunteer work and community service</span>
                  </div>
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Leadership roles and student government</span>
                  </div>
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Tutoring and mentoring activities</span>
                  </div>
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Sports, arts, and creative pursuits</span>
                  </div>
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Part-time jobs and internships</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Corps principal */}
        <div className="profile-statement-body">
          {/* Message quand aucune activité */}
          {activities.length === 0 && (
            <div className="initial-question">
              <div className="question-card">
                <div className="question-icon">
                  <Sparkles size={32} />
                </div>
                <h3 className="question-title">No Additional Activities Added</h3>
                <p className="question-description">
                  You haven't added any additional activities yet. Feel free to add one by clicking the button below to showcase your diverse interests and commitments.
                </p>
                <div className="question-actions">
                  <button
                    type="button"
                    className="choice-btn choice-btn-yes"
                    onClick={handleAddFirstActivity}
                  >
                    Add One
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Liste des activités avec formulaire style OtherImpactful */}
          {activities.length > 0 && (
            <div className="experiences-form">
              <div className="experiences-list">
                {activities.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`experience-card ${expandedActivity === activity.id ? 'expanded' : 'collapsed'}`}
                  >
                    <div 
                      className="experience-header"
                      onClick={() => setExpandedActivity(
                        expandedActivity === activity.id ? null : activity.id
                      )}
                    >
                      <div className="experience-header-left">
                        <div className="experience-order">
                          <span>{activity.order}</span>
                        </div>
                        <div className="experience-title-container">
                          {activity.title && (
                            <div className="experience-preview-snippet">
                              {activity.title.substring(0, 100)}
                              {activity.title.length > 100 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="experience-header-right">
                        <button 
                          className="experience-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const confirmed = window.confirm(
                              'Are you sure you want to delete this activity? This action cannot be undone.'
                            );
                            if (confirmed) {
                              removeActivity(activity.id);
                            }
                          }}
                          aria-label="Delete activity"
                          title="Delete activity"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button 
                          className={`experience-expand-btn ${expandedActivity === activity.id ? 'expanded' : ''}`}
                          aria-label={expandedActivity === activity.id ? "Collapse activity" : "Expand activity"}
                        >
                          {expandedActivity === activity.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedActivity === activity.id && (
                      <div className="experience-content">
                        <div className="experience-form">
                          {/* Titre de l'activité */}
                          <div className="form-group">
                            <label htmlFor={`title-${activity.id}`}>
                              <span>Other Impactful Experiences?</span>
                            </label>
                            <input
                              type="text"
                              id={`title-${activity.id}`}
                              value={activity.title}
                              onChange={(e) => updateActivity(activity.id, 'title', e.target.value)}
                              placeholder="Financial hardship, family illness, cultural challenges..."
                              className="form-input"
                            />
                          </div>
                          
                          {/* Explication */}
                          <div className="form-group">
                            <label htmlFor={`explanation-${activity.id}`}>
                              <span>Explanation</span>
                            </label>
                            <textarea
                              id={`explanation-${activity.id}`}
                              value={activity.explanation}
                              onChange={(e) => updateActivity(activity.id, 'explanation', e.target.value)}
                              placeholder="Describe this experience and explain how it shaped you, what you learned, and how it influenced your path to medicine..."
                              className="form-textarea"
                              rows={6}
                            />
                          </div>
                          
                          {/* Actions de l'activité */}
                          <div className="experience-actions">
                            <div className="experience-action-left">
                              {/* Espace vide pour l'alignement */}
                            </div>
                            
                            <div className="experience-action-right">
                              <button 
                                type="button" 
                                className="choice-btn choice-btn-secondary"
                                onClick={() => setExpandedActivity(null)}
                                style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', marginRight: '0.75rem' }}
                              >
                                Cancel
                              </button>
                              <button 
                                type="button" 
                                className="choice-btn choice-btn-yes"
                                onClick={() => {
                                  console.log('Activity saved:', activity);
                                  setExpandedActivity(null);
                                }}
                                style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
                              >
                                <Check size={16} style={{ marginRight: '0.5rem' }} />
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bouton ajouter une activité */}
              {activities.length < MAX_ACTIVITIES && (
                <button 
                  type="button"
                  className="add-experience-button"
                  onClick={addActivity}
                  aria-label="Add another experience"
                >
                  <Plus size={18} className="add-icon" />
                  <span>Add another experience</span>
                </button>
              )}
              
              {/* Note d'information */}
              <div className="experiences-note">
                <div className="note-icon-container">
                  <AlertCircle size={20} className="note-icon" />
                </div>
                <div className="note-content">
                  <h4 className="note-title">Optional but Valuable</h4>
                  <p className="note-text">
                    These experiences help admissions committees understand your unique background and the personal qualities that make you stand out as a candidate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Indicateur de sauvegarde */}
          {isTyping && (
            <div className="typing-indicator" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span>Saving...</span>
              <div className="typing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalActivitiesSection;