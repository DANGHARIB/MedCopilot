import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Info, Lightbulb } from 'lucide-react';
import './RulesTestComponent.css';

const RulesTestComponent = ({ formData, updateFormData, onNext, onBack }) => {
  // 1. États locaux avec useState
  const [isTyping, setIsTyping] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, message: '' });
  
  // 2. Refs pour DOM
  const textareaRef = useRef(null);
  
  // 3. useEffect pour calculs/side effects
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);
  
  // 4. Fonctions de validation/logique
  const validateInput = (value) => {
    if (value.length < 10) {
      setValidation({ isValid: false, message: 'Minimum 10 caractères requis' });
    } else {
      setValidation({ isValid: true, message: 'Parfait !' });
    }
  };
  
  // 5. Handlers d'événements
  const handleInputChange = (e) => {
    const value = e.target.value;
    setIsTyping(true);
    updateFormData({ ...formData, testContent: value });
    validateInput(value);
  };
  
  const handleSubmit = () => {
    if (validation.isValid) {
      onNext();
    }
  };
  
  // 6. JSX avec structure claire selon RÈGLES .cursorrules
  return (
    <div className="rules-test-component">
      {/* Header avec structure logique - Pattern 1 : Header Composite Modulaire */}
      <div className="component-header">
        <div className="title-row">
          <h2 className="header-title">Test des Règles Cursor</h2>
          <button className="action-primary" onClick={handleSubmit}>
            <Lightbulb size={16} />
            Valider
          </button>
        </div>
        <p className="header-subtitle">
          Ce composant applique strictement les règles définies dans .cursorrules
        </p>
      </div>
      
      {/* Contenu principal avec séparation des préoccupations */}
      <div className="component-content">
        {/* Section info avec micro-interactions Apple */}
        <div className="info-card">
          <div className="card-header">
            <div className="title-section">
              <Info size={20} />
              <h3>Règles Appliquées</h3>
            </div>
          </div>
          <div className="card-content">
            <ul className="rules-list">
              <li>✅ Architecture JSX logique</li>
              <li>✅ Design Apple minimaliste</li>
              <li>✅ CSS Grid + Flexbox moderne</li>
              <li>✅ Variables CSS + Surfaces translucides</li>
              <li>✅ Micro-interactions délicates</li>
            </ul>
          </div>
        </div>
        
        {/* Input avec validation temps réel */}
        <div className="input-section">
          <label htmlFor="test-input" className="input-label">
            Contenu de test
          </label>
          <textarea
            ref={textareaRef}
            id="test-input"
            className={`input-field ${validation.isValid ? 'valid' : 'invalid'} ${isTyping ? 'typing' : ''}`}
            value={formData?.testContent || ''}
            onChange={handleInputChange}
            placeholder="Tapez votre contenu ici..."
            rows={4}
          />
          {/* Feedback visuel dynamique */}
          <div className={`validation-feedback ${validation.isValid ? 'success' : 'error'}`}>
            <CheckCircle size={16} />
            <span>{validation.message}</span>
          </div>
        </div>
      </div>
      
      {/* Navigation avec pattern standard */}
      <div className="component-navigation">
        <button 
          className="nav-button secondary" 
          onClick={onBack}
          disabled={!onBack}
        >
          Précédent
        </button>
        <button 
          className={`nav-button primary ${!validation.isValid ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!validation.isValid}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default RulesTestComponent; 