import React from 'react';
import './shared.css';

const StepHeader = ({ 
  currentStep, 
  totalSteps, 
  title, 
  subtitle 
}) => {
  return (
    <div className="step-header">
      <div className="step-header-content">
        <div className="step-header-meta">
          <span className="step-header-counter">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        
        <h1 className="step-header-title">
          {title}
        </h1>
        
        {subtitle && (
          <p className="step-header-subtitle">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepHeader; 