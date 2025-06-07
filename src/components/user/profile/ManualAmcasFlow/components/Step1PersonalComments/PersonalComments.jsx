import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, CheckCircle2, AlertCircle, FileText, Sparkles, TrendingUp, Type, BarChart3 } from 'lucide-react';
import './PersonalComments.css';

const PersonalComments = ({
  formData,
  updateFormData,
  onNext,
  onBack
}) => {
  const initialText = formData?.personalComments?.text || "";
  const [personalStatement, setPersonalStatement] = useState(initialText);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef(null);
  const lastUpdateRef = useRef({ text: initialText });

  // Contraintes AMCAS réelles
  const MAX_CHARACTERS = 5300; // Limite AMCAS
  const MIN_WORDS = 250; // Minimum recommandé
  const MAX_WORDS = 1200; // Maximum recommandé

  // Calculs en temps réel
  useEffect(() => {
    const words = personalStatement.trim() === '' ? 0 : personalStatement.trim().split(/\s+/).length;
    const chars = personalStatement.length;
    
    setWordCount(words);
    setCharCount(chars);
    
    // Mettre à jour les données parent avec debounce pour éviter les rendus excessifs
    const timer = setTimeout(() => {
      // Vérifier si le texte a réellement changé depuis la dernière mise à jour
      if (personalStatement !== lastUpdateRef.current.text) {
        updateFormData({
          personalComments: {
            text: personalStatement,
            wordCount: words,
            charCount: chars,
            lastModified: new Date().toISOString()
          }
        });
        lastUpdateRef.current.text = personalStatement;
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [personalStatement, updateFormData]); // Inclure updateFormData mais avec debounce pour éviter boucle

  // Gestion de la saisie avec debounce
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [personalStatement]);

  // Auto-resize du textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(200, textarea.scrollHeight)}px`;
    }
  }, [personalStatement]);

  // Validation des données
  const isValidContent = () => {
    return personalStatement.trim().length > 0 && 
           wordCount >= MIN_WORDS && 
           charCount <= MAX_CHARACTERS;
  };

  // Calcul du niveau de complétion
  const getCompletionLevel = () => {
    if (wordCount < MIN_WORDS) return 'insufficient';
    if (wordCount <= MAX_WORDS && charCount <= MAX_CHARACTERS) return 'optimal';
    if (charCount <= MAX_CHARACTERS) return 'acceptable';
    return 'exceeded';
  };

  const completionLevel = getCompletionLevel();

  // Calcul du pourcentage de complétion
  const completionPercentage = Math.min(100, (wordCount / MAX_WORDS) * 100);
  
  // Obtention des suggestions contextuelles
  const getSuggestions = () => {
    const wordsNeeded = MIN_WORDS - wordCount;
    const charsOver = charCount - MAX_CHARACTERS;
    
    switch (completionLevel) {
      case 'insufficient':
        return {
          type: 'info',
          message: `Add ${wordsNeeded} more words to continue`,
          icon: <FileText className="suggestion-icon" />
        };
      case 'optimal':
        return {
          type: 'success',
          message: 'Perfect length!',
          icon: <CheckCircle2 className="suggestion-icon" />
        };
      case 'acceptable':
        return {
          type: 'warning',
          message: 'Consider shortening for impact',
          icon: <AlertCircle className="suggestion-icon" />
        };
      case 'exceeded':
        return {
          type: 'error',
          message: `${charsOver} characters over limit`,
          icon: <AlertCircle className="suggestion-icon" />
        };
      default:
        return null;
    }
  };

  const suggestion = getSuggestions();

  return (
    <div className="personal-comments">
      {/* Container unifié - Single Card */}
      <div className="personal-comments-container">
        {/* Header restructuré - CSS Grid Architecture */}
        <div className="personal-comments-header">
          {/* Ligne principale : Contenu textuel + Action */}
          <div className="header-main-row">
            {/* Groupe textuel : Titre + Sous-titre */}
            <div className="header-text-group">
              <div className="header-title">
                Personal{" "}
                <span className="header-title-highlight">Comments</span>
              </div>
              <p className="header-subtitle">
                Share your personal statement from your AMCAS application. <br/> 
                This narrative helps us understand your motivations and journey.
              </p>
            </div>
            
            {/* Action isolée */}
            <button 
              className="help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Toggle help information"
            >
              <Sparkles className="help-toggle-icon" />
              <span>Writing Tips</span>
            </button>
          </div>

          {/* Panel d'aide contextuelle intégré dans le header */}
          {showHelp && (
            <div className="help-panel">
              <div className="help-content">
                <h3 className="help-title">Writing Guidelines</h3>
                <div className="help-tips">
                  <div className="tip">
                    <CheckCircle2 className="tip-icon" />
                    <span>Be authentic and personal</span>
                  </div>
                  <div className="tip">
                    <CheckCircle2 className="tip-icon" />
                    <span>Show, don't tell your experiences</span>
                  </div>
                  <div className="tip">
                    <CheckCircle2 className="tip-icon" />
                    <span>Connect experiences to medicine</span>
                  </div>
                  <div className="tip">
                    <CheckCircle2 className="tip-icon" />
                    <span>Demonstrate growth and reflection</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zone de saisie intégrée */}
        <div className="writing-area">
          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              value={personalStatement}
              onChange={(e) => setPersonalStatement(e.target.value)}
              placeholder="Begin writing your personal statement here. Describe your journey, motivations, and what drives your passion for medicine..."
              className={`personal-statement-textarea ${completionLevel}`}
              maxLength={MAX_CHARACTERS}
              aria-label="Personal statement text"
            />
            
            {/* Overlay visible par défaut quand vide */}
            {personalStatement === '' && (
              <div className="textarea-overlay">
                <div className="overlay-content">
                  <FileText className="overlay-icon" />
                  <p>Start with your most meaningful experience that led you to medicine</p>
                </div>
              </div>
            )}
          </div>

          {/* === STATISTIQUES INTÉGRÉES - 3 CARTES PRINCIPALES === */}
          <div className="writing-stats">
            <div className="stats-unified-grid">
              
              {/* Progress Card */}
              <div className="stat-card progress-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Writing Progress</span>
                </div>
                <div className="stat-card-content">
                  <div className="stat-progress-row">
                    <span className="stat-progress-label">Overall</span>
                    <span className="stat-progress-value">{Math.round(completionPercentage)}%</span>
                  </div>
                  <div className="progress-bar-container-full">
                    <div 
                      className={`progress-bar-fill ${completionLevel}`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <div className="stat-advice">
                    {suggestion && (
                      <div className={`stat-advice-content ${suggestion.type}`}>
                        <div className="stat-advice-icon">
                          {suggestion.icon}
                        </div>
                        <span className="stat-advice-text">{suggestion.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Word Count Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Words</span>
                </div>
                <div className="stat-card-content">
                  <div className="stat-main-row">
                    <div className="stat-main-value">{wordCount.toLocaleString()}</div>
                    <div className="stat-main-range">Range: {MIN_WORDS} - {MAX_WORDS.toLocaleString()}</div>
                  </div>
                  <div className="progress-bar-container-full">
                    <div 
                      className={`progress-bar-fill ${
                        wordCount < MIN_WORDS ? "insufficient" : 
                        wordCount <= MAX_WORDS ? "optimal" : "acceptable"
                      }`}
                      style={{ width: `${Math.min((wordCount / MAX_WORDS) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Character Count Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Characters</span>
                </div>
                <div className="stat-card-content">
                  <div className="stat-main-row">
                    <div className={`stat-main-value ${charCount > MAX_CHARACTERS ? "exceeded" : ""}`}>
                      {charCount.toLocaleString()}
                    </div>
                    <div className="stat-main-range">Max: {MAX_CHARACTERS.toLocaleString()}</div>
                  </div>
                  <div className="progress-bar-container-full">
                    <div 
                      className={`progress-bar-fill ${
                        charCount > MAX_CHARACTERS ? "exceeded" : 
                        charCount > MAX_CHARACTERS * 0.9 ? "acceptable" : "optimal"
                      }`}
                      style={{ width: `${Math.min((charCount / MAX_CHARACTERS) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Navigation intégrée */}
        <div className="personal-comments-navigation">
          <button
            type="button"
            className="nav-btn nav-btn-secondary"
            onClick={onBack}
            aria-label="Return to method selection"
          >
            Back to Method Selection
          </button>

          <div className="nav-progress">
            <span className="progress-text">Step 1 of 4</span>
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
            className={`nav-btn nav-btn-primary ${!isValidContent() ? 'disabled' : ''}`}
            onClick={onNext}
            disabled={!isValidContent()}
            aria-label="Continue to next step"
          >
            Continue to Experiences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalComments;