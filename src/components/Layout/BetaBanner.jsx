import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BetaBanner.css'; // Assurez-vous que le chemin est correct

// Composant avec animation de sortie
const BetaBanner = ({ onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  // Gestion améliorée de la fermeture avec animation
  const handleClose = () => {
    setIsExiting(true);
    
    // Délai pour permettre l'animation avant de retirer complètement du DOM
    setTimeout(() => {
      onClose();
    }, 300); // Correspond à la durée de transition dans le CSS
  };

  // Logique pour la redirection vers le composant SignUp
  const handleSignUpClick = (e) => {
    e.preventDefault(); 
    navigate('/signUp', { state: { activeTab: 'signup' } });
    window.scrollTo(0, 0);
  };

  return (
    <div className={`beta-banner ${isExiting ? 'beta-banner--exiting' : ''}`}>
      <p className="beta-banner__text">
        Now in beta for the 2025-2026 admissions cycle. <a href="#" onClick={handleSignUpClick} className="beta-banner__link">Sign up for an account</a> to get early access.
      </p>
      <button
        className="beta-banner__close"
        onClick={handleClose}
        aria-label="Fermer le bandeau Bêta"
      >
        &times; {/* Symbole de croix */}
      </button>
    </div>
  );
};

export default BetaBanner;