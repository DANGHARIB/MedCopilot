import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import './ProfileSetupComplete.css';

const ProfileSetupComplete = ({ onGetStarted }) => {
  const navigate = useNavigate();

  // Fonction pour scroller automatiquement vers le centre de la page
  useEffect(() => {
    const scrollToCenter = () => {
      const container = document.querySelector('.profile-setup-complete-container');
      if (container) {
        window.scrollTo({
          top: container.offsetTop - (window.innerHeight - container.offsetHeight) / 2,
          behavior: 'smooth'
        });
      }
    };
    
    // Exécuter après le chargement complet du composant
    setTimeout(scrollToCenter, 100);
  }, []);

  const handleGoToSchools = () => {
    // Si onGetStarted est fourni, l'appeler d'abord (pour exécuter handleComplete)
    if (onGetStarted) {
      onGetStarted();
    }
    // Naviguer vers ViewAllMedicalSchool en utilisant la route définie dans App.jsx
    navigate('/viewAllSchool');
  };

  return (
    <div className="profile-setup-complete-container">
      <div className="profile-setup-complete-content">
        <div className="profile-setup-complete-header">
          <div className="profile-setup-complete-icon">
            <CheckCircle size={40} />
          </div>
          <h2 className="profile-setup-complete-title" id="completion-title">Setup Complete!</h2>
        </div>
        <div className="profile-setup-complete-body">
          <p className="profile-setup-complete-message">
            Your profile setup is complete! All your information has been saved and you can access it anytime in your profile.
          </p>
          <p className="profile-setup-complete-message">
            Ready for the next step? Select a school and generate your first personalized essay.
          </p>
        </div>
        <div className="profile-setup-complete-footer">
          <button 
            className="profile-setup-complete-button-primary"
            onClick={handleGoToSchools}
          >
            Let's get started
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupComplete;