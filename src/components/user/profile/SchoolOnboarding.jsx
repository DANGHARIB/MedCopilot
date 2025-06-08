import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  School, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import './SchoolOnboarding.css';

/**
 * SchoolOnboarding - Component for configuring required essays for a specific school
 * This component is displayed immediately after a user has saved a school
 * from ViewAllMedicalSchool.
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.school - School data for which to configure essays
 * @param {boolean} props.isOpen - Indicates if the modal/component is visible
 * @param {Function} props.onClose - Function to call to close the modal
 * @param {Function} props.onComplete - Function to call when configuration is complete
 */
const SchoolOnboarding = ({ school, isOpen, onClose, onComplete }) => {
  // References for scroll and animation
  const modalRef = useRef(null);
  
  // Configuration states
  const [currentStep, setCurrentStep] = useState(0);
  const [essayCount, setEssayCount] = useState(1);
  const [customEssayCount, setCustomEssayCount] = useState('');
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [essays, setEssays] = useState([{ id: 1, subject: '', wordLimit: 500, limitType: 'words', context: '', category: 'other', style: 'narrative' }]);
  const [currentEssayIndex, setCurrentEssayIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Invitation and deadline states
  const [hasInvitation, setHasInvitation] = useState(null);
  const [deadline, setDeadline] = useState('');

  const navigate = useNavigate();

  // Essay count options (5-9)
  const essayCountOptions = [5, 6, 7, 8, 9];

  // Effect to center modal and block scroll
  useEffect(() => {
    if (isOpen && modalRef.current) {
      document.body.style.overflow = 'hidden';
      
      // Center the modal
      const modalElement = modalRef.current;
      const modalRect = modalElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
      const finalScrollTop = Math.max(0, desiredScrollTop);
      
      window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, currentStep]);

  // Update essays array when essay count changes
  useEffect(() => {
    const actualCount = isCustomCount ? parseInt(customEssayCount) || 0 : essayCount;
    
    if (actualCount > essays.length) {
      // Add new essays
      const newEssays = [...essays];
      for (let i = essays.length + 1; i <= actualCount; i++) {
        newEssays.push({
          id: i,
          subject: '',
          wordLimit: 500,
          limitType: 'words',
          context: '',
          category: 'other',
          style: 'narrative'
        });
      }
      setEssays(newEssays);
    } else if (actualCount < essays.length && actualCount > 0) {
      // Remove excess essays
      setEssays(essays.slice(0, actualCount));
    }
  }, [essayCount, customEssayCount, isCustomCount]);

  // Handle navigation between steps
  const goToNextStep = () => {
    if (currentStep === 0) {
      // Move from invitation step to essay count
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Move to essay configuration
      setCurrentStep(2);
      setCurrentEssayIndex(0);
    } else if (currentStep === 2) {
      // If we haven't finished all essays, go to next one
      if (currentEssayIndex < essays.length - 1) {
        setCurrentEssayIndex(currentEssayIndex + 1);
      } else {
        // Otherwise, complete the process
        handleComplete();
      }
    }
  };

  const goToPrevStep = () => {
    if (currentStep === 2) {
      if (currentEssayIndex > 0) {
        // Return to previous essay
        setCurrentEssayIndex(currentEssayIndex - 1);
      } else {
        // Return to essay count selection
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      // Return to invitation step
      setCurrentStep(0);
    }
  };

  // Update current essay data
  const updateCurrentEssay = (changes) => {
    const updatedEssays = [...essays];
    updatedEssays[currentEssayIndex] = {
      ...updatedEssays[currentEssayIndex],
      ...changes
    };
    setEssays(updatedEssays);
  };

  // Handle custom essay count selection
  const handleCustomCountToggle = () => {
    setIsCustomCount(true);
    setCustomEssayCount('6');
  };

  const handleCountOptionSelect = (count) => {
    setIsCustomCount(false);
    setEssayCount(count);
    setCustomEssayCount('');
  };

  const handleCustomCountChange = (value) => {
    // Permettre une chaîne vide pour pouvoir effacer complètement
    if (value === '') {
      setCustomEssayCount('');
      return;
    }
    
    // Vérifier si la valeur est un nombre valide
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      // Stocker la valeur exacte saisie, pas la version parsée
      setCustomEssayCount(value);
    }
  };

  // Handle process completion
  const handleComplete = () => {
    setIsCompleting(true);
    
    // Simulate database save
    setTimeout(() => {
      // Save configurations to localStorage (to be replaced with API call)
      try {
        const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
        schoolEssays[school.id] = essays;
        localStorage.setItem('schoolEssays', JSON.stringify(schoolEssays));
        
        // Save deadline information
        const schoolDeadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
        schoolDeadlines[school.id] = formatDeadlineForStorage();
        localStorage.setItem('schoolDeadlines', JSON.stringify(schoolDeadlines));
      } catch (e) {
        console.error("Failed to save essay configurations", e);
      }
      
      // Call parent's onComplete function
      if (onComplete) {
        onComplete(essays);
      }
      
      // Redirect to MySchoolTab
      navigate('/schools');
      
      // Reset state
      setIsCompleting(false);
      if (onClose) onClose();
    }, 1000);
  };

  // Check if next button should be disabled
  const isNextButtonDisabled = () => {
    if (currentStep === 0) {
      return hasInvitation === null; // Disabled if no invitation status selected
    } else if (currentStep === 1) {
      const actualCount = isCustomCount ? parseInt(customEssayCount) || 0 : essayCount;
      return actualCount < 1; // Disabled if no valid count
    } else if (currentStep === 2) {
      const currentEssay = essays[currentEssayIndex];
      return !currentEssay.subject.trim(); // Disabled if subject is empty
    }
    return false;
  };

  // Handle deadline date change
  const handleDeadlineChange = (value) => {
    setDeadline(value);
  };

  // Format deadline for storage
  const formatDeadlineForStorage = () => {
    if (hasInvitation === false) {
      return "not defined";
    }
    
    if (hasInvitation === true && deadline) {
      return deadline; // Already in YYYY-MM-DD format from date input
    }
    
    return "not defined";
  };

  // Conditional rendering of content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderInvitationStep();
      case 1:
        return renderEssayCountStep();
      case 2:
        return renderEssayConfigStep();
      default:
        return null;
    }
  };

  // Step 0: Invitation status and deadline
  const renderInvitationStep = () => (
    <div className="school-onboarding-step">
      <div className="school-onboarding-school-info">
        <School size={24} />
        <h2>{school.name}</h2>
        <p className="school-onboarding-location">{school.location}</p>
      </div>

      <div className="school-onboarding-invitation-section">
        <h3>Did you receive your invitation?</h3>
        <p className="school-onboarding-description">
          Let us know if you've been invited to interview so we can help you set the right timeline for your application.
        </p>

        <div className="school-onboarding-invitation-options">
          <button
            className={`school-onboarding-invitation-option ${hasInvitation === true ? 'active' : ''}`}
            onClick={() => setHasInvitation(true)}
          >
            <span className="school-onboarding-option-text">Yes</span>
            <span className="school-onboarding-option-subtitle">I received an invitation</span>
          </button>

          {hasInvitation === true && (
          <div className="school-onboarding-deadline-section">
            <h4>Select your deadline</h4>
            <p className="school-onboarding-deadline-description">
              When do you need to submit your application?
            </p>
            
            <div className="school-onboarding-date-picker-container">
              <input
                id="deadline-date"
                type="date"
                className="school-onboarding-date-input"
                value={deadline}
                onChange={(e) => handleDeadlineChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Minimum today
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]} // Maximum 2 years from now
                onClick={(e) => e.target.showPicker()}
              />
            </div>
          </div>
        )}
          
          <button
            className={`school-onboarding-invitation-option ${hasInvitation === false ? 'active' : ''}`}
            onClick={() => setHasInvitation(false)}
          >
            <span className="school-onboarding-option-text">No</span>
            <span className="school-onboarding-option-subtitle">Not yet invited</span>
          </button>
        </div>

        
      </div>
    </div>
  );

  // Step 1: Essay count selection
  const renderEssayCountStep = () => (
    <div className="school-onboarding-step">
      <div className="school-onboarding-school-info">
        <School size={24} />
        <h2>{school.name}</h2>
        <p className="school-onboarding-location">{school.location}</p>
      </div>

      <div className="school-onboarding-count-selection">
        <h3>How many essays do you need to write for this school?</h3>
        <p className="school-onboarding-description">
          Select the number of essays required by {school.name} for your application.
          You'll configure each essay individually in the following steps.
        </p>

        <div className="school-onboarding-count-options">
          {essayCountOptions.map(count => (
            <button
              key={count}
              className={`school-onboarding-count-option ${!isCustomCount && essayCount === count ? 'active' : ''}`}
              onClick={() => handleCountOptionSelect(count)}
            >
              <span className="school-onboarding-count-number">{count}</span>
              <span className="school-onboarding-count-label">
                {count === 1 ? 'essay' : 'essays'}
              </span>
            </button>
          ))}
          
          <button
            className={`school-onboarding-count-option custom ${isCustomCount ? 'active' : ''}`}
            onClick={handleCustomCountToggle}
          >
            <span className="school-onboarding-count-number">+</span>
            <span className="school-onboarding-count-label">other</span>
          </button>
        </div>

        {isCustomCount && (
          <div className="school-onboarding-custom-input-section">
            <label htmlFor="custom-essay-count">Enter number of essays (1-20):</label>
            <input
              id="custom-essay-count"
              type="number"
              className="school-onboarding-custom-input"
              value={customEssayCount}
              onChange={(e) => handleCustomCountChange(e.target.value)}
              min="1"
              max="20"
              placeholder="Enter number..."
            />
          </div>
        )}

        <div className="school-onboarding-info-box">
          <AlertCircle size={18} />
          <div>
            <p>The number and topics of essays vary by school. <br/> Check the school's website for accurate information.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Configuration of each essay
  const renderEssayConfigStep = () => {
    const currentEssay = essays[currentEssayIndex];
    
    return (
      <div className="school-onboarding-step">
        <div className="school-onboarding-essay-header">
          <div className="school-onboarding-progress">
            <h3>
              Essay {currentEssayIndex + 1} of {essays.length}
            </h3>
            <div className="school-onboarding-progress-bar">
              <div 
                className="school-onboarding-progress-fill"
                style={{ width: `${((currentEssayIndex + 1) / essays.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <h2>Essay Configuration for {school.name}</h2>
        </div>

        <div className="school-onboarding-essay-form">
          <div className="school-onboarding-form-group">
            <label htmlFor="essay-subject">Essay Prompt</label>
            <textarea
              id="essay-subject"
              className="school-onboarding-textarea"
              placeholder=" Paste the exact prompt from the school's application for best results."
              value={currentEssay.subject}
              onChange={(e) => updateCurrentEssay({ subject: e.target.value })}
              rows={4}
            />
           
          </div>

          <div className="school-onboarding-form-group">
            <label htmlFor="essay-context">Additional Context (optional)</label>
            <textarea
              id="essay-context"
              className="school-onboarding-textarea"
              placeholder="Add extra details to personalize your essay..."
              value={currentEssay.context}
              onChange={(e) => updateCurrentEssay({ context: e.target.value })}
              rows={4}
            />
            <p className="school-onboarding-field-hint">
              E.g.: specific experiences, school values, preferred focus...
            </p>
          </div>

          <div className="school-onboarding-form-row">
            <div className="school-onboarding-form-group">
              <label>Limit Type</label>
              <div className="school-onboarding-toggle">
                <button
                  className={`school-onboarding-toggle-option ${currentEssay.limitType === 'words' ? 'active' : ''}`}
                  onClick={() => updateCurrentEssay({ limitType: 'words' })}
                >
                  Words
                </button>
                <button
                  className={`school-onboarding-toggle-option ${currentEssay.limitType === 'characters' ? 'active' : ''}`}
                  onClick={() => updateCurrentEssay({ limitType: 'characters' })}
                >
                  Characters
                </button>
              </div>
            </div>

            <div className="school-onboarding-form-group">
              <label htmlFor="essay-limit">{currentEssay.limitType === 'words' ? 'Word' : 'Character'} Limit</label>
              <input
                id="essay-limit"
                type="number"
                className="school-onboarding-input"
                value={currentEssay.limitType === 'words' 
                  ? (currentEssay.wordLimit === 0 ? '' : currentEssay.wordLimit) 
                  : (currentEssay.characterLimit === 0 ? '' : (currentEssay.characterLimit || currentEssay.wordLimit * 5))
                }
                onChange={(e) => {
                  // Permettre de vider complètement le champ
                  const inputValue = e.target.value;
                  
                  if (inputValue === '') {
                    // Si le champ est vide, définir la valeur à 0 dans l'état interne
                    if (currentEssay.limitType === 'words') {
                      updateCurrentEssay({ wordLimit: 0 });
                    } else {
                      updateCurrentEssay({ characterLimit: 0 });
                    }
                    return;
                  }
                  
                  // Convertir en nombre uniquement si une valeur est présente
                  const value = parseInt(inputValue) || 0;
                  
                  if (currentEssay.limitType === 'words') {
                    updateCurrentEssay({ wordLimit: value });
                  } else {
                    updateCurrentEssay({ characterLimit: value });
                  }
                }}
                min={currentEssay.limitType === 'words' ? 100 : 500}
                max={currentEssay.limitType === 'words' ? 2000 : 10000}
                // Ajouter un attribut step pour permettre des incréments de 1
                step="1"
                // Désactiver les contrôles natifs du navigateur pour les champs numériques
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>

         

          <div className="school-onboarding-form-group">
            <label htmlFor="essay-category">Essay Category</label>
            <div className="school-onboarding-select-container">
              <select
                id="essay-category"
                className="school-onboarding-select"
                value={currentEssay.category}
                onChange={(e) => updateCurrentEssay({ category: e.target.value })}
              >
                <option value="diversity">Diversity Essay</option>
                <option value="adversity">Adversity Essay</option>
                <option value="challenge">Challenge Essay</option>
                <option value="why-school">"Why Our School?" Essay</option>
                <option value="gap-year">Gap Year Essay</option>
                <option value="leadership">Leadership Essay</option>
                <option value="covid">COVID-19 Essay</option>
                <option value="clinical-experience">Meaningful Clinical Experience Essay</option>
                <option value="teamwork">Teamwork / Collaboration Essay</option>
                <option value="medicine-interest">Area of Medicine Interest Essay</option>
                <option value="anything-else">"Anything Else You'd Like Us to Know?" Essay</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render complete component (modal or fullscreen)
  if (!isOpen) return null;

  return (
    <div className="school-onboarding-overlay" onClick={onClose}>
      <div 
        ref={modalRef} 
        className="school-onboarding-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="school-onboarding-close-button" 
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="school-onboarding-content">
          {renderStepContent()}
        </div>

        <div className="school-onboarding-footer">
          <button
            className="school-onboarding-button secondary"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="school-onboarding-step-indicator">
            {currentStep === 0 ? (
              <span>Step 1 of 3</span>
            ) : currentStep === 1 ? (
              <span>Step 2 of 3</span>
            ) : (
              <span>Essay {currentEssayIndex + 1} of {essays.length}</span>
            )}
          </div>

          <button
            className="school-onboarding-button primary"
            onClick={goToNextStep}
            disabled={isNextButtonDisabled() || isCompleting}
          >
            <span>
              {currentStep === 0 
                ? "Next" 
                : currentStep === 1 
                ? "Configure Essays" 
                : currentEssayIndex < essays.length - 1 
                  ? "Next Essay" 
                  : "Complete"}
            </span>
            {isCompleting ? (
              <span className="school-onboarding-spinner"></span>
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolOnboarding;