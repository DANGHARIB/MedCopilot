import React, { useState, useEffect, useRef } from 'react';
import { FileText, Edit2, Check, ArrowRight, Clock, Shield, Zap, ClipboardCheck, Lock, Info, Sparkles } from 'lucide-react';
import './ProfileStep2.css';

const ProfileStep2 = ({ formData, updateFormData, onNext }) => {
  const [localFormData, setLocalFormData] = useState({
    importMethod: formData.importMethod || ''
  });
  const [showHelp, setShowHelp] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const lastUpdateRef = useRef({ importMethod: '' });

  // Mettre à jour les données parentes avec debounce
  useEffect(() => {
    if (localFormData.importMethod !== lastUpdateRef.current.importMethod) {
      const timer = setTimeout(() => {
        const dataToPass = { ...formData, ...localFormData };
        updateFormData(dataToPass);
        lastUpdateRef.current.importMethod = localFormData.importMethod;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [localFormData, formData, updateFormData]);

  // Gestion de l'état de saisie
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [localFormData.importMethod]);

  // Gérer la sélection de la méthode d'importation
  const handleMethodSelect = (method) => {
    setLocalFormData(prev => ({ ...prev, importMethod: method }));
  };
  
  // Passer à l'étape suivante
  const handleNext = () => {
    const dataToPass = { ...formData, ...localFormData };
    updateFormData(dataToPass);
    onNext(dataToPass);
  };

  // Vérifier si les données sont valides pour continuer
  const isValidToSubmit = () => {
    return localFormData.importMethod !== '';
  };

  return (
    <div className="profile-step2">
      <div className="profile-step2-container">
        {/* Header */}
        <div className="profile-step2-header">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Application Import{" "}
                <span className="header-title-highlight">Method</span>
              </div>
              <p className="header-subtitle">
                Choose how you'd like to import your application information. <br/>
                Importing from AMCAS is recommended for accuracy and speed.
              </p>
            </div>
            
            <button 
              className="help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Toggle help information"
            >
              <Sparkles className="help-toggle-icon" />
              <span>Import Tips</span>
            </button>
          </div>

          {/* Panel d'aide */}
          {showHelp && (
            <div className="help-panel">
              <div className="help-content">
                <h3 className="help-title">Import Guidelines</h3>
                <div className="help-tips">
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>AMCAS import provides the most accurate data</span>
                  </div>
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>Manual entry gives you full control</span>
                  </div>
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>You can edit imported data later</span>
                  </div>
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>Both methods lead to personalized essays</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Corps principal */}
        <div className="profile-step2-body">
          <div className="import-methods-grid">
            {/* AMCAS Import Card */}
            <div 
              className={`import-method-card ${localFormData.importMethod === 'amcas' ? 'selected' : ''}`}
              onClick={() => handleMethodSelect('amcas')}
              role="button"
              tabIndex={0}
              aria-pressed={localFormData.importMethod === 'amcas'}
              onKeyDown={(e) => e.key === 'Enter' && handleMethodSelect('amcas')}
            >
              {localFormData.importMethod === 'amcas' && (
                <div className="method-selected-badge" aria-hidden="true">
                  <Check size={16} />
                </div>
              )}
              
              <div className="method-icon amcas-icon">
                <FileText size={32} />
              </div>
              
              <div className="method-content">
                <h3 className="method-title">Import AMCAS Application</h3>
                <p className="method-description">
                  Upload your AMCAS PDF to automatically extract your personal statement, 
                  experiences, and activities.
                </p>
                
                <div className="method-highlight">
                  <p>
                    <strong>Recommended:</strong> Saves time and provides the most accurate personalization 
                    for your secondary essays.
                  </p>
                </div>
                
                <div className="method-tags">
                  <span className="method-tag">
                    <Clock size={12} />
                    Time-saving
                  </span>
                  <span className="method-tag">
                    <Shield size={12} />
                    Auto-extraction
                  </span>
                  <span className="method-tag">
                    <Zap size={12} />
                    Better personalization
                  </span>
                </div>
              </div>
            </div>
            
            {/* Manual Entry Card */}
            <div 
              className={`import-method-card ${localFormData.importMethod === 'manual' ? 'selected' : ''}`}
              onClick={() => handleMethodSelect('manual')}
              role="button"
              tabIndex={0}
              aria-pressed={localFormData.importMethod === 'manual'}
              onKeyDown={(e) => e.key === 'Enter' && handleMethodSelect('manual')}
            >
              {localFormData.importMethod === 'manual' && (
                <div className="method-selected-badge" aria-hidden="true">
                  <Check size={16} />
                </div>
              )}
              
              <div className="method-icon manual-icon">
                <Edit2 size={32} />
              </div>
              
              <div className="method-content">
                <h3 className="method-title">Manual Entry</h3>
                <p className="method-description">
                  Enter your personal statement, most meaningful experiences, and academic information
                  manually.
                </p>
                
                <div className="method-highlight">
                  <p>
                    <strong>Flexible approach:</strong> Perfect if you prefer to enter only specific information
                    or don't have your AMCAS PDF available.
                  </p>
                </div>
                
                <div className="method-tags">
                  <span className="method-tag">
                    <ClipboardCheck size={12} />
                    More control
                  </span>
                  <span className="method-tag">
                    <Lock size={12} />
                    No PDF required
                  </span>
                  <span className="method-tag">
                    <Edit2 size={12} />
                    Selective information
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="profile-step2-navigation">
          <div className="nav-progress">
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
            onClick={handleNext}
            disabled={!isValidToSubmit()}
            aria-label="Proceed to next step"
          >
            Continue
            <ArrowRight size={18} className="nav-btn-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileStep2;