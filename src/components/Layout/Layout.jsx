import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import BetaBanner from './BetaBanner.jsx';
import Footer from './Footer.jsx';
import { ArrowUp } from 'lucide-react';
import './Layout.css';

export const Layout = ({ children, hideHero = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- State pour BetaBanner ---
  // Initialiser à true pour toujours afficher la bannière au chargement
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // Gérer la fermeture de la bannière
  const handleCloseBanner = () => {
    setIsBannerVisible(false);
    // Nous ne stockons plus dans localStorage pour éviter que la bannière reste cachée définitivement
    // Retiré: localStorage.setItem('betaBannerDismissed', 'true');
  };

  // Configure the event listener for scrolling (Header & BackToTop)
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(prevIsScrolled => scrolled !== prevIsScrolled ? scrolled : prevIsScrolled);

      const shouldShowButton = window.scrollY > 200;
      setShowBackToTop(prevShowBackToTop => shouldShowButton !== prevShowBackToTop ? shouldShowButton : prevShowBackToTop);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Conditional classes for Header and Layout container
  const headerClass = isScrolled || hideHero ? 'header--scrolled-or-inner' : '';
  // Ajoute la classe layout--banner-visible dynamiquement
  const layoutContainerClass = `layout-container ${isBannerVisible ? 'layout--banner-visible' : ''}`;

  // Déterminer la classe pour le contenu principal
  const mainContentClass = hideHero ? 'layout__main-content-with-padding' : 'layout__main-content';

  return (
    <div className={layoutContainerClass}>
      {/* Passe la classe conditionnelle au Header */}
      <Header hideHero={hideHero} additionalClass={headerClass} />

      {/* Rendu conditionnel de BetaBanner + passage de la fonction de fermeture */}
      {isBannerVisible && <BetaBanner onClose={handleCloseBanner} />}

      {/* Utilisation de la classe conditionnelle pour le contenu principal */}
      <main className={mainContentClass}>
        {children}
      </main>

      <Footer />

      {/* Bouton BackToTop */}
      <button
        className={`layout__back-to-top ${showBackToTop ? 'layout__back-to-top--visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Retour en haut de page"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default Layout;