import React from 'react';
import { CheckCircle } from 'lucide-react';
import './shared.css';

const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  completedSteps = [], 
  onStepClick 
}) => {
  const stepTitles = [
    "Personal Comments",
    "Experiences", 
    "Other Impactful",
    "School List"
  ];

  const isStepCompleted = (step) => completedSteps.includes(step);
  const isStepCurrent = (step) => step === currentStep;
  const isStepAccessible = (step) => step <= currentStep || isStepCompleted(step);

  const handleStepClick = (step) => {
    if (isStepAccessible(step) && onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className="progress-indicator" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax={totalSteps}>
      <div className="progress-steps">
        {stepTitles.map((title, index) => {
          const step = index + 1;
          const isCompleted = isStepCompleted(step);
          const isCurrent = isStepCurrent(step);
          const isAccessible = isStepAccessible(step);

          return (
            <div key={step} className="progress-step-container">
              <div
                className={`progress-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isAccessible ? 'accessible' : ''}`}
                onClick={() => handleStepClick(step)}
                onKeyDown={(e) => e.key === 'Enter' && handleStepClick(step)}
                role="button"
                tabIndex={isAccessible ? 0 : -1}
                aria-label={`Étape ${step}: ${stepTitles[index]} ${isCompleted ? '(terminée)' : isCurrent ? '(actuelle)' : ''}`}
              >
                <div className="progress-step-indicator">
                  {isCompleted ? (
                    <CheckCircle className="progress-step-icon completed-icon" size={20} />
                  ) : (
                    <span className="progress-step-number">{step}</span>
                  )}
                </div>
                
                <div className="progress-step-content">
                  <div className="progress-step-title">{stepTitles[index]}</div>
                  <div className="progress-step-status">
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </div>
                </div>
              </div>

              {/* Connecteur entre les étapes */}
              {step < totalSteps && (
                <div className={`progress-connector ${isCompleted ? 'completed' : ''}`} aria-hidden="true">
                  <div className="progress-connector-line"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barre de progression globale */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          aria-hidden="true"
        ></div>
      </div>

      {/* Résumé textuel pour l'accessibilité */}
      <div className="progress-summary" aria-live="polite">
        Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
      </div>
    </div>
  );
};

export default ProgressIndicator; 