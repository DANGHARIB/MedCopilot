import React, { useEffect, useRef } from 'react';
import './AnimatedLogo.css'; // Importer le fichier CSS dédié

const AnimatedLogo = () => {
  // Utiliser useRef sans type générique en JS
  const logoContainerRef = useRef(null);

  useEffect(() => {
    // Appliquer directement les classes d'animation sans utiliser IntersectionObserver
    const currentRef = logoContainerRef.current;
    if (currentRef) {
      currentRef.classList.add('animated-logo--visible');
      currentRef.classList.remove('animated-logo--hidden');
    }
  }, []);

  return (
    // Appliquer les classes CSS dédiées
    <div ref={logoContainerRef} className="animated-logo animated-logo--hidden">
      <img 
        // Assurez-vous que ce chemin est correct par rapport à votre dossier public ou configuration
        src="/lovable-uploads/medLogoBeta.png" 
        alt="Medschool Copilot" 
        className="animated-logo__image" // Classe pour l'image elle-même
      />
    </div>
  );
};

export default AnimatedLogo; 