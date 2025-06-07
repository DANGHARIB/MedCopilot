import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Check, AlertCircle, Info, ChevronUp, ChevronDown, Heart, Sparkles } from 'lucide-react';
import './OtherImpactful.css';

const OtherImpactful = ({
  formData,
  updateFormData,
  onNext,
  onBack
}) => {
  // Structure d'une expérience "Other Impactful" par défaut
  const emptyExperience = {
    id: `other_${Date.now()}`,
    title: '',
    explanation: '',
    order: 1
  };

  // Initialiser les données depuis formData
  const initialHasOtherExperiences = formData?.hasOtherImpactfulExperiences !== undefined 
    ? formData.hasOtherImpactfulExperiences 
    : null;
  
  const initialOtherExperiences = formData?.otherImpactfulExperiences?.length 
    ? formData.otherImpactfulExperiences 
    : [{ ...emptyExperience }];

  const [hasOtherExperiences, setHasOtherExperiences] = useState(initialHasOtherExperiences);
  const [otherExperiences, setOtherExperiences] = useState(initialOtherExperiences);
  const [expandedExperience, setExpandedExperience] = useState(initialOtherExperiences[0]?.id || '');
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const lastUpdateRef = useRef({ hasOtherExperiences: initialHasOtherExperiences, otherExperiences: initialOtherExperiences });

  // Constantes
  const MAX_EXPERIENCES = 10;

  // Mettre à jour les données parentes avec debounce
  useEffect(() => {
    if (
      hasOtherExperiences !== lastUpdateRef.current.hasOtherExperiences ||
      JSON.stringify(otherExperiences) !== JSON.stringify(lastUpdateRef.current.otherExperiences)
    ) {
      const timer = setTimeout(() => {
        updateFormData({ 
          hasOtherImpactfulExperiences: hasOtherExperiences,
          otherImpactfulExperiences: hasOtherExperiences ? otherExperiences : []
        });
        lastUpdateRef.current = { hasOtherExperiences, otherExperiences };
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [hasOtherExperiences, otherExperiences, updateFormData]);

  // Gestion de l'état de saisie
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [hasOtherExperiences, otherExperiences]);

  // Gérer la réponse Yes/No
  const handleYesNoResponse = (response) => {
    setHasOtherExperiences(response);
    
    if (response && otherExperiences.length === 0) {
      // Si l'utilisateur dit "Yes" et qu'il n'y a pas d'expériences, en ajouter une
      const newExperience = { ...emptyExperience };
      setOtherExperiences([newExperience]);
      setExpandedExperience(newExperience.id);
    }
  };

  // Ajouter une nouvelle expérience
  const addExperience = () => {
    if (otherExperiences.length >= MAX_EXPERIENCES) return;
    
    const newId = `other_${Date.now()}`;
    const newOrder = otherExperiences.length + 1;
    
    const newExperience = {
      ...emptyExperience,
      id: newId,
      order: newOrder
    };
    
    setOtherExperiences([...otherExperiences, newExperience]);
    setExpandedExperience(newId);
  };

  // Supprimer une expérience
  const removeExperience = (id) => {
    if (otherExperiences.length <= 1) {
      // Si c'est la dernière expérience, on remet hasOtherExperiences à null pour revenir à la question
      setHasOtherExperiences(null);
      setOtherExperiences([{ ...emptyExperience }]);
      setExpandedExperience('');
      return;
    }
    
    const updatedExperiences = otherExperiences
      .filter(exp => exp.id !== id)
      .map((exp, index) => ({ ...exp, order: index + 1 }));
    
    setOtherExperiences(updatedExperiences);
    
    // Si l'expérience supprimée était celle étendue, étendre la première
    if (expandedExperience === id && updatedExperiences.length > 0) {
      setExpandedExperience(updatedExperiences[0].id);
    }
  };

  // Mettre à jour une expérience
  const updateExperience = (id, field, value) => {
    const updatedExperiences = otherExperiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    
    setOtherExperiences(updatedExperiences);
  };

  // Vérifier si les données sont valides pour continuer
  const isValidToSubmit = () => {
    if (hasOtherExperiences === null) return false;
    if (hasOtherExperiences === false) return true;
    
    // Si l'utilisateur a dit "Yes", au moins une expérience doit avoir un titre et une explication
    return otherExperiences.some(exp => 
      exp.title.trim() !== '' && exp.explanation.trim() !== ''
    );
  };

  return (
    <div className="other-impactful">
      <div className="other-impactful-container">
        {/* Header */}
        <div className="other-impactful-header">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Other Impactful{" "}
                <span className="header-title-highlight">Experiences</span>
              </div>
              <p className="header-subtitle">
                Beyond your main experiences, are there other significant moments that shaped your journey to medicine?
              </p>
            </div>
            
            <button 
              className="help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Toggle help information"
            >
              <Info className="help-toggle-icon" />
              <span>Examples</span>
            </button>
          </div>
          
          {/* Panel d'aide */}
          {showHelp && (
            <div className="help-panel">
              <div className="help-content">
                <h3 className="help-title">What to Include</h3>
                <div className="help-tips">
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Personal challenges or adversities overcome</span>
                  </div>
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Unique cultural or family experiences</span>
                  </div>
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Moments of significant personal growth</span>
                  </div>
                  <div className="tip">
                    <Heart className="tip-icon" />
                    <span>Experiences that changed your perspective</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Corps principal */}
        <div className="other-impactful-body">
          {/* Question initiale Yes/No */}
          {hasOtherExperiences === null && (
            <div className="initial-question">
              <div className="question-card">
                <div className="question-icon">
                  <Sparkles size={32} />
                </div>
                <h3 className="question-title">Do you have other impactful experiences?</h3>
                <p className="question-description">
                  Think about experiences outside your main activities that significantly influenced your path to medicine.
                </p>
                <div className="question-actions">
                  <button
                    type="button"
                    className="choice-btn choice-btn-no"
                    onClick={() => handleYesNoResponse(false)}
                  >
                    No, I don't have any
                  </button>
                  <button
                    type="button"
                    className="choice-btn choice-btn-yes"
                    onClick={() => handleYesNoResponse(true)}
                  >
                    Yes, I have some to share
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation "No" */}
          {hasOtherExperiences === false && (
            <div className="no-experiences-confirmation">
              <div className="confirmation-card">
                <div className="confirmation-icon">
                  <Check size={32} />
                </div>
                <h3 className="confirmation-title">That's perfectly fine!</h3>
                <p className="confirmation-description">
                  Your main experiences already provide a comprehensive view of your journey. 
                  You can always add more experiences later if you remember something important.
                </p>
                <button
                  type="button"
                  className="change-mind-btn"
                  onClick={() => setHasOtherExperiences(null)}
                >
                  Actually, I do have some experiences to add
                </button>
              </div>
            </div>
          )}

          {/* Formulaire des expériences */}
          {hasOtherExperiences === true && (
            <div className="experiences-form">
       

              {/* Liste des expériences */}
              <div className="experiences-list">
                {otherExperiences.map((experience) => (
                  <div 
                    key={experience.id}
                    className={`experience-card ${expandedExperience === experience.id ? 'expanded' : 'collapsed'}`}
                  >
                    <div 
                      className="experience-header"
                      onClick={() => setExpandedExperience(
                        expandedExperience === experience.id ? null : experience.id
                      )}
                    >
                      <div className="experience-header-left">
                        <div className="experience-order">
                          <span>{experience.order}</span>
                        </div>
                        <div className="experience-title-container">
                         
                          {experience.title && (
                            <div className="experience-preview-snippet">
                              {experience.title.substring(0, 100)}
                              {experience.title.length > 100 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="experience-header-right">
                        <button 
                          className={`experience-expand-btn ${expandedExperience === experience.id ? 'expanded' : ''}`}
                          aria-label={expandedExperience === experience.id ? "Collapse experience" : "Expand experience"}
                        >
                          {expandedExperience === experience.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedExperience === experience.id && (
                      <div className="experience-content">
                        <div className="experience-form">
                          {/* Titre de l'expérience */}
                          <div className="form-group">
                            <label htmlFor={`title-${experience.id}`}>
                              <span>Other Impactful Experiences?</span>
                            </label>
                            <input
                              type="text"
                              id={`title-${experience.id}`}
                              value={experience.title}
                              onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                              placeholder="Financial hardship, family illness, cultural challenges..."
                              className="form-input"
                            />
                          </div>
                          
                          {/* Explication */}
                          <div className="form-group">
                            <label htmlFor={`explanation-${experience.id}`}>
                              <span>Explanation</span>
                            </label>
                            <textarea
                              id={`explanation-${experience.id}`}
                              value={experience.explanation}
                              onChange={(e) => updateExperience(experience.id, 'explanation', e.target.value)}
                              placeholder="Describe this experience and explain how it shaped you, what you learned, and how it influenced your path to medicine..."
                              className="form-textarea"
                              rows={6}
                            />
                          </div>
                          
                          {/* Actions de l'expérience */}
                          <div className="experience-actions">
                          
                            
                            <div className="experience-action-right">
                              <button 
                                type="button" 
                                className="delete-button"
                                onClick={() => removeExperience(experience.id)}
                                aria-label="Delete experience"
                              >
                                <Trash2 size={16} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bouton ajouter une expérience */}
              {otherExperiences.length < MAX_EXPERIENCES && (
                <button 
                  type="button"
                  className="add-experience-button"
                  onClick={addExperience}
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

              {/* Bouton pour changer d'avis */}
              <div className="change-mind-section">
                <button
                  type="button"
                  className="change-mind-btn-small"
                  onClick={() => setHasOtherExperiences(null)}
                >
                  Actually, I don't have any other experiences to add
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="other-impactful-navigation">
          <button
            type="button"
            className="nav-btn nav-btn-secondary"
            onClick={onBack}
            aria-label="Return to Experiences"
          >
            Back to Experiences
          </button>

          <div className="nav-progress">
            <span className="progress-text">Step 3 of 4</span>
            {isTyping && (
              <div className="typing-indicator">
                <span>Saving...</span>
                <div className="typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`nav-btn nav-btn-primary ${!isValidToSubmit() ? 'disabled' : ''}`}
            onClick={onNext}
            disabled={!isValidToSubmit()}
            aria-label="Continue to School List"
          >
            Continue to School List
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherImpactful; 