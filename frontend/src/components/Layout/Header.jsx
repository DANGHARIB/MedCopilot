import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ hideHero = false, additionalClass = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation vers une section avec défilement doux
  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Fermer le menu mobile après la navigation
    setMobileMenuOpen(false);
  };

  // Navigation spécifique pour le CTA principal
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    // Fermer le menu mobile après la navigation
    setMobileMenuOpen(false);
  };
  
  // Vérifier si nous sommes sur une page nécessitant un fond d'en-tête solide
  const isInnerPage = location.pathname !== '/' || hideHero;

  // Simplifier la construction des classes
  const headerClasses = [
    'header',
    (isScrolled || isInnerPage) ? 'header--scrolled-or-inner' : '',
    additionalClass
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses.trim()}>
      <div className="header__container">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="header__logo">
          <AnimatedLogo />
        </Link>
        
        {/* Navigation Desktop */}
        <nav className="header__nav">
          <div className="header__nav-items">
            <button 
              onClick={() => scrollToSection('features')}
              className="header__nav-item"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="header__nav-item"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="header__nav-item"
            >
              Pricing
            </button>
            {/* <button 
              onClick={() => scrollToSection('school-match')}
              className="header__nav-item"
            >
              Try Now
            </button> */}
            <Link 
              to="/about" 
              className={`header__nav-item ${location.pathname === '/about' ? 'header__nav-item--active' : ''}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              About
            </Link>
          </div>

          <div className="header__actions">
            <Link 
              to="/signUp" 
              className="header__action header__action--secondary"
              onClick={() => handleNavigation('/signUp')}
            >
              Get Started
            </Link>
            <Link 
              to="/signIn" 
              className="header__action header__action--cta"
              onClick={() => handleNavigation('/signIn')}
            >
              Sign In
            </Link>
          </div>
        </nav>
        
        {/* Bouton Menu Mobile */}
        <button 
          className="header__menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Navigation Mobile */}
      <div className={`header__mobile-menu ${mobileMenuOpen ? 'header__mobile-menu--open' : ''}`}>
        <div className="header__mobile-container">
          <div className="header__mobile-nav">
            <button 
              className="header__mobile-item"
              onClick={() => scrollToSection('features')}
            >
              Features
            </button>
            <button 
              className="header__mobile-item"
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </button>
            <button 
              className="header__mobile-item"
              onClick={() => scrollToSection('pricing')}
            >
              Pricing
            </button>
            <button 
              className="header__mobile-item"
              onClick={() => scrollToSection('school-match')}
            >
              Try Now
            </button>
            <Link 
              to="/about" 
              className="header__mobile-item"
              onClick={() => window.scrollTo(0, 0)}
            >
              About
            </Link>
            <Link
              to="/signIn"
              className="header__mobile-item"
              onClick={() => handleNavigation('/signIn')}
            >
              Sign In
            </Link>
          </div>
          
          <button 
            className="header__mobile-cta"
            onClick={() => handleNavigation('/signUp')}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;