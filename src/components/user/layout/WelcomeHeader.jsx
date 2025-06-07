import React, { useState, useEffect, useRef } from 'react';
import AnimatedLogo from '../../Layout/AnimatedLogo.jsx';
import './WelcomeHeader.css';

const WelcomeHeader = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const headerRef = useRef(null);
  const messageRef = useRef(null);

  // Messages d'accueil selon l'heure avec plus de variété
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    // Messages du matin (5h-12h)
    const morningMessages = [
      'Good morning',
      'Rise and shine',
      'Fresh start today',
      'Morning energy',
      'Ready to achieve',
      'New day, new goals'
    ];
    
    // Messages de l'après-midi (12h-17h)
    const afternoonMessages = [
      'Good afternoon',
      'Midday focus',
      'Productive afternoon',
      'Keep the momentum',
      'Crushing it today',
      'Afternoon power'
    ];
    
    // Messages du soir (17h-22h)
    const eveningMessages = [
      'Good evening',
      'Evening session',
      'Winding down well',
      'End strong',
      'Evening productivity',
      'Almost there'
    ];
    
    // Messages de nuit (22h-5h)
    const nightMessages = [
      'Working late',
      'Night dedication',
      'Burning the midnight oil',
      'Late night focus',
      'Night owl mode',
      'Dedicated hours'
    ];
    
    // Messages de weekend
    const weekendMessages = [
      'Happy weekend',
      'Weekend vibes',
      'Enjoy your time',
      'Weekend energy',
      'Recharge time',
      'Weekend mode on'
    ];
    
    // Logique de sélection
    let messagePool = [];
    
    if (day === 0 || day === 6) { // Weekend
      messagePool = weekendMessages;
    } else if (hour >= 5 && hour < 12) {
      messagePool = morningMessages;
    } else if (hour >= 12 && hour < 17) {
      messagePool = afternoonMessages;
    } else if (hour >= 17 && hour < 22) {
      messagePool = eveningMessages;
    } else {
      messagePool = nightMessages;
    }
    
    // Sélection aléatoire
    return messagePool[Math.floor(Math.random() * messagePool.length)];
  };

  // Récupérer le nom de l'utilisateur
  const getUserFullName = () => {
    // Essayer de récupérer depuis localStorage d'abord
    const storedName = localStorage.getItem('userFullName');
    if (storedName) {
      return storedName;
    }
    
    // Essayer de récupérer depuis le contexte utilisateur ou une API
    // TODO: Intégrer avec le système d'authentification
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.fullName) {
      return user.fullName;
    }
    
    // Fallback vers un nom par défaut
    return 'Futur Médecin';
  };

  // Fonction pour changer le message avec morphing
  const changeMessageWithMorphing = () => {
    if (isChanging) return;
    
    setIsChanging(true);
    
    // Ajouter classe morphing
    if (messageRef.current) {
      messageRef.current.classList.add('morphing');
    }
    
    // Changer le message après l'animation de sortie
    setTimeout(() => {
      setCurrentMessage(getWelcomeMessage());
    }, 300);
    
    // Retirer la classe après l'animation complète
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.classList.remove('morphing');
      }
      setIsChanging(false);
    }, 700);
  };

  // Effet parallax au scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollY = window.scrollY;
        const parallaxValue = scrollY * 0.3; // Effet subtil
        headerRef.current.style.setProperty('--scroll-y', `${parallaxValue}px`);
        
        if (scrollY > 50) {
          headerRef.current.classList.add('parallax');
        } else {
          headerRef.current.classList.remove('parallax');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Définir le message initial
    setCurrentMessage(getWelcomeMessage());
    
    // Récupérer le nom de l'utilisateur
    setUserFullName(getUserFullName());
    
    // Écouter les changements du localStorage pour mettre à jour le nom
    const handleStorageChange = () => {
      setUserFullName(getUserFullName());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Changer le message automatiquement (toutes les 8 minutes)
    const messageInterval = setInterval(() => {
      changeMessageWithMorphing();
    }, 480000);
    
    return () => {
      clearInterval(messageInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Effet de vibration tactile (si supporté)
  const handleLogoClick = () => {
    // Vibration tactile sur mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Changer le message
    changeMessageWithMorphing();
  };

  const handleMessageClick = () => {
    // Vibration tactile sur mobile
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    // Changer le message
    changeMessageWithMorphing();
  };

  return (
    <header 
      className="welcome-header" 
      ref={headerRef}
    >
      <div className="welcome-container">
        <div className="welcome-main">
          <div className="welcome-content-with-logo">
            <div onClick={handleLogoClick}>
              <AnimatedLogo />
            </div>
            <div className="welcome-text">
              <h1 
                className="welcome-message"
                ref={messageRef}
                onClick={handleMessageClick}
                title="Click to change message"
              >
                {currentMessage}, {userFullName}
              </h1>
              <p className="welcome-inspiration">
                Dream big, work hard, stay focused
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WelcomeHeader; 