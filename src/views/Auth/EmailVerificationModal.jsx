import React, { useState, useRef, useEffect } from 'react';
import './OTPVerificationModal.css'; // Réutilisation du style existant

const EmailVerificationModal = ({ isOpen, onClose, email, onLogin }) => {
  const [countdown, setCountdown] = useState(20); // 20 seconds countdown
  const [loginEnabled, setLoginEnabled] = useState(false);
  const modalRef = useRef(null); // Référence pour le contenu du modal
  
  // Timer countdown effect
  useEffect(() => {
    if (!isOpen) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Activer le bouton de login après le countdown
      setLoginEnabled(true);
    }
  }, [isOpen, countdown]);
  
  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    // Si le clic est sur l'overlay (et pas sur le contenu du modal)
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Formatter le temps en MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Gérer le clic sur le bouton Login
  const handleLoginClick = () => {
    onLogin();
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay" onClick={handleOverlayClick}>
      <div className="otp-modal" ref={modalRef}>
        <div className="otp-modal-content">
          <button 
            type="button" 
            className="back-button" 
            onClick={onClose}
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            Back
          </button>

          <h2>Verify your email address</h2>
          <p className="email-message">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          
          <div className="verification-content">
            <div className="verification-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            
            <div className="verification-instructions">
              <p>
                Please check your email inbox and click the verification link to activate your account.
                If you don't see it, please check your spam folder as well.
              </p>
              
              <div className="action-buttons">
                <button 
                  type="button"
                  className={`verify-button ${!loginEnabled ? 'disabled' : ''}`}
                  disabled={!loginEnabled}
                  onClick={handleLoginClick}
                >
                  {loginEnabled ? 'Go to Login' : `Wait ${formatTime(countdown)}`}
                </button>
              </div>
              
              <div className="help-section">
                <p>
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    type="button" 
                    className="try-different"
                    onClick={onClose}
                  >
                    try a different email address
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal; 