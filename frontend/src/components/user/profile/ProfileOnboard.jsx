import React, { useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import './ProfileOnboard.css';

const ProfileOnboard = ({ userName, onSetupProfile }) => {
  const modalRef = useRef(null);

  // Fonction pour centrer le modal
  const centerModal = () => {
    if (!modalRef.current) return;

    const modalElement = modalRef.current;
    const modalRect = modalElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculer la position de scroll désirée pour centrer le modal
    const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
    const finalScrollTop = Math.max(0, desiredScrollTop);

    // Effectuer le scroll de la fenêtre avec animation fluide
    window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
  };

  // Centrer le modal et verrouiller le scroll au montage
  useEffect(() => {
    // Verrouiller le scroll du body
    document.body.style.overflow = 'hidden';
    
    // Centrer le modal avec un délai
    const timer = setTimeout(() => {
      centerModal();
    }, 50);

    return () => {
      // Restaurer le scroll du body
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="onboard-container" ref={modalRef}>
      <div className="onboard-card">
        <div className="onboard-header">
          <div className="onboard-sparkle-icon">
            <Sparkles size={24} />
          </div>
          <h2 className="onboard-title">Welcome to MedSchool Copilot!</h2>
        </div>
        
        <div className="onboard-content">
          <p className="onboard-message">
            Congratulations {userName || 'there'}! You have successfully created your free trial account.
          </p>
          <p className="onboard-description">
            You're now ready to start your journey toward medical school admission. Our platform provides personalized insights, application guidance, and essay refinement tools designed specifically for pre-med students.
          </p>
          
          <div className="onboard-trial-badge">
            <Award size={18} />
            <span className="onboard-badge-label">Free Trial:</span>
            <span className="onboard-badge-value">0/1 essay used</span>
          </div>
          
          <button className="onboard-setup-button" onClick={onSetupProfile}>
            <span>Set Up Your Profile Now!</span>
            <ArrowRight size={18} />
          </button>
          
          <p className="onboard-note">
            Complete your profile to receive tailored school recommendations and application strategies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileOnboard;