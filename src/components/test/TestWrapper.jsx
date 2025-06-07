import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import RulesTestComponent from './RulesTestComponent';
import './TestWrapper.css';

const TestWrapper = () => {
  const [formData, setFormData] = useState({ testContent: '' });

  const handleUpdateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
    console.log('Form data updated:', newData);
  };

  const handleNext = () => {
    console.log('Next clicked - Form data:', formData);
    alert('Validation réussie ! Les règles .cursorrules sont bien appliquées ✅');
  };

  const handleBack = () => {
    console.log('Back clicked');
    window.history.back();
  };

  return (
    <div className="test-wrapper">
      {/* Navigation header */}
      <div className="test-wrapper-nav">
        <Link to="/" className="nav-link">
          <ArrowLeft size={20} />
          <Home size={20} />
          <span>Retour à l'accueil</span>
        </Link>
        <div className="nav-title">
          <h1>Test des Règles Cursor</h1>
          <p>Démonstration des standards .cursorrules</p>
        </div>
      </div>

      {/* Composant de test */}
      <RulesTestComponent
        formData={formData}
        updateFormData={handleUpdateFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default TestWrapper; 